import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type StackCardProps<T, D> = {
  item: T;
  onSwipe: (direction: D) => void;
  onSwipeComplete?: () => void;
  isActive?: boolean;
  zIndex?: number;
};

interface SwipeableCardStackProps<T extends { id: string }, D> {
  items: T[];
  onSwipe: (item: T, direction: D) => void;
  onComplete?: () => void;
  heightRatio?: number;
  CardComponent: React.ComponentType<StackCardProps<T, D>>;
}

export function SwipeableCardStack<T extends { id: string }, D>({
  items,
  onSwipe,
  onComplete,
  heightRatio = 0.6,
  CardComponent,
}: SwipeableCardStackProps<T, D>) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextCardScale = useSharedValue(0.9);
  const nextCardOpacity = useSharedValue(0.7);

  useEffect(() => {
    setIsTransitioning(false);
  }, [items.length]);

  useEffect(() => {
    if (items.length > 1) {
      nextCardScale.value = withSpring(0.95);
      nextCardOpacity.value = withSpring(0.8);
    }
  }, [items.length, nextCardOpacity, nextCardScale]);

  const handleSwipe = (direction: D) => {
    if (items.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    onSwipe(items[0], direction);
  };

  const handleCardSwipeComplete = () => {
    setIsTransitioning(false);
    if (items.length === 1) onComplete?.();
  };

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nextCardScale.value }],
    opacity: nextCardOpacity.value,
  }));

  const thirdCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.85 }],
    opacity: 0.6,
  }));

  if (items.length === 0) return null;

  return (
    <View style={[styles.container, { height: SCREEN_HEIGHT * heightRatio }]}>
      {items.length > 2 && (
        <Animated.View key={`third-${items[2]?.id}`} style={[styles.cardContainer, thirdCardStyle]}>
          <CardComponent item={items[2]} onSwipe={() => {}} isActive={false} zIndex={1} />
        </Animated.View>
      )}

      {items.length > 1 && (
        <Animated.View key={`second-${items[1]?.id}`} style={[styles.cardContainer, nextCardStyle]}>
          <CardComponent item={items[1]} onSwipe={() => {}} isActive={false} zIndex={2} />
        </Animated.View>
      )}

      <View key={`active-${items[0]?.id}`} style={[styles.cardContainer, styles.activeCard]}>
        <CardComponent
          item={items[0]}
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
    flex: 1,
    justifyContent: 'center',
    width: SCREEN_WIDTH,
  },
  cardContainer: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  activeCard: { zIndex: 3 },
});
