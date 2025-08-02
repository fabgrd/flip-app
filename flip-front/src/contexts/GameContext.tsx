import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameActions, GameCard, GamePlayer, PlayedCard } from '../types/game';
import { Player } from '../types';
import {
    createDeck,
    dealCards,
    createInitialLines,
    processPlayedCards,
    calculatePlayerScore,
    isGameEnded,
    findWinner,
    placeCardOnLine
} from '../utils/gameLogic';

type GameAction =
    | { type: 'INITIALIZE_GAME'; payload: Player[] }
    | { type: 'SELECT_CARD'; payload: { playerId: string; card: GameCard } }
    | { type: 'REVEAL_CARDS' }
    | { type: 'PROCESS_PLACEMENT' }
    | { type: 'SELECT_LINE'; payload: { lineId: number } }
    | { type: 'NEXT_TURN' }
    | { type: 'END_GAME' }
    | { type: 'RESET_GAME' };

const initialState: GameState = {
    players: [],
    currentPlayerIndex: 0,
    lines: [],
    deck: [],
    phase: 'setup',
    turn: 0,
    maxTurns: 10,
    playedCards: [],
    selectingLine: false,
    selectingPlayerId: null,
    gameEnded: false,
    winner: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'INITIALIZE_GAME': {
            const deck = createDeck();
            const { playerHands, remainingDeck } = dealCards(deck, action.payload.length);
            const { lines, remainingDeck: finalDeck } = createInitialLines(remainingDeck);

            const players: GamePlayer[] = action.payload.map((player, index) => ({
                ...player,
                hand: playerHands[index].sort((a, b) => a.number - b.number),
                selectedCard: null,
                score: 0,
                collectedCards: [],
            }));

            return {
                ...state,
                players,
                lines,
                deck: finalDeck,
                phase: 'selection',
                turn: 1,
                gameEnded: false,
                winner: null,
                playedCards: [],
                selectingLine: false,
                selectingPlayerId: null,
            };
        }

        case 'SELECT_CARD': {
            console.log('SELECT_CARD: ', action.payload);
            const { playerId, card } = action.payload;

            const updatedPlayers = state.players.map(player => {
                if (player.id === playerId) {
                    return {
                        ...player,
                        selectedCard: card,
                        hand: player.hand.filter(c => c.number !== card.number)
                    };
                }
                return player;
            });

            // Vérifier si tous les joueurs ont sélectionné une carte
            const allSelected = updatedPlayers.every(player => player.selectedCard !== null);

            return {
                ...state,
                players: updatedPlayers,
                phase: allSelected ? 'reveal' : state.phase,
            };
        }

        case 'REVEAL_CARDS': {
            console.log('REVEAL_CARDS: ', state.players);
            const playedCards: PlayedCard[] = state.players
                .filter(player => player.selectedCard !== null)
                .map(player => ({
                    playerId: player.id,
                    card: player.selectedCard!,
                    placed: false,
                }));

            return {
                ...state,
                playedCards,
                phase: 'placement',
            };
        }

        case 'PROCESS_PLACEMENT': {
            console.log('CA CALCULE OU QUOI LA TEAM : ', state.playedCards);
            const { newLines, cardResults } = processPlayedCards(state.playedCards, state.lines);

            let updatedPlayers = [...state.players];
            let needsLineChoice = false;
            let selectingPlayerId: string | null = null;

            for (const result of cardResults) {
                if (result.needsLineChoice) {
                    needsLineChoice = true;
                    selectingPlayerId = result.playerId;
                    break;
                } else {
                    updatedPlayers = updatedPlayers.map(player => {
                        if (player.id === result.playerId) {
                            const newCollectedCards = [...player.collectedCards, ...result.collectedCards];
                            return {
                                ...player,
                                selectedCard: null,
                                collectedCards: newCollectedCards,
                                score: calculatePlayerScore(newCollectedCards),
                            };
                        }
                        return player;
                    });
                }
            }

            if (needsLineChoice) {
                return {
                    ...state,
                    lines: newLines,
                    players: updatedPlayers,
                    phase: 'lineChoice',
                    selectingLine: true,
                    selectingPlayerId,
                };
            } else {
                const finalPlayers = updatedPlayers.map(p => ({ ...p, selectedCard: null }));
                const gameEnded = isGameEnded(finalPlayers, state.turn, state.maxTurns);
                const winner = gameEnded ? findWinner(finalPlayers) : null;

                return {
                    ...state,
                    lines: newLines,
                    players: finalPlayers,
                    phase: gameEnded ? 'ended' : 'selection',
                    playedCards: [],
                    turn: gameEnded ? state.turn : state.turn + 1,
                    gameEnded,
                    winner,
                };
            }
        }

        case 'SELECT_LINE': {
            const { lineId } = action.payload;
            const selectingPlayer = state.players.find(p => p.id === state.selectingPlayerId);

            if (!selectingPlayer || !selectingPlayer.selectedCard) {
                return state;
            }

            // Le joueur ramasse toute la ligne et place sa carte
            const selectedLine = state.lines[lineId];
            const collectedCards = [...selectedLine.cards];

            const { newLines } = placeCardOnLine(selectingPlayer.selectedCard, lineId, state.lines);

            // Mettre à jour le joueur qui ramasse la ligne
            const updatedPlayers = state.players.map(player => {
                if (player.id === state.selectingPlayerId) {
                    const newCollectedCards = [...player.collectedCards, ...collectedCards];
                    return {
                        ...player,
                        selectedCard: null,
                        collectedCards: newCollectedCards,
                        score: calculatePlayerScore(newCollectedCards),
                    };
                }
                return { ...player, selectedCard: null };
            });

            // Vérifier si le jeu est terminé
            const gameEnded = isGameEnded(updatedPlayers, state.turn, state.maxTurns);
            const winner = gameEnded ? findWinner(updatedPlayers) : null;

            return {
                ...state,
                lines: newLines,
                players: updatedPlayers,
                phase: gameEnded ? 'ended' : 'selection',
                selectingLine: false,
                selectingPlayerId: null,
                playedCards: [],
                turn: gameEnded ? state.turn : state.turn + 1,
                gameEnded,
                winner,
            };
        }

        case 'RESET_GAME': {
            return initialState;
        }

        default:
            return state;
    }
}

const GameContext = createContext<{
    state: GameState;
    actions: GameActions;
} | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    const actions: GameActions = {
        initializeGame: (players: Player[]) => {
            dispatch({ type: 'INITIALIZE_GAME', payload: players });
        },

        selectCard: (playerId: string, card: GameCard) => {
            console.log('PROVIDER SELECT_CARD good');
            dispatch({ type: 'SELECT_CARD', payload: { playerId, card } });
        },

        selectLine: (lineId: number) => {
            console.log('PROVIDER SELECT_LINE good');
            dispatch({ type: 'SELECT_LINE', payload: { lineId } });
        },

        nextPhase: () => {
            console.log('PROVIDER NEXT_PHASE good');
            if (state.phase === 'reveal') {
                dispatch({ type: 'REVEAL_CARDS' });
            } else if (state.phase === 'placement') {
                dispatch({ type: 'PROCESS_PLACEMENT' });
            }
        },

        resetGame: () => {
            console.log('PROVIDER RESET_GAME good');
            dispatch({ type: 'RESET_GAME' });
        },
    };

    return (
        <GameContext.Provider value={{ state, actions }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
} 