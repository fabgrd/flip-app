import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GamePlayer, GameCard as IGameCard } from '../../types/game';
import { GameCard } from './GameCard';
import { Colors } from '../../constants';

interface PlayerHandProps {
    player: GamePlayer;
    currentPlayerId?: string;
    canSelectCards: boolean;
    selectedCard: IGameCard | null;
    onCardSelect?: (card: IGameCard) => void;
}

export function PlayerHand({
    player,
    currentPlayerId,
    canSelectCards,
    selectedCard,
    onCardSelect
}: PlayerHandProps) {
    const isCurrentPlayer = player.id === currentPlayerId;
    const hasSelectedCard = player.selectedCard !== null;

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
                    <Text style={styles.handTitle}>Votre main :</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardsContainer}
                    >
                        {player.hand.map((card, index) => (
                            <View key={`${card.number}-${index}`} style={styles.cardWrapper}>
                                <GameCard
                                    card={card}
                                    size="medium"
                                    isSelected={selectedCard?.number === card.number}
                                    isPlayable={canSelectCards && !hasSelectedCard}
                                    onPress={() => onCardSelect?.(card)}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.otherPlayerHand}>
                    <View style={styles.hiddenCards}>
                        {Array(player.hand.length).fill(null).map((_, index) => (
                            <View key={index} style={styles.hiddenCardWrapper}>
                                <View style={styles.hiddenCard}>
                                    <Text style={styles.hiddenCardText}>?</Text>
                                </View>
                            </View>
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
                                <GameCard card={card} size="small" />
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
        gap: 8,
    },

    cardWrapper: {
        marginRight: 8,
    },

    otherPlayerHand: {
        marginBottom: 15,
    },

    hiddenCards: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },

    hiddenCardWrapper: {
        marginRight: 4,
        marginBottom: 4,
    },

    hiddenCard: {
        width: 50,
        height: 70,
        backgroundColor: Colors.text.light,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    hiddenCardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.white,
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
        width: 50,
        height: 70,
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
}); 