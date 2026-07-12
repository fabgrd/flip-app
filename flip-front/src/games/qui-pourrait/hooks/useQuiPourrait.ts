import { useCallback, useMemo, useState } from 'react';
import type { Player } from '../../../types';
import { shuffleArray } from '../../../utils/array';
import type { QuiPourraitStep } from '../types';

export function useQuiPourrait(initialPlayers: Player[]) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [step, setStep] = useState<QuiPourraitStep>('rules');
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(5);
  const [voter, setVoter] = useState(0);
  const [votes, setVotes] = useState<number[]>([]);
  const [scores, setScores] = useState<number[]>(() => initialPlayers.map(() => 0));
  const [promptOrder, setPromptOrder] = useState<string[]>([]);

  const currentPrompt = promptOrder.length > 0 ? promptOrder[round % promptOrder.length] : '';
  const isLastRound = round + 1 >= totalRounds;

  // Décompte des voix du round courant
  const counts = useMemo(
    () => players.map((_, i) => votes.filter((v) => v === i).length),
    [players, votes],
  );

  // Élu·e·s : le(s) plus pointé·e·s du round
  const winners = useMemo(() => {
    const max = Math.max(...counts, 0);
    if (max === 0) return [];
    return counts.map((c, i) => (c === max ? i : -1)).filter((i) => i >= 0);
  }, [counts]);

  // Rules → première question, avec le pool de prompts filtré (thèmes + tiers)
  const startGame = useCallback((pool: string[]) => {
    setPromptOrder(shuffleArray(pool));
    setRound(0);
    setScores((s) => s.map(() => 0));
    setStep('prompt');
  }, []);

  // Prompt → passage du tel au premier votant
  const beginVoting = useCallback(() => {
    setVoter(0);
    setVotes([]);
    setStep('handoff');
  }, []);

  // Vote secret d'un joueur (une ou plusieurs cibles) → votant suivant ou décompte
  const castVote = useCallback(
    (targetIdxs: number[]) => {
      setVotes((v) => [...v, ...targetIdxs]);
      if (voter + 1 < players.length) {
        setVoter((v) => v + 1);
        setStep('handoff');
      } else {
        setStep('tally');
      }
    },
    [voter, players.length],
  );

  // Tally → révélation : les élus marquent un point
  const reveal = useCallback(() => {
    setScores((s) => s.map((v, i) => v + (winners.includes(i) ? 1 : 0)));
    setStep('result');
  }, [winners]);

  const nextRound = useCallback(() => {
    if (round + 1 >= totalRounds) {
      setStep('end');
    } else {
      setRound((r) => r + 1);
      setStep('prompt');
    }
  }, [round, totalRounds]);

  const restart = useCallback(() => {
    setStep('rules');
    setRound(0);
    setVoter(0);
    setVotes([]);
    setScores(players.map(() => 0));
    setPromptOrder([]);
  }, [players]);

  return {
    players,
    setPlayers,
    step,
    setStep,
    round,
    totalRounds,
    setTotalRounds,
    voter,
    counts,
    winners,
    scores,
    currentPrompt,
    isLastRound,
    startGame,
    beginVoting,
    castVote,
    reveal,
    nextRound,
    restart,
  };
}
