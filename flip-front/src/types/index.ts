export interface Player {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  description: string;
}

export type RootStackParamList = {
  Home: undefined;
  GameSelect: { players: Player[] };
  TakeSixGame: { players: Player[] };
};

// Re-export game types
export * from './game'; 