import { useCallback, useMemo, useState } from 'react';
import type { Player } from '../../../types';
import { DEFAULT_DISTRIBUTION_BY_PLAYER_COUNT, WORD_PAIRS } from '../constants';
import type {
  CameleonAssignedPlayer,
  CameleonGameState,
  CameleonRoleDistribution,
  StartCameleonOptions,
} from '../types';

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export type CameleonPhase = 'settings' | 'reveal' | 'clues' | 'vote' | 'results';

function normalizeForCompare(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function useCameleon(initialPlayers: Player[]) {
  const [gameState, setGameState] = useState<CameleonGameState>({
    players: initialPlayers.map(
      (p) =>
        ({
          ...p,
          role: 'civilian',
          secretWord: null,
          isEliminated: false,
        }) as CameleonAssignedPlayer,
    ),
    wordPair: null,
    round: 0,
    started: false,
  });

  const [phase, setPhase] = useState<CameleonPhase>('settings');
  const [revealIndex, setRevealIndex] = useState(0);
  const [clueOrder, setClueOrder] = useState<string[]>([]); // tableau d'IDs joueurs dans l'ordre
  const [selectedForElimination, setSelectedForElimination] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'civilians' | 'undercover' | null>(null);

  const [mrWhiteToGuessId, setMrWhiteToGuessId] = useState<string | null>(null);

  const playerCount = initialPlayers.length;

  const defaultDistribution: CameleonRoleDistribution = useMemo(() => {
    const entry = DEFAULT_DISTRIBUTION_BY_PLAYER_COUNT[playerCount];
    if (entry) return entry;
    if (playerCount <= 4) return { undercovers: 1, mrWhites: 0 };
    if (playerCount <= 6) return { undercovers: 1, mrWhites: 1 };
    if (playerCount <= 8) return { undercovers: 2, mrWhites: 1 };
    return { undercovers: 3, mrWhites: 1 };
  }, [playerCount]);

  const startGame = useCallback(
    (options?: StartCameleonOptions) => {
      const override = options?.overrideDistribution ?? {};
      const maxImpostors = Math.floor(playerCount / 2);
      let undercovers = Math.max(
        0,
        Math.min(playerCount, override.undercovers ?? defaultDistribution.undercovers),
      );
      let mrWhites = Math.max(
        0,
        Math.min(playerCount - undercovers, override.mrWhites ?? defaultDistribution.mrWhites),
      );
      // Cap total impostors to maxImpostors (treating Mr White as an impostor)
      if (undercovers + mrWhites > maxImpostors) {
        // Reduce Mr Whites first, then undercovers if needed
        const overflow = undercovers + mrWhites - maxImpostors;
        const reduceFromMW = Math.min(mrWhites, overflow);
        mrWhites -= reduceFromMW;
        const remainingOverflow = overflow - reduceFromMW;
        if (remainingOverflow > 0) {
          undercovers = Math.max(0, undercovers - remainingOverflow);
        }
      }
      const civilians = Math.max(0, playerCount - undercovers - mrWhites);

      const shuffledPlayers = shuffleArray(initialPlayers);
      const wordPair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];

      const assigned: CameleonAssignedPlayer[] = [];

      for (let i = 0; i < undercovers; i++) {
        const base = shuffledPlayers.shift();
        if (!base) break;
        assigned.push({
          ...base,
          role: 'cameleon',
          secretWord: wordPair.cameleonWord,
          isEliminated: false,
        });
      }

      for (let i = 0; i < mrWhites; i++) {
        const base = shuffledPlayers.shift();
        if (!base) break;
        assigned.push({ ...base, role: 'mrWhite', secretWord: null, isEliminated: false });
      }

      for (let i = 0; i < civilians; i++) {
        const base = shuffledPlayers.shift();
        if (!base) break;
        assigned.push({
          ...base,
          role: 'civilian',
          secretWord: wordPair.civilianWord,
          isEliminated: false,
        });
      }

      const finalOrder = shuffleArray(assigned);

      setGameState({
        players: finalOrder,
        wordPair,
        round: 1,
        started: true,
      });
      setRevealIndex(0);
      setSelectedForElimination(null);
      setClueOrder([]);
      setGameOver(false);
      setWinner(null);
      setMrWhiteToGuessId(null);
      setPhase('reveal');
    },
    [initialPlayers, playerCount, defaultDistribution],
  );

  const currentRevealPlayer = useMemo(
    () => gameState.players[revealIndex] ?? null,
    [gameState.players, revealIndex],
  );

  const revealNext = useCallback(() => {
    setRevealIndex((prev) => {
      const next = prev + 1;
      if (next >= gameState.players.length) {
        // Générer ordre d'indices aléatoire
        const order = shuffleArray(gameState.players.map((p) => p.id));
        setClueOrder(order);
        setPhase('clues');
        return prev; // index reste à la fin
      }
      return next;
    });
  }, [gameState.players]);

  const beginVote = useCallback(() => {
    setPhase('vote');
    setSelectedForElimination(null);
  }, []);

  const selectElimination = useCallback((playerId: string) => {
    setSelectedForElimination(playerId);
  }, []);

  const confirmElimination = useCallback(() => {
    if (!selectedForElimination) return;
    const eliminatedBefore = gameState.players.find((p) => p.id === selectedForElimination) || null;
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((p) =>
        p.id === selectedForElimination ? { ...p, isEliminated: true } : p,
      );

      const eliminated = updatedPlayers.find((p) => p.id === selectedForElimination)!;

      // If Mr White is eliminated, open guess modal and do not proceed to results yet
      if (eliminated.role === 'mrWhite') {
        setMrWhiteToGuessId(eliminated.id);
        return { ...prev, players: updatedPlayers };
      }

      // Compute alive counts after elimination
      const alive = updatedPlayers.filter((p) => !p.isEliminated);
      const civiliansAlive = alive.filter((p) => p.role === 'civilian').length;
      const impostorsAlive = alive.filter(
        (p) => p.role === 'cameleon' || p.role === 'mrWhite',
      ).length;

      // Game over conditions
      if (impostorsAlive === 0) {
        setGameOver(true);
        setWinner('civilians');
      } else if (impostorsAlive >= civiliansAlive) {
        setGameOver(true);
        setWinner('undercover');
      } else {
        setGameOver(false);
        setWinner(null);
      }

      return {
        ...prev,
        players: updatedPlayers,
      };
    });
    // Only go to results if eliminated wasn't Mr White
    if (!eliminatedBefore || eliminatedBefore.role !== 'mrWhite') {
      setPhase('results');
    }
  }, [selectedForElimination, gameState.players]);

  const submitMrWhiteGuess = useCallback(
    (guessRaw: string) => {
      const guess = guessRaw;
      const guessNorm = normalizeForCompare(guessRaw);
      if (!mrWhiteToGuessId || !gameState.wordPair) return;

      setGameState((prev) => {
        const civilianWordNorm = normalizeForCompare(prev.wordPair!.civilianWord);
        const isCorrect = guessNorm.length > 0 && guessNorm === civilianWordNorm;

        const updatedPlayers = prev.players.map((p) => {
          if (p.id !== mrWhiteToGuessId) return p;
          const bonus = isCorrect ? 5 : 0;
          const current = p.scoreBonus ?? 0;
          return {
            ...p,
            scoreBonus: current + bonus,
            mrWhiteGuess: guess,
            mrWhiteGuessCorrect: isCorrect,
          } as CameleonAssignedPlayer;
        });

        return { ...prev, players: updatedPlayers };
      });

      // Close modal and proceed to results flow
      setMrWhiteToGuessId(null);

      // Now that Mr White guess is resolved, compute results based on the already-eliminated player
      setGameState((prev) => {
        const alive = prev.players.filter((p) => !p.isEliminated);
        const civiliansAlive = alive.filter((p) => p.role === 'civilian').length;
        const impostorsAlive = alive.filter(
          (p) => p.role === 'cameleon' || p.role === 'mrWhite',
        ).length;

        if (impostorsAlive === 0) {
          setGameOver(true);
          setWinner('civilians');
        } else if (impostorsAlive >= civiliansAlive) {
          setGameOver(true);
          setWinner('undercover');
        } else {
          setGameOver(false);
          setWinner(null);
        }
        return prev;
      });

      setPhase('results');
    },
    [mrWhiteToGuessId, gameState.wordPair],
  );

  const proceedAfterResults = useCallback(() => {
    if (!gameOver) {
      // Nouvelle manche: réinitialiser la sélection, regénérer l'ordre, revenir aux indices
      setSelectedForElimination(null);
      const order = shuffleArray(gameState.players.filter((p) => !p.isEliminated).map((p) => p.id));
      setClueOrder(order);
      setPhase('clues');
    }
  }, [gameOver, gameState.players]);

  const resetGame = useCallback(() => {
    setGameState({
      players: initialPlayers.map(
        (p) =>
          ({
            ...p,
            role: 'civilian',
            secretWord: null,
            isEliminated: false,
          }) as CameleonAssignedPlayer,
      ),
      wordPair: null,
      round: 0,
      started: false,
    });
    setRevealIndex(0);
    setClueOrder([]);
    setSelectedForElimination(null);
    setGameOver(false);
    setWinner(null);
    setMrWhiteToGuessId(null);
    setPhase('settings');
  }, [initialPlayers]);

  return {
    gameState,
    defaultDistribution,
    startGame,
    resetGame,
    // phases
    phase,
    setPhase,
    // reveal
    currentRevealPlayer,
    revealIndex,
    revealNext,
    // clues
    clueOrder,
    beginVote,
    // vote
    selectedForElimination,
    selectElimination,
    confirmElimination,
    // results
    gameOver,
    winner,
    proceedAfterResults,
    // mr white
    mrWhiteToGuessId,
    submitMrWhiteGuess,
  };
}
