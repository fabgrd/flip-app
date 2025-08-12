// Imports temporairement commentés en attendant la finalisation des types
// import { GameRule, GameMetadata } from '../types';
// import { purityTestGame } from './purity-test/gameRule';

// Types temporaires pour l'implémentation
interface GameMetadata {
  id: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  description: string;
}

// =============================================================================
// REGISTRE CENTRAL DES JEUX
// =============================================================================

export interface GameRegistryEntry {
  metadata: GameMetadata;
  isEnabled: boolean;
  developmentOnly?: boolean;
}

class GameRegistry {
  private games = new Map<string, GameRegistryEntry>();

  /**
   * Enregistre un nouveau jeu dans le registre
   */
  register(
    metadata: GameMetadata,
    options: Omit<GameRegistryEntry, 'metadata'> = { isEnabled: true },
  ) {
    this.games.set(metadata.id, {
      metadata,
      ...options,
    });
  }

  /**
   * Récupère un jeu par son ID
   */
  getGame(gameId: string): GameMetadata | null {
    const entry = this.games.get(gameId);
    return entry?.isEnabled ? entry.metadata : null;
  }

  /**
   * Récupère tous les jeux disponibles
   */
  getAvailableGames(): GameMetadata[] {
    const isDev = __DEV__;
    return Array.from(this.games.values())
      .filter((entry) => entry.isEnabled && (!entry.developmentOnly || isDev))
      .map((entry) => entry.metadata)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Récupère les jeux compatibles avec un nombre de joueurs donné
   */
  getCompatibleGames(playerCount: number): GameMetadata[] {
    return this.getAvailableGames().filter(
      (game) => playerCount >= game.minPlayers && playerCount <= game.maxPlayers,
    );
  }

  /**
   * Vérifie si un jeu existe et est activé
   */
  isGameAvailable(gameId: string): boolean {
    const entry = this.games.get(gameId);
    return entry?.isEnabled || false;
  }

  /**
   * Active/désactive un jeu
   */
  setGameEnabled(gameId: string, enabled: boolean): boolean {
    const entry = this.games.get(gameId);
    if (entry) {
      entry.isEnabled = enabled;
      return true;
    }
    return false;
  }

  /**
   * Liste tous les jeux (même désactivés) pour l'administration
   */
  getAllGames(): Array<{ metadata: GameMetadata; isEnabled: boolean; developmentOnly?: boolean }> {
    return Array.from(this.games.values()).map((entry) => ({
      metadata: entry.metadata,
      isEnabled: entry.isEnabled,
      developmentOnly: entry.developmentOnly,
    }));
  }
}

// =============================================================================
// INSTANCE SINGLETON DU REGISTRE
// =============================================================================

export const gameRegistry = new GameRegistry();

// =============================================================================
// ENREGISTREMENT DES JEUX
// =============================================================================

// Jeux en production (temporairement en dur)
gameRegistry.register(
  {
    id: 'purity-test',
    name: "Test d'Impureté",
    minPlayers: 1,
    maxPlayers: 10,
    description: 'Un jeu de questions pour découvrir qui est le plus pur du groupe !',
  },
  { isEnabled: true },
);

// Nouveau jeu: Cameleon (Undercover-like)
gameRegistry.register(
  {
    id: 'cameleon',
    name: 'Caméléon',
    minPlayers: 4,
    maxPlayers: 10,
    description: "Devinez les imposteurs à partir d'indices... sans dévoiler votre mot !",
  },
  { isEnabled: true },
);

// Jeux en développement (exemples)
// gameRegistry.register(sixQuiPrendGame, { isEnabled: false, developmentOnly: true });
// gameRegistry.register(undercoverGame, { isEnabled: false, developmentOnly: true });

// =============================================================================
// HELPERS POUR LA NAVIGATION
// =============================================================================

/**
 * Helper pour naviguer vers un jeu (version simplifiée temporaire)
 */
export const navigateToGame = (navigation: any, gameId: string, players: any[]) => {
  const game = gameRegistry.getGame(gameId);
  if (!game) {
    throw new Error(`Jeu "${gameId}" non trouvé ou désactivé`);
  }

  // Validation basique des joueurs
  if (players.length < game.minPlayers || players.length > game.maxPlayers) {
    throw new Error(
      `Nombre de joueurs invalide pour ce jeu (${game.minPlayers}-${game.maxPlayers})`,
    );
  }

  // Navigation vers l'écran du jeu (pour l'instant hard-codé)
  if (gameId === 'purity-test') {
    navigation.navigate('PurityTest', { players });
  } else if (gameId === 'cameleon') {
    navigation.navigate('Cameleon', { players });
  }
};

/**
 * Helper pour naviguer vers les résultats d'un jeu (version simplifiée temporaire)
 */
export const navigateToGameResults = (navigation: any, gameId: string, results: any) => {
  // Pour l'instant hard-codé
  if (gameId === 'purity-test') {
    navigation.navigate('PurityResults', { results });
  }
};
