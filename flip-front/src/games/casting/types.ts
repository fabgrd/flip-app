export type CastingStep =
  | 'rules'
  | 'pick-devin'
  | 'scenario'
  | 'handoff'
  | 'reveal-number'
  | 'perform'
  | 'guess'
  | 'results';

export interface CastingResult {
  playerIdx: number;
  real: number;
  guess: number;
  ecart: number;
  playerSips: number;
  devinSips: number;
  tag: 'PILE POIL' | 'PRESQUE' | 'RATÉ';
}
