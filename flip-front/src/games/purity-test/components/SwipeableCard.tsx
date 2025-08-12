import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolate,
    interpolateColor,
    runOnJS,
    Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Avatar } from '../../../components';
import { Colors } from '../../../constants';
import { PurityPlayer } from '../types';
import { useTheme } from '../../../contexts/ThemeContext';

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

export function SwipeableCard({ player, onSwipe, onSwipeComplete, isActive = true, zIndex = 1 }: SwipeableCardProps) {

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

        // Notifier la fin de l'animation après un délai
        setTimeout(() => {
            onSwipeComplete?.();
        }, 350); // Légèrement après la durée de l'animation (300ms)
    };

    const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onStart: () => {
            if (!isActive) return;
            scale.value = withSpring(1.05);
        },
        onActive: (event) => {
            if (!isActive) return;
            translateX.value = event.translationX;
            translateY.value = event.translationY * 0.1; // Effet subtil vertical
        },
        onEnd: (event) => {
            if (!isActive) return;

            const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
            const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;

            if (shouldSwipeLeft) {
                // Swipe vers la gauche = NON
                translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
                translateY.value = withTiming(translateY.value + 50, { duration: 300 });
                opacity.value = withTiming(0, { duration: 300 });
                runOnJS(handleSwipeComplete)('no');
            } else if (shouldSwipeRight) {
                // Swipe vers la droite = OUI
                translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
                translateY.value = withTiming(translateY.value + 50, { duration: 300 });
                opacity.value = withTiming(0, { duration: 300 });
                runOnJS(handleSwipeComplete)('yes');
            } else {
                // Retour au centre
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                scale.value = withSpring(isActive ? 1 : 0.95);
            }
        },
    });

    const cardStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
            [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
            Extrapolate.CLAMP
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
        const progress = interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD],
            [0, 1],
            Extrapolate.CLAMP
        );

        return {
            opacity: withTiming(progress, { duration: 200 }),
            transform: [{ scale: withTiming(0.8 + progress * 0.2, { duration: 200 }) }],
        };
    });

    const noLabelStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, 0],
            [1, 0],
            Extrapolate.CLAMP
        );

        return {
            opacity: withTiming(progress, { duration: 200 }),
            transform: [{ scale: withTiming(0.8 + progress * 0.2, { duration: 200 }) }],
        };
    });

    const cardBackgroundStyle = useAnimatedStyle(() => {
        const rightColor = interpolateColor(
            translateX.value,
            [0, SWIPE_THRESHOLD],
            [theme.colors.background, '#1B5E2022']
        );

        const leftColor = interpolateColor(
            translateX.value,
            [-SWIPE_THRESHOLD, 0],
            ['#9C191922', theme.colors.background]
        );

        const backgroundColor = translateX.value > 0 ? rightColor : leftColor;

        return { backgroundColor, borderColor: theme.colors.primary } as any;
    });

    const overlayStyle = useAnimatedStyle(() => {
        const yesOpacity = interpolate(
            translateX.value,
            [SWIPE_THRESHOLD * 0.3, SWIPE_THRESHOLD],
            [0, 0.8],
            Extrapolate.CLAMP
        );

        const noOpacity = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.3],
            [0.8, 0],
            Extrapolate.CLAMP
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
            {/* Carte principale */}
            <PanGestureHandler onGestureEvent={gestureHandler} enabled={isActive}>
                <Animated.View style={[styles.card, cardStyle]}>
                    <Animated.View style={[styles.cardContent, cardBackgroundStyle, { borderColor: theme.colors.primary }]}>
                        <Avatar
                            name={player.name}
                            avatar={player.avatar}
                            size={80}
                        />
                        <Text style={[styles.playerName, { color: theme.colors.text.primary }]}>{player.name}</Text>

                        <Animated.View style={[styles.overlay, overlayStyle]}>
                            <Animated.Text style={[styles.overlayText, yesLabelStyle]}>
                                ✅
                            </Animated.Text>
                            <Animated.Text style={[styles.overlayText, noLabelStyle]}>
                                ❌
                            </Animated.Text>
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: SCREEN_WIDTH * 0.8,
        height: 300,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 20,
        gap: 20,
        borderWidth: 2,
    },
    playerName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    overlayText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
}); 