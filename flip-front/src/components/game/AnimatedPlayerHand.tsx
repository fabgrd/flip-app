import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withDelay,
    runOnJS
} from 'react-native-reanimated';
import { GamePlayer, GameCard as IGameCard } from '../../types/game';
import { AnimatedCard } from './AnimatedCard';
import { DropZone } from '../../hooks/useDragAndDrop';
import { Colors } from '../../constants';
import * as Haptics from 'expo-haptics';

interface AnimatedPlayerHandProps {
    player: GamePlayer;
    currentPlayerId?: string;
    canSelectCards: boolean;
    dropZones?: DropZone[];
    onCardDrop?: (card: IGameCard, targetLineId: number) => void;
    onCardSelect?: (card: IGameCard) => void;
    onInvalidDrop?: () => void;
}

export function AnimatedPlayerHand({
    player,
    currentPlayerId,
    canSelectCards,
    dropZones = [],
    onCardDrop,
    onCardSelect,
    onInvalidDrop
}: AnimatedPlayerHandProps) {

    const isCurrentPlayer = player.id === currentPlayerId;
    const hasSelectedCard = player.selectedCard !== null;

    // État local pour les cartes en cours de drag
    const [draggingCardId, setDraggingCardId] = useState<number | null>(null);

    // Animations pour l'apparition des cartes
    const cardAnimations = player.hand.map(() => useSharedValue(0));

    // Animer l'apparition des cartes au montage
    React.useEffect(() => {
        cardAnimations.forEach((anim, index) => {
            anim.value = withDelay(
                index * 100, // Délai croissant pour chaque carte
                withSpring(1, { damping: 15, stiffness: 100 })
            );
        });
    }, []);

    // Gestion du drop d'une carte
    const handleCardDrop = useCallback((card: IGameCard, targetLineId: number) => {
        runOnJS(() => {
            setDraggingCardId(null);
            if (onCardDrop) {
                onCardDrop(card, targetLineId);
            }
        })();
    }, [onCardDrop]);

    // Gestion du début du drag
    const handleDragStart = useCallback((card: IGameCard) => {
        setDraggingCardId(card.number);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, []);

    // Gestion d'un drop invalide
    const handleInvalidDrop = useCallback(() => {
        setDraggingCardId(null);
        if (onInvalidDrop) {
            onInvalidDrop();
        }
    }, [onInvalidDrop]);

    // Gestion de la sélection simple (sans drag)
    const handleCardPress = useCallback((card: IGameCard) => {
        if (canSelectCards && onCardSelect) {
            onCardSelect(card);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    }, [canSelectCards, onCardSelect]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.playerInfo}>
                    <Text style={[
                        styles.playerName,
                        isCurrentPlayer && styles.currentPlayerName
                    ]}>
                        {player.name} {isCurrentPlayer && '👤'}
                    </Text>
                    <Text style={styles.scoreText}>
                        Score: {player.score} 🐮
                    </Text>
                </View>

                <View style={styles.cardCount}>
                    <Text style={styles.cardCountText}>
                        {player.hand.length} cartes
                    </Text>
                    {hasSelectedCard && (
                        <Text style={styles.selectedIndicator}>
                            ✓ Carte sélectionnée
                        </Text>
                    )}
                </View>
            </View>

            {isCurrentPlayer ? (
                <View style={styles.handContainer}>
                    <Text style={styles.handTitle}>
                        {canSelectCards ? 'Glissez une carte vers une ligne :' : 'Votre main :'}
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardsContainer}
                    >
                        {player.hand.map((card, index) => {
                            const cardAnim = cardAnimations[index];
                            const isDragging = draggingCardId === card.number;

                            const animatedCardStyle = useAnimatedStyle(() => ({
                                opacity: cardAnim?.value || 1,
                                transform: [
                                    { scale: cardAnim?.value || 1 },
                                    {
                                        translateY: (1 - (cardAnim?.value || 1)) * 50
                                    }
                                ],
                            }));

                            return (
                                <Animated.View
                                    key={`${card.number}-${index}`}
                                    style={[styles.cardWrapper, animatedCardStyle]}
                                >
                                    <AnimatedCard
                                        card={card}
                                        size="medium"
                                        isFaceUp={true}
                                        draggable={canSelectCards && !hasSelectedCard}
                                        dropZones={dropZones}
                                        onDrop={(targetLineId) => handleCardDrop(card, targetLineId)}
                                        onInvalidDrop={handleInvalidDrop}
                                        onPress={() => handleCardPress(card)}
                                        disabled={hasSelectedCard || isDragging}
                                    />

                                    {/* Indicateur de glissement */}
                                    {canSelectCards && !hasSelectedCard && (
                                        <View style={styles.dragHint}>
                                            <Text style={styles.dragHintText}>👆 Glisser</Text>
                                        </View>
                                    )}
                                </Animated.View>
                            );
                        })}
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.otherPlayerHand}>
                    <View style={styles.hiddenCards}>
                        {Array(player.hand.length).fill(null).map((_, index) => (
                            <Animated.View
                                key={index}
                                style={styles.hiddenCardWrapper}
                            >
                                <AnimatedCard
                                    card={{ number: 0, bulls: 0 }} // Carte factice
                                    size="small"
                                    isFaceUp={false} // Face cachée
                                />
                            </Animated.View>
                        ))}
                    </View>
                </View>
            )}

            {/* Afficher les cartes collectées si il y en a */}
            {player.collectedCards.length > 0 && (
                <View style={styles.collectedSection}>
                    <Text style={styles.collectedTitle}>
                        Cartes collectées ({player.collectedCards.length}):
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.collectedContainer}
                    >
                        {player.collectedCards.slice(-5).map((card, index) => (
                            <View key={`collected-${card.number}-${index}`} style={styles.collectedCardWrapper}>
                                <AnimatedCard
                                    card={card}
                                    size="small"
                                    isFaceUp={true}
                                />
                            </View>
                        ))}
                        {player.collectedCards.length > 5 && (
                            <View style={styles.moreCardsIndicator}>
                                <Text style={styles.moreCardsText}>
                                    +{player.collectedCards.length - 5}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}

            {/* Instructions spécifiques pour le joueur actuel */}
            {isCurrentPlayer && canSelectCards && (
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsText}>
                        💡 Glissez votre carte vers la ligne souhaitée
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 15,
        marginVertical: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },

    playerInfo: {
        flex: 1,
    },

    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 4,
    },

    currentPlayerName: {
        color: Colors.primary,
    },

    scoreText: {
        fontSize: 14,
        color: Colors.danger,
        fontWeight: '600',
    },

    cardCount: {
        alignItems: 'flex-end',
    },

    cardCountText: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginBottom: 2,
    },

    selectedIndicator: {
        fontSize: 12,
        color: Colors.success,
        fontWeight: '600',
    },

    handContainer: {
        marginBottom: 15,
    },

    handTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 10,
    },

    cardsContainer: {
        paddingHorizontal: 5,
        gap: 12,
    },

    cardWrapper: {
        marginRight: 12,
        position: 'relative',
    },

    dragHint: {
        position: 'absolute',
        bottom: -25,
        left: '50%',
        transform: [{ translateX: -25 }],
        backgroundColor: Colors.accent + '90',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },

    dragHintText: {
        fontSize: 10,
        color: Colors.text.white,
        fontWeight: '600',
    },

    otherPlayerHand: {
        marginBottom: 15,
    },

    hiddenCards: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    hiddenCardWrapper: {
        marginRight: 4,
        marginBottom: 4,
    },

    collectedSection: {
        borderTopWidth: 1,
        borderTopColor: Colors.text.light,
        paddingTop: 12,
    },

    collectedTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: 8,
    },

    collectedContainer: {
        paddingHorizontal: 5,
        gap: 4,
    },

    collectedCardWrapper: {
        marginRight: 4,
    },

    moreCardsIndicator: {
        width: 60,
        height: 85,
        backgroundColor: Colors.text.secondary,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },

    moreCardsText: {
        color: Colors.text.white,
        fontWeight: 'bold',
        fontSize: 12,
    },

    instructionsContainer: {
        backgroundColor: Colors.accent + '20',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },

    instructionsText: {
        fontSize: 12,
        color: Colors.accent,
        fontWeight: '600',
        textAlign: 'center',
    },
}); 