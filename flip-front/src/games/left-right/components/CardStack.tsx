import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { PoliticalOrientation, PoliticalPlayer } from '../types';
import { SwipeableCard } from './SwipeableCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CardStackProps {
  players: PoliticalPlayer[];
  onSwipe: (playerId: string, direction: PoliticalOrientation) => void;
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

  const handleSwipe = (direction: PoliticalOrientation) => {
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
      {/* Third card (if exists) */}
      {players.length > 2 && (
        <Animated.View
          key={`third-${players[2]?.id}`}
          style={[styles.cardContainer, thirdCardStyle]}
        >
          <SwipeableCard player={players[2]} onSwipe={() => {}} isActive={false} zIndex={1} />
        </Animated.View>
      )}

      {/* Second card (if exists) */}
      {players.length > 1 && (
        <Animated.View
          key={`second-${players[1]?.id}`}
          style={[styles.cardContainer, nextCardStyle]}
        >
          <SwipeableCard player={players[1]} onSwipe={() => {}} isActive={false} zIndex={2} />
        </Animated.View>
      )}

      {/* Active card */}
      <View key={`active-${players[0]?.id}`} style={[styles.cardContainer, styles.activeCard]}>
        <SwipeableCard
          player={players[0]}
          onSwipe={handleSwipe}
          onSwipeComplete={handleCardSwipeComplete}
          isActive
          zIndex={3}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: SCREEN_HEIGHT * 0.6,
    justifyContent: 'center',
    width: SCREEN_WIDTH,
  },
  cardContainer: {
    position: 'absolute',
  },
  activeCard: {
    zIndex: 3,
  },
});
