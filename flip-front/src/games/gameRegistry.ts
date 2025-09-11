import { StackNavigationProp } from '@react-navigation/stack';
import { Player, RootStackParamList } from '../types';
import { PurityResults } from './purity-test/types';

// Game metadata interface for registry
interface GameMetadata {
  id: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  description: string;
}

// =============================================================================
// CENTRAL GAME REGISTRY
// =============================================================================

export interface GameRegistryEntry {
  metadata: GameMetadata;
  isEnabled: boolean;
  developmentOnly?: boolean;
}

class GameRegistry {
  private games = new Map<string, GameRegistryEntry>();

  /**
   * Registers a new game in the registry
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
   * Gets a game by its ID
   */
  getGame(gameId: string): GameMetadata | null {
    const entry = this.games.get(gameId);
    return entry?.isEnabled ? entry.metadata : null;
  }

  /**
   * Gets all available games
   */
  getAvailableGames(): GameMetadata[] {
    const isDev = __DEV__;
    return Array.from(this.games.values())
      .filter((entry) => entry.isEnabled && (!entry.developmentOnly || isDev))
      .map((entry) => entry.metadata)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Gets games compatible with a given number of players
   */
  getCompatibleGames(playerCount: number): GameMetadata[] {
    return this.getAvailableGames().filter(
      (game) => playerCount >= game.minPlayers && playerCount <= game.maxPlayers,
    );
  }

  /**
   * Checks if a game exists and is enabled
   */
  isGameAvailable(gameId: string): boolean {
    const entry = this.games.get(gameId);
    return entry?.isEnabled || false;
  }

  /**
   * Enables/disables a game
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
   * Lists all games (even disabled) for administration
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
// SINGLETON REGISTRY INSTANCE
// =============================================================================

export const gameRegistry = new GameRegistry();

// =============================================================================
// GAME REGISTRATION
// =============================================================================

// Production games (temporarily hardcoded)
gameRegistry.register(
  {
    id: 'purity-test',
    name: 'Purity Test',
    minPlayers: 1,
    maxPlayers: 10,
    description: 'A question game to discover who is the purest in the group!',
  },
  { isEnabled: true },
);

// New game: Cameleon (Undercover-like)
gameRegistry.register(
  {
    id: 'cameleon',
    name: 'Chameleon',
    minPlayers: 4,
    maxPlayers: 10,
    description: 'Guess the impostors from clues... without revealing your word!',
  },
  { isEnabled: true },
);

// New game: Left or Right (Political orientation game)
gameRegistry.register(
  {
    id: 'left-right',
    name: 'Left or Right',
    minPlayers: 1,
    maxPlayers: 10,
    description: 'Discover political orientations through fun activities!',
  },
  { isEnabled: true },
);

// Development games (examples)
// gameRegistry.register(sixQuiPrendGame, { isEnabled: false, developmentOnly: true });
// gameRegistry.register(undercoverGame, { isEnabled: false, developmentOnly: true });

// =============================================================================
// NAVIGATION HELPERS
// =============================================================================

/**
 * Helper to navigate to a game (temporary simplified version)
 */
export const navigateToGame = (
  navigation: StackNavigationProp<RootStackParamList>,
  gameId: string,
  players: Player[],
) => {
  const game = gameRegistry.getGame(gameId);
  if (!game) {
    throw new Error(`game "${gameId}" not found or disabled`);
  }

  // Basic player validation
  if (players.length < game.minPlayers || players.length > game.maxPlayers) {
    throw new Error(
      `Invalid number of players for this game (${game.minPlayers}-${game.maxPlayers})`,
    );
  }

  // Navigation to game screen (currently hardcoded)
  if (gameId === 'purity-test') {
    navigation.navigate('PurityTest', { players });
  } else if (gameId === 'cameleon') {
    navigation.navigate('Cameleon', { players });
  } else if (gameId === 'left-right') {
    navigation.navigate('LeftRight', { players });
  }
};

/**
 * Helper to navigate to game results (temporary simplified version)
 */
export const navigateToGameResults = (
  navigation: StackNavigationProp<RootStackParamList>,
  gameId: string,
  results: PurityResults,
) => {
  // Currently hardcoded
  if (gameId === 'purity-test') {
    navigation.navigate('PurityResults', { results });
  }
};
