import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GameLine as IGameLine } from '../../types/game';
import { GameCard } from './GameCard';
import { Colors } from '../../constants';

interface GameLineProps {
    line: IGameLine;
    isSelectable?: boolean;
    onSelect?: () => void;
}

export function GameLine({ line, isSelectable = false, onSelect }: GameLineProps) {
    const totalBulls = line.cards.reduce((sum, card) => sum + card.bulls, 0);
    const isFull = line.cards.length >= 5;

    const content = (
        <View style={[
            styles.container,
            isSelectable && styles.selectable,
            isFull && styles.full
        ]}>
            <View style={styles.header}>
                <Text style={styles.lineNumber}>Ligne {line.id + 1}</Text>
                <View style={styles.info}>
                    <Text style={styles.cardCount}>{line.cards.length}/5 cartes</Text>
                    <Text style={styles.bullCount}>{totalBulls} 🐮</Text>
                </View>
            </View>

            <View style={styles.cardsContainer}>
                {line.cards.map((card, index) => (
                    <View key={`${card.number}-${index}`} style={styles.cardWrapper}>
                        <GameCard card={card} size="small" />
                    </View>
                ))}

                {/* Afficher les emplacements vides */}
                {Array(5 - line.cards.length).fill(null).map((_, index) => (
                    <View key={`empty-${index}`} style={[styles.cardWrapper, styles.emptySlot]}>
                        <View style={styles.emptyCard} />
                    </View>
                ))}
            </View>

            {isSelectable && (
                <View style={styles.selectPrompt}>
                    <Text style={styles.selectText}>Touchez pour sélectionner</Text>
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
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 15,
        marginVertical: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    selectable: {
        borderColor: Colors.accent,
        shadowColor: Colors.accent,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },

    full: {
        borderColor: Colors.warning,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    lineNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.primary,
    },

    info: {
        alignItems: 'flex-end',
    },

    cardCount: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginBottom: 2,
    },

    bullCount: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.danger,
    },

    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },

    cardWrapper: {
        marginRight: 4,
        marginBottom: 4,
    },

    emptySlot: {
        opacity: 0.5,
    },

    emptyCard: {
        width: 50,
        height: 70,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.text.light,
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
    },

    selectPrompt: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.accent,
        borderRadius: 8,
        alignItems: 'center',
    },

    selectText: {
        color: Colors.text.white,
        fontWeight: '600',
        fontSize: 14,
    },
}); 