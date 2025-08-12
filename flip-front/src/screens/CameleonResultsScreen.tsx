import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, ZoomIn, withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Colors, GlobalStyles } from '../constants';
import { RootStackParamList } from '../types';
import type { CameleonAssignedPlayer } from '../games/cameleon';
import { ConfettiBurst } from '../components/common';
import { useTheme } from '../contexts/ThemeContext';


type CameleonResultsRoute = RouteProp<RootStackParamList, 'CameleonResults'>;

export function CameleonResultsScreen() {
    const { t } = useTranslation();
    const route = useRoute<CameleonResultsRoute>();
    const navigation = useNavigation();
    const { theme } = useTheme();

    const { players } = route.params as { players: CameleonAssignedPlayer[] };

    const winner: 'civilians' | 'undercover' = useMemo(() => {
        const alive = players.filter(p => !p.isEliminated);
        const impostorsAlive = alive.filter(p => p.role === 'cameleon' || p.role === 'mrWhite').length;
        return impostorsAlive === 0 ? 'civilians' : 'undercover';
    }, [players]);

    const computeRoundPoints = (p: CameleonAssignedPlayer) => {
        const isImpostor = p.role === 'cameleon' || p.role === 'mrWhite';
        if (winner === 'undercover') return isImpostor ? 6 : 0; // imposteurs gagnants -> +6
        return !isImpostor ? 2 : 0; // civils gagnants -> +2
    };

    const withCumulativePoints = useMemo(() => {
        return players.map((p) => {
            const prev = (p as any).score ?? 0;
            const round = computeRoundPoints(p);
            const bonus = (p as any).scoreBonus ?? 0;
            return { ...p, points: prev + round + bonus } as any;
        });
    }, [players, winner]);

    const sorted = useMemo(() => {
        return [...withCumulativePoints].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
    }, [withCumulativePoints]);

    const scale = useSharedValue(0.5);
    const winnerStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        scale.value = withSpring(1, { damping: 8, stiffness: 120 });
        const timer = setTimeout(() => setShowConfetti(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const winnerText = winner === 'civilians' ? t('cameleon:outcome.civiliansWin') : t('cameleon:outcome.undercoverWin');
    const winnerBg = winner === 'civilians' ? { backgroundColor: '#1B5E2055' } : { backgroundColor: '#9C191955' };

    const handleReplay = () => {
        const nextPlayers = players.map((p) => {
            const prev = (p as any).score ?? 0;
            const round = computeRoundPoints(p);
            const bonus = (p as any).scoreBonus ?? 0;
            return { ...p, score: prev + round + bonus, scoreBonus: 0 } as any;
        });
        (navigation as any).navigate('Cameleon', { players: nextPlayers });
    };

    return (
        <SafeAreaView style={[GlobalStyles.container, styles.container, { backgroundColor: theme.colors.background }]}>
            <ConfettiBurst visible={showConfetti} />

            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.primary }]}>{t('cameleon:results.title')}</Text>
                <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>{t('cameleon:results.subtitle')}</Text>
            </View>

            <Animated.View entering={FadeIn} style={[styles.winnerBanner, winnerBg, winnerStyle]}>
                <Text style={[styles.winnerText, { color: theme.colors.text.primary }]}>🏆 {winnerText}</Text>
            </Animated.View>

            <View style={[styles.card, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                {sorted.map((p) => (
                    <Animated.View key={p.id} entering={ZoomIn} style={[styles.row, { borderBottomColor: theme.colors.border }]}>
                        <Text style={[styles.name, { color: theme.colors.text.primary }]}>{p.name}</Text>
                        <Text style={[styles.role, { color: theme.colors.text.secondary }]}>{(p.role === 'civilian' ? t('cameleon:roles.civilian') : p.role === 'cameleon' ? t('cameleon:roles.cameleon') : t('cameleon:roles.mrWhite'))}</Text>
                        <View style={styles.wordCell}>
                            {p.role === 'mrWhite' ? (
                                <>
                                    <Text style={[styles.word, { color: p.mrWhiteGuessCorrect ? theme.colors.success : theme.colors.text.secondary }, p.mrWhiteGuessCorrect && styles.wordCorrect]} numberOfLines={1}>
                                        {p.mrWhiteGuess ? p.mrWhiteGuess : '—'}
                                    </Text>
                                    {p.mrWhiteGuessCorrect && (
                                        <Text style={[styles.bonusBadge, { color: theme.colors.success }]}>+5</Text>
                                    )}
                                </>
                            ) : (
                                <Text style={[styles.word, { color: theme.colors.text.secondary }]} numberOfLines={1}>{p.secretWord ?? '—'}</Text>
                            )}
                        </View>
                        <Text style={[styles.points, { color: theme.colors.text.primary }]}>{p.points}</Text>
                    </Animated.View>
                ))}
            </View>

            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]} onPress={handleReplay}>
                <Text style={[styles.primaryBtnText, { color: theme.colors.text.white }]}>{t('common:buttons.playAgain', 'Rejouer')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary }]} onPress={() => navigation.navigate('Home' as never)}>
                <Text style={[styles.secondaryBtnText, { color: theme.colors.primary }]}>{t('common:buttons.back')}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 14, marginTop: 4, textAlign: 'center' },
    winnerBanner: { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, marginBottom: 8 },
    winnerText: { fontSize: 18, fontWeight: '900' },
    card: { margin: 16, padding: 16, borderRadius: 12, borderWidth: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
    name: { fontSize: 16, fontWeight: '600', flex: 1 },
    role: { fontSize: 18, width: 110, textAlign: 'center', fontWeight: '800' },
    wordCell: { width: 110, alignItems: 'flex-end' },
    word: { fontSize: 14 },
    wordCorrect: { fontWeight: '800' },
    bonusBadge: { marginTop: 2, fontWeight: '900', fontSize: 12 },
    points: { width: 50, textAlign: 'right', fontSize: 16, fontWeight: '900' },
    primaryBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginHorizontal: 16, marginTop: 8 },
    primaryBtnText: { fontSize: 16, fontWeight: 'bold' },
    secondaryBtn: { marginTop: 8, borderWidth: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 16 },
    secondaryBtnText: { fontSize: 16, fontWeight: '600' },
}); 