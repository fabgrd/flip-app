import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Colors } from '../../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type ConfettiPieceConfig = {
    id: string;
    x: number;
    delay: number;
    duration: number;
    rotate: number;
    color: string;
    size: number;
};

export function ConfettiPiece({ piece, visible }: { piece: ConfettiPieceConfig; visible: boolean }) {
    const translateY = useSharedValue(-20);
    const rotate = useSharedValue(0);

    useEffect(() => {
        if (!visible) return;
        const timeout = setTimeout(() => {
            translateY.value = withTiming(SCREEN_HEIGHT + 40, { duration: piece.duration, easing: Easing.out(Easing.quad) });
            rotate.value = withTiming(piece.rotate, { duration: piece.duration });
        }, piece.delay);
        return () => clearTimeout(timeout);
    }, [visible, piece.delay, piece.duration, piece.rotate]);

    const style = useAnimatedStyle(() => ({
        transform: [
            { translateX: piece.x },
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` },
        ],
    }));

    return <Animated.View style={[styles.confettiPiece, style, { backgroundColor: piece.color, width: piece.size, height: piece.size * 2 }]} />;
}

export function ConfettiBurst({ visible, count = 22 }: { visible: boolean; count?: number }) {
    const pieces = useMemo<ConfettiPieceConfig[]>(
        () =>
            Array.from({ length: count }).map((_, i) => ({
                id: `c${i}`,
                x: Math.random() * SCREEN_WIDTH,
                delay: Math.random() * 300,
                duration: 1200 + Math.random() * 800,
                rotate: (Math.random() * 2 - 1) * 60,
                color: [Colors.primary, Colors.secondary, Colors.accent, Colors.warning, Colors.danger, Colors.success][i % 6],
                size: 6 + Math.random() * 8,
            })),
        [count]
    );

    if (!visible) return null;

    return (
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
            {pieces.map((p) => (
                <ConfettiPiece key={p.id} piece={p} visible={visible} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    confettiPiece: { position: 'absolute', top: 0, borderRadius: 2 },
}); 