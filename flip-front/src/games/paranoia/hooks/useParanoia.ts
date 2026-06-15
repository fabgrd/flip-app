import { useCallback, useMemo, useState } from 'react';
import type { ContentItem } from '../../../content';
import type { Player } from '../../../types';
import { shuffleArray } from '../../../utils/array';
import type { ParanoiaHistoryEntry, ParanoiaOrder, ParanoiaStep } from '../types';

export function buildParanoiaOrder(
  players: Player[],
  questions: readonly ContentItem[],
): ParanoiaOrder[] {
  if (players.length < 2 || questions.length === 0) return [];
  const idxs = players.map((_, i) => i).sort(() => Math.random() - 0.5);
  const qs = shuffleArray([...questions]).slice(0, players.length);
  return idxs.map((qIdx, i) => {
    const others = players.map((_, j) => j).filter((j) => j !== qIdx);
    const tIdx = others[Math.floor(Math.random() * others.length)];
    return { q: qIdx, t: tIdx, question: qs[i].text };
  });
}

export function useParanoia(initialPlayers: Player[], questions: readonly ContentItem[]) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [order] = useState<ParanoiaOrder[]>(() => buildParanoiaOrder(initialPlayers, questions));
  const [step, setStep] = useState<ParanoiaStep>('rules');
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState<number>(initialPlayers.length);
  const [answer, setAnswer] = useState<number | null>(null);
  const [coin, setCoin] = useState<'pile' | 'face' | null>(null);
  const [chosenSide, setChosenSide] = useState<'pile' | 'face' | null>(null);
  const [history, setHistory] = useState<ParanoiaHistoryEntry[]>([]);

  const cur = order[round];
  const questioner = useMemo(() => players[cur?.q ?? 0], [players, cur]);
  const target = useMemo(() => players[cur?.t ?? 0], [players, cur]);
  const won = chosenSide !== null && coin !== null && chosenSide === coin;
  const maxRounds = Math.min(totalRounds, order.length);

  const goToNext = useCallback(() => {
    if (!cur || answer == null) return;
    const isRevealed = !(chosenSide === coin);
    const entry: ParanoiaHistoryEntry = {
      q: cur.q,
      t: cur.t,
      a: answer,
      question: cur.question,
      revealed: isRevealed,
    };
    setHistory((h) => [...h, entry]);
    setAnswer(null);
    setCoin(null);
    setChosenSide(null);

    if (round + 1 >= maxRounds) {
      setStep('end');
    } else {
      setRound((r) => r + 1);
      setStep('q-handoff');
    }
  }, [cur, answer, chosenSide, coin, round, maxRounds]);

  const restart = useCallback(() => {
    setStep('rules');
    setRound(0);
    setAnswer(null);
    setCoin(null);
    setChosenSide(null);
    setHistory([]);
  }, []);

  return {
    players,
    setPlayers,
    order,
    step,
    setStep,
    round,
    totalRounds,
    setTotalRounds,
    answer,
    setAnswer,
    coin,
    setCoin,
    chosenSide,
    setChosenSide,
    history,
    cur,
    questioner,
    target,
    won,
    goToNext,
    restart,
  };
}
