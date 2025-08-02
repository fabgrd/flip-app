import { Player } from './index';

export interface GameCard {
    number: number;
    bulls: number; // Nombre de têtes de bœuf (points de pénalité)
}

export interface GameLine {
    id: number;
    cards: GameCard[];
}

export interface GamePlayer extends Player {
    hand: GameCard[];
    selectedCard: GameCard | null;
    score: number; // Nombre total de têtes de bœuf collectées
    collectedCards: GameCard[];
}

export interface GameState {
    players: GamePlayer[];
    currentPlayerIndex: number;
    lines: GameLine[];
    deck: GameCard[];
    phase: GamePhase;
    turn: number;
    maxTurns: number;
    playedCards: PlayedCard[];
    selectingLine: boolean;
    selectingPlayerId: string | null;
    gameEnded: boolean;
    winner: GamePlayer | null;
}

export interface PlayedCard {
    playerId: string;
    card: GameCard;
    placed: boolean;
}

export type GamePhase =
    | 'setup'        // Initialisation et distribution
    | 'selection'    // Joueurs sélectionnent leurs cartes
    | 'reveal'       // Révélation des cartes sélectionnées
    | 'placement'    // Placement automatique des cartes
    | 'lineChoice'   // Un joueur doit choisir une ligne à prendre
    | 'scoring'      // Calcul des scores
    | 'ended';       // Jeu terminé

export interface GameActions {
    initializeGame: (players: Player[]) => void;
    selectCard: (playerId: string, card: GameCard) => void;
    selectLine: (lineId: number) => void;
    nextPhase: () => void;
    resetGame: () => void;
} 