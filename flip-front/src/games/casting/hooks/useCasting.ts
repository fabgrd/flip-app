import { useCallback, useMemo, useState } from 'react';
import type { Player } from '../../../types';
import type { CastingTheme } from '../constants';
import type { CastingStep } from '../types';

function shuffleNumbers(): number[] {
  const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

export function useCasting(initialPlayers: Player[]) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [step, setStep] = useState<CastingStep>('rules');
  const [devinIdx, setDevinIdx] = useState<number | null>(null);
  const [scenario, setScenario] = useState('');
  const [numbers, setNumbers] = useState<Record<number, number>>({});
  const [curPos, setCurPos] = useState(0);
  const [guessPos, setGuessPos] = useState(0);
  const [guesses, setGuesses] = useState<Record<number, number>>({});
  const [selectedThemes, setSelectedThemes] = useState<CastingTheme[]>(['daily']);
  const [totalRounds, setTotalRounds] = useState<number>(1);

  const toggleTheme = useCallback((theme: CastingTheme) => {
    setSelectedThemes((prev) => {
      const isOn = prev.includes(theme);
      const next = isOn ? prev.filter((t) => t !== theme) : [...prev, theme];
      return next.length === 0 ? ['daily'] : next;
    });
  }, []);

  const { actors, actorIndices } = useMemo(() => {
    if (devinIdx === null) return { actors: [] as Player[], actorIndices: [] as number[] };
    const a: Player[] = [];
    const ai: number[] = [];
    players.forEach((p, i) => {
      if (i !== devinIdx) {
        a.push(p);
        ai.push(i);
      }
    });
    return { actors: a, actorIndices: ai };
  }, [devinIdx, players]);

  const pickDevin = useCallback(
    (idx: number, chosenScenario: string) => {
      setDevinIdx(idx);
      setScenario(chosenScenario);
      const numPool = shuffleNumbers();
      const nums: Record<number, number> = {};
      let k = 0;
      players.forEach((_, i) => {
        if (i !== idx) {
          nums[i] = numPool[k++];
        }
      });
      setNumbers(nums);
      setStep('scenario');
    },
    [players],
  );

  const startActors = useCallback(() => {
    setCurPos(0);
    setStep('handoff');
  }, []);

  const advanceReveal = useCallback(() => {
    setCurPos((pos) => {
      if (pos + 1 < actors.length) {
        setStep('handoff');
        return pos + 1;
      }
      setStep('perform');
      return pos;
    });
  }, [actors.length]);

  const startGuesses = useCallback(() => {
    setGuessPos(0);
    setStep('guess');
  }, []);

  const submitGuess = useCallback(
    (actorIdx: number, num: number) => {
      setGuesses((prev) => ({ ...prev, [actorIdx]: num }));
      setGuessPos((pos) => {
        if (pos + 1 < actors.length) return pos + 1;
        setStep('results');
        return pos;
      });
    },
    [actors.length],
  );

  return {
    players,
    setPlayers,
    step,
    setStep,
    devinIdx,
    scenario,
    numbers,
    curPos,
    guessPos,
    guesses,
    selectedThemes,
    totalRounds,
    setTotalRounds,
    toggleTheme,
    actors,
    actorIndices,
    pickDevin,
    startActors,
    advanceReveal,
    startGuesses,
    submitGuess,
  };
}
