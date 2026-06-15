export const AP_VALS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'V', 'D', 'R', 'A'] as const;
export type ApVal = (typeof AP_VALS)[number];

export const AP_PTS: Record<ApVal, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  V: 11,
  D: 12,
  R: 13,
  A: 14,
};

export const AP_SUITS = ['♠', '♥', '♦', '♣'] as const;

export type ApCard = { s: string; v: ApVal; p: number };
export type PlayedCard = ApCard & { found: boolean; flipped: boolean };
export type ApStep = 'rules' | 'pick' | 'play' | 'special' | 'dealer-win' | 'end';
export type RoundPhase = 'g1' | 'hint' | 'g2' | 'result';

export function apDeck(): ApCard[] {
  const cards: ApCard[] = [];
  for (const v of AP_VALS) {
    for (const s of AP_SUITS) {
      cards.push({ s, v, p: AP_PTS[v] });
    }
  }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
