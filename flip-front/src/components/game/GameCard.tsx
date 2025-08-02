import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GameCard as IGameCard } from '../../types/game';
import { Colors } from '../../constants';

interface GameCardProps {
    card: IGameCard;
    isSelected?: boolean;
    isPlayable?: boolean;
    onPress?: () => void;
    size?: 'small' | 'medium' | 'large';
}

export function GameCard({
    card,
    isSelected = false,
    isPlayable = false,
    onPress,
    size = 'medium'
}: GameCardProps) {
    const cardStyle = [
        styles.card,
        styles[size],
        isSelected && styles.selected,
        !isPlayable && styles.disabled
    ];

    const bullsArray = Array(card.bulls).fill('🐮');

    const content = (
        <View style={cardStyle}>
            <Text style={[styles.number, styles[`${size}Number`]]}>{card.number}</Text>
            <View style={styles.bullsContainer}>
                {bullsArray.map((bull, index) => (
                    <Text key={index} style={[styles.bull, styles[`${size}Bull`]]}>
                        {bull}
                    </Text>
                ))}
            </View>
        </View>
    );

    if (onPress && isPlayable) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.background,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.text.light,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    small: {
        width: 50,
        height: 70,
        padding: 4,
    },

    medium: {
        width: 70,
        height: 100,
        padding: 8,
    },

    large: {
        width: 90,
        height: 130,
        padding: 12,
    },

    selected: {
        borderColor: Colors.primary,
        borderWidth: 3,
        shadowColor: Colors.primary,
        shadowOpacity: 0.3,
    },

    disabled: {
        opacity: 0.6,
    },

    number: {
        fontWeight: 'bold',
        color: Colors.text.primary,
        textAlign: 'center',
    },

    smallNumber: {
        fontSize: 12,
    },

    mediumNumber: {
        fontSize: 16,
    },

    largeNumber: {
        fontSize: 20,
    },

    bullsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },

    bull: {
        textAlign: 'center',
    },

    smallBull: {
        fontSize: 8,
    },

    mediumBull: {
        fontSize: 10,
    },

    largeBull: {
        fontSize: 12,
    },
}); 