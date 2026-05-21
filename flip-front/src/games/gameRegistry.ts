import { StackNavigationProp } from '@react-navigation/stack';
import { GAMES, GameConfig, GameRoute, getGameConfig } from '../config/games.config';
import { Player, RootStackParamList } from '../types';

export const gameRegistry = {
  getGame(id: string): GameConfig | undefined {
    const cfg = getGameConfig(id);
    if (!cfg || !cfg.enabled) return undefined;
    if (cfg.developmentOnly && !__DEV__) return undefined;
    return cfg;
  },

  getAvailableGames(): readonly GameConfig[] {
    return GAMES.filter((g) => g.enabled && (!g.developmentOnly || __DEV__));
  },

  getCompatibleGames(playerCount: number): readonly GameConfig[] {
    return this.getAvailableGames().filter(
      (g) => playerCount >= g.minPlayers && playerCount <= g.maxPlayers,
    );
  },

  isGameAvailable(id: string): boolean {
    return this.getGame(id) !== undefined;
  },
};

export const navigateToGame = (
  navigation: StackNavigationProp<RootStackParamList>,
  gameId: string,
  players: Player[],
) => {
  const game = gameRegistry.getGame(gameId);
  if (!game) {
    throw new Error(`game "${gameId}" not found or disabled`);
  }

  if (players.length < game.minPlayers || players.length > game.maxPlayers) {
    throw new Error(
      `Invalid number of players for this game (${game.minPlayers}-${game.maxPlayers})`,
    );
  }

  const nav = navigation as unknown as {
    navigate: (route: GameRoute, params: { players: Player[] }) => void;
  };
  nav.navigate(game.route, { players });
};
