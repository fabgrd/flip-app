import { useCallback, useMemo, useState } from 'react';
import type { Player } from '../../../types';
import { shuffleArray } from '../../../utils/array';
import type { TheBombHistoryEntry, TheBombStep } from '../types';

export function useTheBomb(initialPlayers: Player[], categories: readonly string[]) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [categoryOrder] = useState<string[]>(() => shuffleArray([...categories]));
  const [step, setStep] = useState<TheBombStep>('rules');
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(5);
  const [explosions, setExplosions] = useState<number[]>(() => initialPlayers.map(() => 0));
  const [victimIdx, setVictimIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<TheBombHistoryEntry[]>([]);

  const category = useMemo(
    () => (categoryOrder.length > 0 ? categoryOrder[round % categoryOrder.length] : ''),
    [categoryOrder, round],
  );

  const isLastRound = round + 1 >= totalRounds;

  // Blame : on désigne qui tenait le tel → écran "explosé"
  const pickVictim = useCallback(
    (holderIdx: number) => {
      setVictimIdx(holderIdx);
      setHistory((h) => [...h, { holderIdx, category }]);
      setExplosions((e) => e.map((v, i) => (i === holderIdx ? v + 1 : v)));
      setStep('exploded');
    },
    [category],
  );

  // Écran "explosé" → manche suivante ou podium
  const nextRound = useCallback(() => {
    setVictimIdx(null);
    if (round + 1 >= totalRounds) {
      setStep('end');
    } else {
      setRound((r) => r + 1);
      setStep('live');
    }
  }, [round, totalRounds]);

  const restart = useCallback(() => {
    setStep('rules');
    setRound(0);
    setVictimIdx(null);
    setExplosions(players.map(() => 0));
    setHistory([]);
  }, [players]);

  return {
    players,
    setPlayers,
    step,
    setStep,
    round,
    totalRounds,
    setTotalRounds,
    category,
    explosions,
    victimIdx,
    isLastRound,
    history,
    pickVictim,
    nextRound,
    restart,
  };
}
