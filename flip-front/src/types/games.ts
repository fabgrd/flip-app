// Types généraux pour tous les jeux
export interface Player {
    id: string;
    name: string;
    avatar?: string; // URI de l'image ou undefined pour utiliser l'avatar par défaut
}

export interface Game {
    id: string;
    name: string;
    minPlayers: number;
    maxPlayers: number;
    description: string;
}

// Import et re-export des types spécifiques aux jeux
import type {
    Theme,
    Question,
    PlayerAnswer,
    PurityPlayer,
    PurityGameState,
    PurityResults
} from '../games/purity-test/types';

export type {
    Theme,
    Question,
    PlayerAnswer,
    PurityPlayer,
    PurityGameState,
    PurityResults
};

export type RootStackParamList = {
    Home: undefined;
    GameSelect: { players: Player[] };
    PurityTest: { players: Player[] };
    PurityResults: { results: PurityResults };
    Settings: undefined;
}; 