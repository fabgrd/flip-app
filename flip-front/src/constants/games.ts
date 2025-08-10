import { gameRegistry } from '../games/gameRegistry';

// =============================================================================
// RÉCUPÉRATION DES JEUX DEPUIS LE REGISTRE
// =============================================================================

/**
 * Liste des jeux disponibles depuis le registre
 */
export const AVAILABLE_GAMES = gameRegistry.getAvailableGames();

/**
 * Récupère les jeux compatibles avec un nombre de joueurs donné
 */
export const getCompatibleGames = (playerCount: number) =>
  gameRegistry.getCompatibleGames(playerCount);

/**
 * Vérifie si un jeu est disponible
 */
export const isGameAvailable = (gameId: string) =>
  gameRegistry.isGameAvailable(gameId);

// =============================================================================
// CONSTANTES GLOBALES
// =============================================================================

export const MIN_PLAYERS_GLOBAL = 1;
export const MAX_PLAYERS_GLOBAL = 10;

// =============================================================================
// HELPERS POUR LA NAVIGATION
// =============================================================================

export { navigateToGame, navigateToGameResults } from '../games/gameRegistry'; 