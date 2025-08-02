import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { GameState, GameCard as IGameCard } from '../../types/game';
import { AnimatedGameLine } from './AnimatedGameLine';
import { useDropZones } from '../../hooks/useDropZones';
import { Colors } from '../../constants';
import * as Haptics from 'expo-haptics';

interface AnimatedGameBoardProps {
    gameState: GameState;
    onLineSelect?: (lineId: number) => void;
    onCardDropped?: (card: IGameCard, lineId: number) => void;
}

export function AnimatedGameBoard({
    gameState,
    onLineSelect,
    onCardDropped
}: AnimatedGameBoardProps) {

    const { lines, phase, turn, maxTurns, selectingLine, selectingPlayerId } = gameState;
    const selectingPlayer = gameState.players.find(p => p.id === selectingPlayerId);

    // Hook pour gérer les zones de drop
    const { registerDropZone } = useDropZones();
    const [dragTargetLineId, setDragTargetLineId] = useState<number | null>(null);

    // État pour suivre quelles lignes sont des zones de drop actives
    const isDragSession = phase === 'selection';

    // Gestion du drop d'une carte sur une ligne
    const handleCardDrop = (card: IGameCard, lineId: number) => {
        const targetLine = lines.find(line => line.id === lineId);
        if (!targetLine) return;

        const lastCard = targetLine.cards[targetLine.cards.length - 1];

        if (card.number <= lastCard.number) {
            Alert.alert(
                'Carte trop petite',
                `Votre carte ${card.number} est plus petite que la dernière carte (${lastCard.number}) de cette ligne.`,
                [{ text: 'OK' }]
            );
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        if (onCardDropped) {
            onCardDropped(card, lineId);
        }

        setDragTargetLineId(null);
    };

    const getPhaseMessage = () => {
        switch (phase) {
            case 'setup':
                return 'Initialisation du jeu...';
            case 'selection':
                return `Tour ${turn}/${maxTurns} - Glissez vos cartes vers les lignes`;
            case 'reveal':
                return 'Révélation des cartes...';
            case 'placement':
                return 'Placement automatique des cartes...';
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
            <View style={styles.header}>
                <Text style={styles.title}>6 qui prend !</Text>
                <Text style={styles.phaseText}>{getPhaseMessage()}</Text>
                <Text style={styles.turnInfo}>Tour {turn} sur {maxTurns}</Text>
            </View>

            {selectingLine && selectingPlayer && (
                <View style={styles.selectionPrompt}>
                    <Text style={styles.selectionTitle}>
                        🎯 {selectingPlayer.name}, votre carte ne peut être placée !
                    </Text>
                    <Text style={styles.selectionSubtitle}>
                        Choisissez une ligne à ramasser.
                    </Text>
                </View>
            )}

            {isDragSession && (
                <View style={styles.dragInstructions}>
                    <Text style={styles.dragInstructionsText}>
                        👆 Glissez vos cartes vers les lignes appropriées
                    </Text>
                </View>
            )}

            <ScrollView style={styles.boardContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.linesContainer}>
                    <Text style={styles.boardTitle}>Plateau de jeu</Text>

                    {lines.map((line) => (
                        <AnimatedGameLine
                            key={line.id}
                            line={line}
                            isSelectable={selectingLine}
                            isDragTarget={dragTargetLineId === line.id}
                            onSelect={() => onLineSelect?.(line.id)}
                            onLayout={(layout) => {
                                const measureCallback = registerDropZone(line.id);
                                measureCallback(layout);
                            }}
                        />
                    ))}
                </View>
            </ScrollView>

            {phase === 'reveal' && gameState.playedCards.length > 0 && (
                <View style={styles.playedCardsSection}>
                    <Text style={styles.playedCardsTitle}>Cartes jouées ce tour :</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.playedCardsContainer}>
                            {gameState.playedCards
                                .sort((a, b) => a.card.number - b.card.number)
                                .map((playedCard, index) => {
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

    dragInstructions: {
        backgroundColor: Colors.accent + '20',
        padding: 12,
        margin: 10,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: Colors.accent,
    },

    dragInstructionsText: {
        fontSize: 14,
        color: Colors.accent,
        fontWeight: '600',
        textAlign: 'center',
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