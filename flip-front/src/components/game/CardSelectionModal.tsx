import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { GamePlayer, GameCard as IGameCard } from '../../types/game';
import { GameCard } from './GameCard'; // Utilisation du composant simple
import { Colors } from '../../constants';
import * as Haptics from 'expo-haptics';

interface CardSelectionModalProps {
    player: GamePlayer;
    visible: boolean;
    onCardSelect: (card: IGameCard) => void;
}

export function CardSelectionModal({ player, visible, onCardSelect }: CardSelectionModalProps) {
    const handleCardPress = (card: IGameCard) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onCardSelect(card);
    };

    if (!player) return null;

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Votre main</Text>
                        <Text style={styles.subtitle}>{player.name}, choisissez une carte</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardsContainer}
                    >
                        {player.hand.map((card, index) => (
                            <GameCard
                                key={`${card.number}-${index}`}
                                card={card}
                                size="large"
                                isPlayable={true}
                                onPress={() => handleCardPress(card)}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingVertical: 20,
        backgroundColor: Colors.background,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 20,
        minHeight: 250,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.primary,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    cardsContainer: {
        paddingHorizontal: 20,
        gap: 16,
    },
}); 