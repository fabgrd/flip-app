// =============================================================================
// GENERAL TYPES FOR ALL GAMES
// =============================================================================

// =============================================================================
// GAME-SPECIFIC TYPES (Legacy - To be migrated progressively)
// =============================================================================

// Import purity-test types for compatibility
import type {
  PlayerAnswer,
  PurityGameState,
  PurityPlayer,
  PurityResults,
  Question,
  Theme,
} from '../games/purity-test/types';

export interface Player {
  id: string;
  name: string;
  avatar?: string; // Image URI or undefined to use default avatar
}

export interface GameMetadata {
  id: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  description: string;
  estimatedDuration?: number; // in minutes
  category?: 'party' | 'strategy' | 'trivia' | 'action';
  difficulty?: 'easy' | 'medium' | 'hard';
}

// =============================================================================
// STANDARD INTERFACE FOR ALL GAMES
// =============================================================================

export interface GameRule<TGameState, TGameResult> {
  /** Game metadata */
  metadata: GameMetadata;

  /** Player validation for this game */
  validatePlayers: (players: Player[]) => { isValid: boolean; error?: string };

  /** Game state initialization */
  initializeGame: (players: Player[]) => TGameState;

  /** Final results calculation */
  calculateResults: (gameState: TGameState) => TGameResult;

  /** Main game screen component */
  GameScreen: React.ComponentType<{ players: Player[] }>;

  /** Results component (optional) */
  ResultsScreen?: React.ComponentType<{ results: TGameResult }>;

  /** Navigation routes configuration */
  routes: {
    game: string;
    results?: string;
  };
}

// =============================================================================
// NAVIGATION TYPES
// =============================================================================

export type RootStackParamList = {
  Home: undefined;
  GameSelect: { players: Player[] };
  Settings: undefined;

  // Games
  PurityTest: { players: Player[] };
  PurityResults: { results: PurityResults };
  Cameleon: { players: Player[] };
  CameleonResults: { players: Player[] };

  // Left Right game
  LeftRight: { players: Player[] };
  LeftRightResults: { results: import('../games/left-right/types').PoliticalResults };

  // Paranoia
  Paranoia: { players: Player[] };

  // Medusa
  Medusa: { players: Player[] };

  // Apero
  Apero: { players: Player[] };

  // Casting
  Casting: { players: Player[] };

  // Red Flag
  RedFlag: { players: Player[] };
};

// =============================================================================
// REUSABLE COMMON TYPES
// =============================================================================

export interface BaseGameState {
  players: Player[];
  isGameFinished: boolean;
  startedAt: Date;
  finishedAt?: Date;
}

export interface BaseGameResult {
  players: Player[];
  rankings: Array<{
    player: Player;
    rank: number;
    score?: number;
    stats?: Record<string, string | number | boolean>;
  }>;
  gameMetadata: GameMetadata;
  duration: number; // in seconds
}

export type { PlayerAnswer, PurityGameState, PurityPlayer, PurityResults, Question, Theme };

// Extensions for specific game navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
      PurityTest: { players: Player[] };
      PurityResults: { results: PurityResults };
    }
  }
}
