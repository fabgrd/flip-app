import * as Haptics from 'expo-haptics';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { T } from '../../constants/flipTokens';
import { Player } from '../../types';
import { Avatar } from './Avatar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const DOWN_SWIPE_THRESHOLD = 110;
const ROTATION_ANGLE = 18;
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const CARD_HEIGHT = 320;

export interface SwipeDirection {
  key: string;
  color: string;
  overlayColor: string;
  emoji: string;
  label: string;
  hideOverlay?: boolean;
}

export interface SwipeableCardProps {
  player: Player;
  leftDirection: SwipeDirection;
  rightDirection: SwipeDirection;
  downDirection?: SwipeDirection;
  onSwipe: (direction: string) => void;
  onSwipeComplete?: () => void;
  isActive?: boolean;
  zIndex?: number;
}

export function SwipeableCard({
  player,
  leftDirection,
  rightDirection,
  downDirection,
  onSwipe,
  onSwipeComplete,
  isActive = true,
  zIndex = 1,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(isActive ? 1 : 0.95);
  const opacity = useSharedValue(isActive ? 1 : 0.8);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSwipeComplete = (direction: string) => {
    triggerHaptic();
    onSwipe(direction);
    setTimeout(() => {
      onSwipeComplete?.();
    }, 350);
  };

  const panGesture = Gesture.Pan()
    .enabled(isActive)
    .onStart(() => {
      if (!isActive) return;
      scale.value = withSpring(1.04, { damping: 15 });
    })
    .onUpdate((event) => {
      if (!isActive) return;
      translateX.value = event.translationX;
      if (downDirection && event.translationY > 0 && Math.abs(event.translationY) > Math.abs(event.translationX)) {
        translateY.value = event.translationY;
      } else {
        translateY.value = event.translationY * 0.12;
      }
    })
    .onEnd(() => {
      if (!isActive) return;

      const isVerticalDominant = Math.abs(translateY.value) > Math.abs(translateX.value);
      const shouldSwipeDown =
        !!downDirection && isVerticalDominant && translateY.value > DOWN_SWIPE_THRESHOLD;
      const shouldSwipeLeft = !shouldSwipeDown && translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = !shouldSwipeDown && translateX.value > SWIPE_THRESHOLD;

      if (shouldSwipeDown) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
        opacity.value = withTiming(0, { duration: 280 });
        runOnJS(handleSwipeComplete)(downDirection!.key);
      } else if (shouldSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(translateY.value + 60, { duration: 300 });
        opacity.value = withTiming(0, { duration: 280 });
        runOnJS(handleSwipeComplete)(leftDirection.key);
      } else if (shouldSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(translateY.value + 60, { duration: 300 });
        opacity.value = withTiming(0, { duration: 280 });
        runOnJS(handleSwipeComplete)(rightDirection.key);
      } else {
        translateX.value = withSpring(0, { damping: 18 });
        translateY.value = withSpring(0, { damping: 18 });
        scale.value = withSpring(isActive ? 1 : 0.95, { damping: 15 });
      }
    });

  const downOverlayStyle = useAnimatedStyle(() => {
    const o = downDirection
      ? interpolate(translateY.value, [0, 20, DOWN_SWIPE_THRESHOLD], [0, 0.15, 1], 'clamp')
      : 0;
    return { opacity: o };
  });

  // Card transform
  const cardAnimStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
      'clamp',
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotate}deg` },
      ],
      opacity: opacity.value,
      zIndex,
    };
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardOuter, cardAnimStyle]}>
          <View style={styles.cardInner}>
            <Avatar name={player.name} color={player.color} size={88} />
            <Text style={styles.playerName}>{player.name}</Text>
            {downDirection && !downDirection.hideOverlay && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.downOverlay,
                  { backgroundColor: downDirection.overlayColor },
                  downOverlayStyle,
                ]}
              >
                <Text style={styles.downOverlayEmoji}>{downDirection.emoji}</Text>
                <Text style={styles.downOverlayLabel}>{downDirection.label}</Text>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },

  // Outer card — chunky static ink shadow (risograph style)
  cardOuter: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: T.rLg,
    shadowColor: T.ink,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },

  // Inner card — solid paper background + ink border
  cardInner: {
    flex: 1,
    borderRadius: T.rLg,
    borderWidth: 2.5,
    borderColor: T.ink,
    backgroundColor: T.paper,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 28,
    overflow: 'hidden',
  },

  playerName: {
    color: T.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.2,
    textAlign: 'center',
    lineHeight: 36,
  },

  downOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downOverlayEmoji: { fontSize: 64 },
  downOverlayLabel: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: T.ink,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
});
