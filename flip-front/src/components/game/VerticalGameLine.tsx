import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GameLine as IGameLine } from '../../types/game';
import { GameCard } from './GameCard'; // Utilisation du composant simple
import { Colors } from '../../constants';

interface VerticalGameLineProps {
    line: IGameLine;
    isSelectable?: boolean;
    onSelect?: () => void;
}

export function VerticalGameLine({ line, isSelectable = false, onSelect }: VerticalGameLineProps) {
    const totalBulls = line.cards.reduce((sum, card) => sum + card.bulls, 0);
    const isFull = line.cards.length >= 5;

    const content = (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.bullCount}>{totalBulls} 🐮</Text>
            </View>
            <View style={styles.cardsContainer}>
                {line.cards.map((card, index) => (
                    <View key={`${card.number}-${index}`} style={styles.cardWrapper}>
                        <GameCard card={card} size="small" />
                    </View>
                ))}
                {Array(5 - line.cards.length).fill(null).map((_, index) => (
                    <View key={`empty-${index}`} style={[styles.cardWrapper, styles.emptySlot]}>
                        <View style={styles.emptyCard} />
                    </View>
                ))}
            </View>
            {isFull && (
                <View style={styles.fullIndicator}>
                    <Text style={styles.fullText}>PLEINE</Text>
                </View>
            )}
        </View>
    );

    if (isSelectable && onSelect) {
        return (
            <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    header: {
        marginBottom: 8,
        backgroundColor: Colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    bullCount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.danger,
    },
    cardsContainer: {
        alignItems: 'center',
        gap: 8,
    },
    cardWrapper: {},
    emptySlot: {
        opacity: 0.5,
    },
    emptyCard: {
        width: 60,
        height: 85,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.text.light,
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
    },
    fullIndicator: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: Colors.warning,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    fullText: {
        color: Colors.text.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
}); 