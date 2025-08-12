import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, runOnJS } from 'react-native-reanimated';
import { useTheme } from '../../../contexts/ThemeContext';

interface RevealCardProps {
    name: string;
    roleLabel: string;
    secretWord: string | null;
    onNext: () => void;
    t: (key: string, opts?: any) => string;
}

export function RevealCard({ name, roleLabel, secretWord, onNext, t }: RevealCardProps) {
    const { theme } = useTheme();
    const rotation = useSharedValue(0);
    const [flipped, setFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const frontStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${interpolate(rotation.value, [0, 1], [0, 180])}deg` }],
        backfaceVisibility: 'hidden' as any,
    }));

    const backStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${interpolate(rotation.value, [0, 1], [180, 360])}deg` }],
        backfaceVisibility: 'hidden' as any,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }));

    const handleFlip = () => {
        if (isAnimating) return;

        if (!flipped) {
            setIsAnimating(true);
            rotation.value = withTiming(1, { duration: 500 }, (finished) => {
                if (finished) {
                    runOnJS(setIsAnimating)(false);
                    runOnJS(setFlipped)(true);
                }
            });
        } else {
            setIsAnimating(true);
            onNext();
            rotation.value = 0;
            setFlipped(false);
            setTimeout(() => setIsAnimating(false), 250);
        }
    };

    return (
        <View style={styles.wrapper}>
            <View style={[styles.card, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <Animated.View style={[styles.faceContainer, frontStyle]}>
                    <Text style={[styles.title, { color: theme.colors.text.primary }]}>{t('cameleon:reveal.title')}</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>{t('cameleon:reveal.subtitle')}</Text>
                    <Text style={[styles.name, { color: theme.colors.primary }]}>{name}</Text>
                    <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }, isAnimating && styles.btnDisabled]} onPress={handleFlip} disabled={isAnimating}>
                        <Text style={[styles.primaryBtnText, { color: theme.colors.text.white }]}>{t('cameleon:actions.reveal')}</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.faceContainer, backStyle]}>
                    {secretWord === null ? (
                        <>
                            <Text style={[styles.mrWhiteLabel, { color: theme.colors.primary }]}>{roleLabel}</Text>
                            <Text style={[styles.mrWhiteWarning, { color: theme.colors.text.secondary }]}>{t('cameleon:reveal.mrWhiteWarning')}</Text>
                        </>
                    ) : (
                        <View style={[styles.wordBadge, { backgroundColor: theme.colors.secondary, borderColor: theme.colors.accent }]}>
                            <Text style={[styles.wordText, { color: theme.colors.text.white }]}>{secretWord}</Text>
                        </View>
                    )}

                    <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }, isAnimating && styles.btnDisabled]} onPress={handleFlip} disabled={isAnimating}>
                        <Text style={[styles.primaryBtnText, { color: theme.colors.text.white }]}>{t('common:buttons.continue')}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
    card: { width: '92%', maxWidth: 460, height: 320, borderRadius: 16, alignItems: 'center', justifyContent: 'center', padding: 16, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
    faceContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', padding: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
    subtitle: { fontSize: 14, marginBottom: 16, textAlign: 'center' },
    name: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    primaryBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginTop: 8 },
    primaryBtnText: { fontWeight: 'bold' },
    btnDisabled: { opacity: 0.6 },
    wordBadge: {
        borderWidth: 3,
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginBottom: 16,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
        transform: [{ rotate: '-1.5deg' }],
    },
    wordText: { fontSize: 42, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' as any, textAlign: 'center' },
    mrWhiteLabel: { fontSize: 24, fontWeight: '900', marginBottom: 6 },
    mrWhiteWarning: { fontSize: 16, textAlign: 'center', marginBottom: 16, paddingHorizontal: 16 },
}); 