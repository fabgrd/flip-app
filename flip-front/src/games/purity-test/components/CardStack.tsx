import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { SwipeableCard } from './SwipeableCard';
import { PurityPlayer } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CardStackProps {
    players: PurityPlayer[];
    onSwipe: (playerId: string, direction: 'yes' | 'no') => void;
    onComplete?: () => void;
}

export function CardStack({ players, onSwipe, onComplete }: CardStackProps) {
    const [isTransitioning, setIsTransitioning] = useState(false);

    const nextCardScale = useSharedValue(0.9);
    const nextCardOpacity = useSharedValue(0.7);

    useEffect(() => {
        setIsTransitioning(false);
    }, [players.length]);

    useEffect(() => {
        if (players.length > 1) {
            nextCardScale.value = withSpring(0.95);
            nextCardOpacity.value = withSpring(0.8);
        }
    }, [players.length]);

    const handleSwipe = (direction: 'yes' | 'no') => {

        if (players.length === 0 || isTransitioning) {
            return;
        }

        setIsTransitioning(true);

        const currentPlayer = players[0];
        onSwipe(currentPlayer.id, direction);
    };

    const handleCardSwipeComplete = () => {
        setIsTransitioning(false);

        if (players.length === 1) {
            onComplete?.();
        } else {
        }
    };

    const nextCardStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: nextCardScale.value }],
            opacity: nextCardOpacity.value,
        };
    });

    const thirdCardStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: 0.85 }],
            opacity: 0.6,
        };
    });

    if (players.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            {players.length > 2 && (() => {
                return (
                    <Animated.View
                        key={`third-${players[2]?.id}`}
                        style={[styles.cardContainer, thirdCardStyle]}
                    >
                        <SwipeableCard
                            player={players[2]}
                            onSwipe={() => { }}
                            isActive={false}
                            zIndex={1}
                        />
                    </Animated.View>
                );
            })()}

            {players.length > 1 && (() => {
                return (
                    <Animated.View
                        key={`second-${players[1]?.id}`}
                        style={[styles.cardContainer, nextCardStyle]}
                    >
                        <SwipeableCard
                            player={players[1]}
                            onSwipe={() => { }}
                            isActive={false}
                            zIndex={2}
                        />
                    </Animated.View>
                );
            })()}

            {(() => {
                return (
                    <View
                        key={`active-${players[0]?.id}`}
                        style={[styles.cardContainer, styles.activeCard]}
                    >
                        <SwipeableCard
                            player={players[0]}
                            onSwipe={handleSwipe}
                            onSwipeComplete={handleCardSwipeComplete}
                            isActive={true}
                            zIndex={3}
                        />
                    </View>
                );
            })()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.8,
    },
    cardContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    activeCard: {
        zIndex: 3,
    },
});
