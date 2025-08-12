import type { Player } from '../../types';

export type CameleonRole = 'civilian' | 'cameleon' | 'mrWhite';

export interface CameleonAssignedPlayer extends Player {
  role: CameleonRole;
  secretWord: string | null;
  isEliminated: boolean;
  scoreBonus?: number;
  mrWhiteGuess?: string;
  mrWhiteGuessCorrect?: boolean;
}

export interface CameleonWordPair {
  civilianWord: string;
  cameleonWord: string;
}

export interface CameleonGameState {
  players: CameleonAssignedPlayer[];
  wordPair: CameleonWordPair | null;
  round: number;
  started: boolean;
}

export interface CameleonRoleDistribution {
  undercovers: number;
  mrWhites: number;
}

export interface StartCameleonOptions {
  overrideDistribution?: Partial<CameleonRoleDistribution>;
}
