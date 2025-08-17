import * as Haptics from 'expo-haptics';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Avatar } from '../../../components';
import { useTheme } from '../../../contexts/ThemeContext';
import { PurityPlayer } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3; // 30% de l'écran
const ROTATION_ANGLE = 30; // Angle max de rotation

interface SwipeableCardProps {
  player: PurityPlayer;
  onSwipe: (direction: 'yes' | 'no') => void;
  onSwipeComplete?: () => void;
  isActive?: boolean;
  zIndex?: number;
}

export function SwipeableCard({
  player,
  onSwipe,
  onSwipeComplete,
  isActive = true,
  zIndex = 1,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(isActive ? 1 : 0.95);
  const opacity = useSharedValue(isActive ? 1 : 0.8);
  const { theme } = useTheme();

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSwipeComplete = (direction: 'yes' | 'no') => {
    triggerHaptic();
    onSwipe(direction);
    setTimeout(() => {
      onSwipeComplete?.();
    }, 350);
  };

  // Nouvelle API Gesture
  const panGesture = Gesture.Pan()
    .enabled(isActive)
    .onStart(() => {
      if (!isActive) return;
      scale.value = withSpring(1.05);
    })
    .onUpdate((event) => {
      if (!isActive) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.1;
    })
    .onEnd(() => {
      if (!isActive) return;

      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;

      if (shouldSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(translateY.value + 50, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(handleSwipeComplete)('no');
      } else if (shouldSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(translateY.value + 50, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(handleSwipeComplete)('yes');
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(isActive ? 1 : 0.95);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
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

  const yesLabelStyle = useAnimatedStyle(() => {
    const progress = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], 'clamp');

    return {
      opacity: withTiming(progress, { duration: 200 }),
      transform: [{ scale: withTiming(0.8 + progress * 0.2, { duration: 200 }) }],
    };
  });

  const noLabelStyle = useAnimatedStyle(() => {
    const progress = interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], 'clamp');

    return {
      opacity: withTiming(progress, { duration: 200 }),
      transform: [{ scale: withTiming(0.8 + progress * 0.2, { duration: 200 }) }],
    };
  });

  const cardBackgroundStyle = useAnimatedStyle(() => {
    const rightColor = interpolateColor(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [theme.colors.background, '#1B5E2022'],
    );

    const leftColor = interpolateColor(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      ['#9C191922', theme.colors.background],
    );

    const backgroundColor = translateX.value > 0 ? rightColor : leftColor;

    return { backgroundColor, borderColor: theme.colors.primary };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const yesOpacity = interpolate(
      translateX.value,
      [SWIPE_THRESHOLD * 0.3, SWIPE_THRESHOLD],
      [0, 0.8],
      'clamp',
    );

    const noOpacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.3],
      [0.8, 0],
      'clamp',
    );

    const showYes = translateX.value > SWIPE_THRESHOLD * 0.3;
    const showNo = translateX.value < -SWIPE_THRESHOLD * 0.3;

    return {
      opacity: showYes ? yesOpacity : showNo ? noOpacity : 0,
      backgroundColor: showYes ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
    };
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Animated.View
            style={[styles.cardContent, cardBackgroundStyle, { borderColor: theme.colors.primary }]}
          >
            <Avatar name={player.name} avatar={player.avatar} size={80} />
            <Text style={[styles.playerName, { color: theme.colors.text.primary }]}>
              {player.name}
            </Text>

            <Animated.View style={[styles.overlay, overlayStyle]}>
              <Animated.Text style={[styles.overlayText, yesLabelStyle]}>✅</Animated.Text>
              <Animated.Text style={[styles.overlayText, noLabelStyle]}>❌</Animated.Text>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    elevation: 10,
    height: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    width: SCREEN_WIDTH * 0.8,
  },
  cardContent: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  overlay: {
    alignItems: 'center',
    borderRadius: 20,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
