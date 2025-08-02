import { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface UseCardFlipProps {
    initialState?: boolean; // true = face visible, false = face cachée
    onFlipComplete?: (isFaceUp: boolean) => void;
    disabled?: boolean;
}

export function useCardFlip({
    initialState = false,
    onFlipComplete,
    disabled = false
}: UseCardFlipProps = {}) {

    // Valeur partagée pour l'angle de rotation (0 = face cachée, 180 = face visible)
    const rotateY = useSharedValue(initialState ? 180 : 0);
    const isFaceUp = useSharedValue(initialState);

    // Animation de flip
    const flip = () => {
        if (disabled) return;

        const newFaceUp = !isFaceUp.value;
        const targetRotation = newFaceUp ? 180 : 0;

        // Feedback haptique au début du flip
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);

        rotateY.value = withTiming(
            targetRotation,
            {
                duration: 600, // Animation plus lente pour un effet réaliste
            },
            () => {
                isFaceUp.value = newFaceUp;
                if (onFlipComplete) {
                    runOnJS(onFlipComplete)(newFaceUp);
                }
            }
        );
    };

    // Retourner immédiatement sans animation
    const setFaceUp = (faceUp: boolean) => {
        isFaceUp.value = faceUp;
        rotateY.value = faceUp ? 180 : 0;
    };

    // Style animé pour la face avant (dos de la carte)
    const frontAnimatedStyle = useAnimatedStyle(() => {
        const rotateYDeg = `${rotateY.value}deg`;
        const opacity = interpolate(
            rotateY.value,
            [0, 90, 180],
            [1, 0, 0]
        );

        return {
            transform: [{ rotateY: rotateYDeg }],
            opacity,
            backfaceVisibility: 'hidden',
        };
    });

    // Style animé pour la face arrière (face visible de la carte)
    const backAnimatedStyle = useAnimatedStyle(() => {
        const rotateYDeg = `${rotateY.value}deg`;
        const opacity = interpolate(
            rotateY.value,
            [0, 90, 180],
            [0, 0, 1]
        );

        return {
            transform: [{ rotateY: rotateYDeg }],
            opacity,
            backfaceVisibility: 'hidden',
        };
    });

    return {
        flip,
        setFaceUp,
        frontAnimatedStyle,
        backAnimatedStyle,
        isFaceUp: isFaceUp.value,
    };
} 