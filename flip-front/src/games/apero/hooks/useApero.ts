import { useCallback, useMemo, useState } from 'react';
import type { Player } from '../../../types';
import {
  AP_VALS,
  apDeck,
  type ApCard,
  type ApStep,
  type ApVal,
  type PlayedCard,
} from '../types';

export function useApero(initialPlayers: Player[]) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [step, setStep] = useState<ApStep>('rules');
  const [deck] = useState<ApCard[]>(() => apDeck());
  const [dealerIdx, setDealerIdx] = useState(0);
  const [cardPos, setCardPos] = useState(0);
  const [played, setPlayed] = useState<PlayedCard[]>([]);
  const [foundTotal, setFoundTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [rot, setRot] = useState(0);
  const [sips, setSips] = useState<number[]>(() => initialPlayers.map(() => 0));
  const [lastQuad, setLastQuad] = useState<ApVal | null>(null);

  const updatePlayers = useCallback((newPlayers: Player[]) => {
    setPlayers(newPlayers);
    setSips((prev) => newPlayers.map((_, i) => prev[i] ?? 0));
  }, []);

  const guessers = useMemo(
    () => players.map((_, i) => i).filter((i) => i !== dealerIdx),
    [dealerIdx, players],
  );
  const curGuesserIdx = guessers.length > 0 ? guessers[rot % guessers.length] : 0;

  const exhaustedVals = useMemo(
    () =>
      AP_VALS.filter((v) => {
        let count = 0;
        for (const c of played) {
          if (c.v === v) count++;
        }
        return count >= 4;
      }),
    [played],
  );

  const pickDealer = useCallback((idx: number) => {
    setDealerIdx(idx);
    setStep('play');
  }, []);

  const advanceRound = useCallback(
    (found: boolean, penalty: number) => {
      const card = deck[cardPos];
      const newPlayed: PlayedCard[] = [...played, { ...card, found, flipped: false }];
      const ns = [...sips];
      let nStreak = streak;
      let nFound = foundTotal;

      if (found) {
        ns[dealerIdx] += 2;
        nFound++;
        nStreak = 0;
      } else {
        ns[curGuesserIdx] += penalty;
        nStreak++;
      }

      const newCardPos = cardPos + 1;
      const newRot = rot + 1;

      const quadCount = newPlayed.filter((c) => c.v === card.v).length;
      if (quadCount === 4) {
        ns[dealerIdx] += 2;
        const withFlipped = newPlayed.map((c) => (c.v === card.v ? { ...c, flipped: true } : c));
        setSips([...ns]);
        setPlayed(withFlipped);
        setFoundTotal(nFound);
        setStreak(nStreak);
        setCardPos(newCardPos);
        setRot(newRot);
        setLastQuad(card.v);
        setStep('special');
        return;
      }

      setSips(ns);
      setPlayed(newPlayed);
      setFoundTotal(nFound);
      setStreak(nStreak);
      setCardPos(newCardPos);
      setRot(newRot);

      if (newCardPos >= deck.length) setStep('end');
    },
    [cardPos, curGuesserIdx, dealerIdx, deck, foundTotal, played, rot, sips, streak],
  );

  const afterSpecial = useCallback(() => {
    setStep(cardPos >= deck.length ? 'end' : 'play');
  }, [cardPos, deck.length]);

  const passDealer = useCallback(
    (i: number) => {
      setDealerIdx(i);
      setStreak(0);
      setRot(0);
      setStep(cardPos >= deck.length ? 'end' : 'play');
    },
    [cardPos, deck.length],
  );

  const requestDealerPass = useCallback(() => setStep('dealer-win'), []);
  const finishGame = useCallback(() => setStep('end'), []);

  return {
    players,
    updatePlayers,
    step,
    setStep,
    deck,
    dealerIdx,
    cardPos,
    played,
    foundTotal,
    streak,
    rot,
    sips,
    lastQuad,
    guessers,
    curGuesserIdx,
    exhaustedVals,
    pickDealer,
    advanceRound,
    afterSpecial,
    passDealer,
    requestDealerPass,
    finishGame,
  };
}
