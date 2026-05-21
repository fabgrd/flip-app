export type ParanoiaStep =
  | 'rules'
  | 'q-handoff'
  | 'q-show'
  | 't-handoff'
  | 't-pick'
  | 'coin'
  | 'reveal'
  | 'end';

export type ParanoiaOrder = {
  q: number;
  t: number;
  question: string;
};

export type ParanoiaHistoryEntry = {
  q: number;
  t: number;
  a: number;
  question: string;
  revealed: boolean;
};

export type ParanoiaResults = {
  history: ParanoiaHistoryEntry[];
  playerNames: string[];
  playerColors: string[];
};
