import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors } from '../../constants';
import * as Haptics from 'expo-haptics';

interface TurnIndicatorPopupProps {
    playerName: string;
    visible: boolean;
}

export function TurnIndicatorPopup({ playerName, visible }: TurnIndicatorPopupProps) {
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            scale.value = withSequence(
                withTiming(1.1, { duration: 200 }),
                withTiming(1, { duration: 100 })
            );
            opacity.value = withTiming(1, { duration: 200 });
        } else {
            scale.value = withTiming(0.8, { duration: 200 });
            opacity.value = withTiming(0, { duration: 200 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    if (!visible) return null;

    return (
        <View style={styles.overlay} pointerEvents="none">
            <Animated.View style={[styles.container, animatedStyle]}>
                <Text style={styles.text}>À vous de jouer</Text>
                <Text style={styles.playerName}>{playerName} !</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
    },
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
    },
    text: {
        fontSize: 16,
        color: Colors.text.white,
        textAlign: 'center',
    },
    playerName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text.white,
        textAlign: 'center',
        marginTop: 4,
    },
}); 