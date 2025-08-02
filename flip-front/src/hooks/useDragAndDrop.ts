import { useRef } from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface DropZone {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface UseDragAndDropProps {
    dropZones: DropZone[];
    onDrop: (targetZoneId: number) => void;
    onInvalidDrop?: () => void;
    disabled?: boolean;
}

export function useDragAndDrop({
    dropZones,
    onDrop,
    onInvalidDrop,
    disabled = false
}: UseDragAndDropProps) {
    // Valeurs partagées pour les animations
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(0);
    const isDragging = useSharedValue(false);

    // Position initiale de la carte
    const initialPosition = useRef({ x: 0, y: 0 });

    // Fonction pour détecter dans quelle zone on lâche la carte
    const findDropZone = (x: number, y: number): DropZone | null => {
        return dropZones.find(zone =>
            x >= zone.x &&
            x <= zone.x + zone.width &&
            y >= zone.y &&
            y <= zone.y + zone.height
        ) || null;
    };

    // Animation de retour à la position initiale
    const animateToInitialPosition = () => {
        'worklet';
        translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        scale.value = withSpring(1, { damping: 10 });
        zIndex.value = 0;
        isDragging.value = false;
    };

    // Animation vers une zone de drop
    const animateToDropZone = (zone: DropZone, callback: () => void) => {
        'worklet';
        const targetX = zone.x + zone.width / 2 - initialPosition.current.x;
        const targetY = zone.y + zone.height / 2 - initialPosition.current.y;

        translateX.value = withSpring(targetX, { damping: 15, stiffness: 100 });
        translateY.value = withSpring(targetY, { damping: 15, stiffness: 100 });
        scale.value = withSpring(0.9, { damping: 10 }, () => {
            runOnJS(callback)();
        });
        zIndex.value = 0;
        isDragging.value = false;
    };

    // Feedback haptique
    const triggerHapticFeedback = (type: 'start' | 'success' | 'error') => {
        'worklet';
        switch (type) {
            case 'start':
                runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
                break;
            case 'success':
                runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
                break;
            case 'error':
                runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
                break;
        }
    };

    // Geste de pan (drag)
    const panGesture = Gesture.Pan()
        .enabled(!disabled)
        .onStart(() => {
            isDragging.value = true;
            scale.value = withSpring(1.1, { damping: 10 });
            zIndex.value = 1000;
            triggerHapticFeedback('start');
        })
        .onUpdate((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
            const absoluteX = initialPosition.current.x + event.translationX;
            const absoluteY = initialPosition.current.y + event.translationY;

            const dropZone = findDropZone(absoluteX, absoluteY);

            if (dropZone) {
                // Drop réussi
                triggerHapticFeedback('success');
                animateToDropZone(dropZone, () => {
                    onDrop(dropZone.id);
                });
            } else {
                // Drop échoué - retour à la position initiale
                triggerHapticFeedback('error');
                animateToInitialPosition();
                if (onInvalidDrop) {
                    runOnJS(onInvalidDrop)();
                }
            }
        });

    // Style animé pour le composant
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
        zIndex: zIndex.value,
    }));

    // Fonction pour définir la position initiale
    const setInitialPosition = (x: number, y: number) => {
        initialPosition.current = { x, y };
    };

    // Fonction pour réinitialiser la position
    const resetPosition = () => {
        translateX.value = 0;
        translateY.value = 0;
        scale.value = 1;
        zIndex.value = 0;
        isDragging.value = false;
    };

    return {
        panGesture,
        animatedStyle,
        setInitialPosition,
        resetPosition,
        isDragging,
    };
} 