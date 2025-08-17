// =============================================================================
// TYPES GÉNÉRAUX POUR TOUS LES JEUX
// =============================================================================

// =============================================================================
// TYPES SPÉCIFIQUES AUX JEUX (Legacy - À migrer progressivement)
// =============================================================================

// Import des types du purity-test pour compatibilité
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
  avatar?: string; // URI de l'image ou undefined pour utiliser l'avatar par défaut
}

export interface GameMetadata {
  id: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  description: string;
  estimatedDuration?: number; // en minutes
  category?: 'party' | 'strategy' | 'trivia' | 'action';
  difficulty?: 'easy' | 'medium' | 'hard';
}

// =============================================================================
// INTERFACE STANDARD POUR TOUS LES JEUX
// =============================================================================

export interface GameRule<TGameState, TGameResult> {
  /** Métadonnées du jeu */
  metadata: GameMetadata;

  /** Validation des joueurs pour ce jeu */
  validatePlayers: (players: Player[]) => { isValid: boolean; error?: string };

  /** Initialisation de l'état du jeu */
  initializeGame: (players: Player[]) => TGameState;

  /** Calcul des résultats finaux */
  calculateResults: (gameState: TGameState) => TGameResult;

  /** Composant de l'écran principal du jeu */
  GameScreen: React.ComponentType<{ players: Player[] }>;

  /** Composant des résultats (optionnel) */
  ResultsScreen?: React.ComponentType<{ results: TGameResult }>;

  /** Configuration des routes de navigation */
  routes: {
    game: string;
    results?: string;
  };
}

// =============================================================================
// TYPES DE NAVIGATION
// =============================================================================

export type RootStackParamList = {
  Home: undefined;
  GameSelect: { players: Player[] };
  Settings: undefined;

  // Jeux
  PurityTest: { players: Player[] };
  PurityResults: { results: PurityResults };
  Cameleon: { players: Player[] };
  CameleonResults: { players: Player[] };

  // Routes dynamiques des jeux (seront étendues par chaque jeu)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// =============================================================================
// TYPES COMMUNS RÉUTILISABLES
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
  duration: number; // en secondes
}

export type { PlayerAnswer, PurityGameState, PurityPlayer, PurityResults, Question, Theme };

// Extensions pour la navigation des jeux spécifiques
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
      PurityTest: { players: Player[] };
      PurityResults: { results: PurityResults };
    }
  }
}
