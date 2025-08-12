// =============================================================================
// POINT D'ENTRÉE POUR TOUS LES JEUX
// =============================================================================

// Registre des jeux
import { gameRegistry } from './gameRegistry';

export { navigateToGame, navigateToGameResults } from './gameRegistry';
export type { GameRegistryEntry } from './gameRegistry';

// Jeux individuels
export * from './purity-test';

// Types communs pour les jeux (temporairement commentés en attendant la refacto complète)
// export type { GameRule, GameMetadata, BaseGameState, BaseGameResult } from '../types';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Helper pour valider si un nombre de joueurs est valide pour un jeu
 */
export const validatePlayerCount = (gameId: string, playerCount: number): boolean => {
  const game = gameRegistry.getGame(gameId);
  if (!game) return false;

  return playerCount >= game.minPlayers && playerCount <= game.maxPlayers;
};

/**
 * Helper pour obtenir la liste des jeux disponibles
 */
export const getAvailableGames = () => gameRegistry.getAvailableGames();

/**
 * Helper pour obtenir les jeux compatibles avec un nombre de joueurs
 */
export const getCompatibleGames = (playerCount: number) =>
  gameRegistry.getCompatibleGames(playerCount);

/**
 * Helper pour obtenir un jeu par son ID
 */
export const getGameById = (gameId: string) => gameRegistry.getGame(gameId);
