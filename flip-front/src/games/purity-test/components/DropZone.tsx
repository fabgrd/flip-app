import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { Colors } from '../../../constants';

interface DropZoneProps {
    label: string;
    answer: 'yes' | 'no';
    color: string;
    isActive: boolean;
    onDrop: (playerId: string, answer: 'yes' | 'no') => void;
}

export function DropZone({ label, answer, color, isActive, onDrop }: DropZoneProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.7);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    React.useEffect(() => {
        if (isActive) {
            scale.value = withSpring(1.1);
            opacity.value = withSpring(1);
        } else {
            scale.value = withSpring(1);
            opacity.value = withSpring(0.7);
        }
    }, [isActive]);

    return (
        <Animated.View
            style={[
                styles.dropZone,
                { backgroundColor: color },
                animatedStyle
            ]}
        >
            <Text style={styles.dropZoneText}>{label}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    dropZone: {
        flex: 1,
        height: 120,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
        borderWidth: 3,
        borderStyle: 'dashed',
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    dropZoneText: {
        color: Colors.text.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
}); 