import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GameState } from '../../types/game';
import { GameLine } from './GameLine';
import { Colors } from '../../constants';

interface GameBoardProps {
    gameState: GameState;
    onLineSelect?: (lineId: number) => void;
}

export function GameBoard({ gameState, onLineSelect }: GameBoardProps) {
    const { lines, phase, turn, maxTurns, selectingLine, selectingPlayerId } = gameState;

    const selectingPlayer = gameState.players.find(p => p.id === selectingPlayerId);

    const getPhaseMessage = () => {
        switch (phase) {
            case 'setup':
                return 'Initialisation du jeu...';
            case 'selection':
                return `Tour ${turn}/${maxTurns} - Choisissez vos cartes`;
            case 'reveal':
                return 'Révélation des cartes...';
            case 'placement':
                return 'Placement des cartes...';
            case 'lineChoice':
                return `${selectingPlayer?.name} doit choisir une ligne à prendre`;
            case 'scoring':
                return 'Calcul des scores...';
            case 'ended':
                return 'Jeu terminé !';
            default:
                return '';
        }
    };

    return (
        <View style={styles.container}>
            {/* En-tête avec informations de phase */}
            <View style={styles.header}>
                <Text style={styles.title}>6 qui prend !</Text>
                <Text style={styles.phaseText}>{getPhaseMessage()}</Text>
                <Text style={styles.turnInfo}>
                    Tour {turn} sur {maxTurns}
                </Text>
            </View>

            {/* Message spécial si un joueur doit choisir une ligne */}
            {selectingLine && selectingPlayer && (
                <View style={styles.selectionPrompt}>
                    <Text style={styles.selectionTitle}>
                        🎯 {selectingPlayer.name}, votre carte ne peut être placée !
                    </Text>
                    <Text style={styles.selectionSubtitle}>
                        Choisissez une ligne à ramasser. Vous récupérerez toutes les cartes de cette ligne
                        et votre carte remplacera la ligne.
                    </Text>
                </View>
            )}

            {/* Plateau avec les 4 lignes */}
            <ScrollView style={styles.boardContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.linesContainer}>
                    <Text style={styles.boardTitle}>Plateau de jeu</Text>

                    {lines.map((line) => (
                        <GameLine
                            key={line.id}
                            line={line}
                            isSelectable={selectingLine}
                            onSelect={() => onLineSelect?.(line.id)}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Affichage des cartes jouées pendant la phase de révélation */}
            {phase === 'reveal' && gameState.playedCards.length > 0 && (
                <View style={styles.playedCardsSection}>
                    <Text style={styles.playedCardsTitle}>Cartes jouées ce tour :</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.playedCardsContainer}>
                            {gameState.playedCards
                                .sort((a, b) => a.card.number - b.card.number)
                                .map((playedCard) => {
                                    const player = gameState.players.find(p => p.id === playedCard.playerId);
                                    return (
                                        <View key={`${playedCard.playerId}-${playedCard.card.number}`} style={styles.playedCardItem}>
                                            <Text style={styles.playedCardPlayer}>{player?.name}</Text>
                                            <View style={styles.playedCardNumber}>
                                                <Text style={styles.playedCardNumberText}>{playedCard.card.number}</Text>
                                                <Text style={styles.playedCardBulls}>{playedCard.card.bulls} 🐮</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    header: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text.white,
        marginBottom: 5,
    },

    phaseText: {
        fontSize: 16,
        color: Colors.text.white,
        textAlign: 'center',
        marginBottom: 5,
    },

    turnInfo: {
        fontSize: 14,
        color: Colors.text.white,
        opacity: 0.8,
    },

    selectionPrompt: {
        backgroundColor: Colors.warning,
        padding: 15,
        margin: 10,
        borderRadius: 12,
    },

    selectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 8,
        textAlign: 'center',
    },

    selectionSubtitle: {
        fontSize: 14,
        color: Colors.text.primary,
        textAlign: 'center',
        lineHeight: 20,
    },

    boardContainer: {
        flex: 1,
    },

    linesContainer: {
        padding: 15,
    },

    boardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 15,
        textAlign: 'center',
    },

    playedCardsSection: {
        backgroundColor: Colors.surface,
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.text.light,
    },

    playedCardsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 10,
        textAlign: 'center',
    },

    playedCardsContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 5,
    },

    playedCardItem: {
        alignItems: 'center',
        minWidth: 80,
    },

    playedCardPlayer: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginBottom: 6,
        textAlign: 'center',
    },

    playedCardNumber: {
        backgroundColor: Colors.accent,
        borderRadius: 8,
        padding: 8,
        minWidth: 60,
        alignItems: 'center',
    },

    playedCardNumberText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.white,
    },

    playedCardBulls: {
        fontSize: 10,
        color: Colors.text.white,
        marginTop: 2,
    },
}); 