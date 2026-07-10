export type TheBombStep = 'rules' | 'live' | 'boom' | 'blame' | 'exploded' | 'end';

export type TheBombHistoryEntry = {
  holderIdx: number;
  category: string;
};
