import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { GameCard as IGameCard } from '../../types/game';
import { Colors } from '../../constants';
import { useDragAndDrop, DropZone } from '../../hooks/useDragAndDrop';
import { useCardFlip } from '../../hooks/useCardFlip';

interface AnimatedCardProps {
    card: IGameCard;
    isFaceUp?: boolean;
    draggable?: boolean;
    flippable?: boolean;
    dropZones?: DropZone[];
    size?: 'small' | 'medium' | 'large';
    onDrop?: (targetLineId: number) => void;
    onInvalidDrop?: () => void;
    onFlip?: (isFaceUp: boolean) => void;
    onPress?: () => void;
    disabled?: boolean;
}

export function AnimatedCard({
    card,
    isFaceUp = true,
    draggable = false,
    flippable = false,
    dropZones = [],
    size = 'medium',
    onDrop,
    onInvalidDrop,
    onFlip,
    onPress,
    disabled = false,
}: AnimatedCardProps) {
    const { panGesture, animatedStyle } = useDragAndDrop({
        dropZones,
        onDrop: onDrop || (() => { }),
        onInvalidDrop,
        disabled: !draggable || disabled,
    });

    const { flip, setFaceUp, frontAnimatedStyle, backAnimatedStyle } = useCardFlip({
        initialState: isFaceUp,
        onFlipComplete: onFlip,
        disabled: !flippable || disabled,
    });

    useEffect(() => {
        setFaceUp(isFaceUp);
    }, [isFaceUp]);

    const bullsArray = Array(card.bulls).fill('🐮');
    const numberStyles = [styles.number, styles[`${size}Number`]];
    const bullStyles = [styles.bull, styles[`${size}Bull`]];

    const handlePress = () => {
        if (disabled) return;
        if (flippable) flip();
        if (onPress) onPress();
    };

    const renderCardBack = () => (
        <Animated.View style={[styles.card, styles.cardBack, frontAnimatedStyle]}>
            <View style={styles.cardBackPattern}>
                <Text style={styles.cardBackText}>FL!P</Text>
                <View style={styles.cardBackDesign}>
                    {Array(6).fill(null).map((_, index) => (
                        <View key={index} style={styles.cardBackDot} />
                    ))}
                </View>
            </View>
        </Animated.View>
    );

    const renderCardFront = () => (
        <Animated.View style={[styles.card, styles.cardFront, backAnimatedStyle]}>
            <Text style={numberStyles}>{card.number}</Text>
            <View style={styles.bullsContainer}>
                {bullsArray.map((bull, index) => (
                    <Text key={index} style={bullStyles}>{bull}</Text>
                ))}
            </View>
        </Animated.View>
    );

    const cardContent = (
        <Animated.View style={[styles[size], animatedStyle]}>
            {renderCardBack()}
            {renderCardFront()}
        </Animated.View>
    );

    if (draggable && !disabled) {
        return <GestureDetector gesture={panGesture}>{cardContent}</GestureDetector>;
    }

    if ((flippable || onPress) && !disabled) {
        return (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
                {cardContent}
            </TouchableOpacity>
        );
    }

    return cardContent;
}

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.background,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.text.light,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        padding: 10,
    },
    small: { width: 60, height: 85 },
    medium: { width: 80, height: 115 },
    large: { width: 100, height: 145 },
    cardBack: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    cardBackPattern: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBackText: {
        color: Colors.text.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardBackDesign: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4,
    },
    cardBackDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.text.white,
        opacity: 0.3,
    },
    cardFront: {
        backgroundColor: Colors.background,
        borderColor: Colors.text.light,
    },
    number: {
        fontWeight: 'bold',
        color: Colors.text.primary,
        textAlign: 'center',
    },
    smallNumber: { fontSize: 14 },
    mediumNumber: { fontSize: 18 },
    largeNumber: { fontSize: 22 },
    bullsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    bull: { textAlign: 'center' },
    smallBull: { fontSize: 8 },
    mediumBull: { fontSize: 10 },
    largeBull: { fontSize: 12 },
}); 