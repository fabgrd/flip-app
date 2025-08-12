import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, PurityResults } from '../types';
import { THEME_LABELS, THEME_COLORS } from '../games/purity-test';
import { Colors } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

type PurityResultsScreenRouteProp = RouteProp<RootStackParamList, 'PurityResults'>;

export function PurityResultsScreen() {
    const route = useRoute<PurityResultsScreenRouteProp>();
    const navigation = useNavigation();
    const results = route.params?.results;
    const { t } = useTranslation();
    const { theme } = useTheme();

    const handleBackToHome = () => {
        navigation.navigate('Home' as never);
    };

    const getRankEmoji = (rank: number) => {
        switch (rank) {
            case 1: return '👑';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return '🏅';
        }
    };

    const getImpurityLevel = (percentage: number) => {
        if (percentage <= 10) return { label: t('purityTest:results.impurityLevels.saint'), color: '#6BCF7F', emoji: '😇' };
        if (percentage <= 25) return { label: t('purityTest:results.impurityLevels.pure'), color: '#96CEB4', emoji: '😊' };
        if (percentage <= 35) return { label: t('purityTest:results.impurityLevels.mostlyPure'), color: '#4ECDC4', emoji: '🙂' };
        if (percentage <= 45) return { label: t('purityTest:results.impurityLevels.mixed'), color: '#FFD93D', emoji: '😐' };
        if (percentage <= 55) return { label: t('purityTest:results.impurityLevels.naughty'), color: '#FFEAA7', emoji: '😏' };
        if (percentage <= 65) return { label: t('purityTest:results.impurityLevels.veryImpure'), color: '#FF6B6B', emoji: '😈' };
        if (percentage <= 75) return { label: t('purityTest:results.impurityLevels.diabolical'), color: '#FD79A8', emoji: '👹' };
        return { label: t('purityTest:results.impurityLevels.beyondEvil'), color: '#000000', emoji: '💀' };
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.title, { color: theme.colors.primary }]}>{t('purityTest:results.title')}</Text>
                <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>{t('purityTest:results.subtitle')}</Text>
            </View>

            <ScrollView style={styles.resultsContainer}>
                {results.players.map((result: any) => {
                    const impurityLevel = getImpurityLevel(result.impurityPercentage);
                    return (
                        <View key={result.player.id} style={[styles.playerResult, { backgroundColor: theme.colors.background }]}>
                            <View style={styles.playerHeader}>
                                <View style={styles.rankContainer}>
                                    <Text style={styles.rankEmoji}>{getRankEmoji(result.rank)}</Text>
                                    <Text style={[styles.rankNumber, { color: theme.colors.text.secondary }]}>#{result.rank}</Text>
                                </View>
                                <View style={styles.playerInfo}>
                                    <Text style={[styles.playerName, { color: theme.colors.text.primary }]}>{result.player.name}</Text>
                                    <Text style={[styles.purityLevel, { color: impurityLevel.color }]}>
                                        {impurityLevel.emoji} {impurityLevel.label}
                                    </Text>
                                </View>
                                <View style={styles.scoreContainer}>
                                    <Text style={[styles.percentage, { color: impurityLevel.color }]}>
                                        {result.impurityPercentage}%
                                    </Text>
                                </View>
                            </View>

                            {/* Détails par thème */}
                            <View style={[styles.themesContainer, { borderTopColor: theme.colors.border }]}>
                                <Text style={[styles.themesTitle, { color: theme.colors.text.primary }]}>{t('purityTest:results.themeDetails')}</Text>
                                <View style={styles.themesGrid}>
                                    {Object.entries(result.themePercentages).map(([themeKey, percentage]) => (
                                        <View key={themeKey} style={styles.themeItem}>
                                            <View style={[styles.themeIndicator, { backgroundColor: THEME_COLORS[themeKey as keyof typeof THEME_COLORS] }]} />
                                            <Text style={[styles.themeName, { color: theme.colors.text.secondary }]}>
                                                {THEME_LABELS[themeKey as keyof typeof THEME_LABELS]}
                                            </Text>
                                            <Text style={[styles.themePercentage, { color: theme.colors.text.primary }]}>{percentage as number}%</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
                <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.colors.primary }]} onPress={handleBackToHome}>
                    <Text style={[styles.backButtonText, { color: theme.colors.text.white }]}>{t('purityTest:results.backToHome')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    resultsContainer: {
        flex: 1,
        padding: 16,
    },
    playerResult: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    playerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    rankContainer: {
        alignItems: 'center',
        marginRight: 16,
        minWidth: 50,
    },
    rankEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    rankNumber: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    purityLevel: {
        fontSize: 14,
        fontWeight: '600',
    },
    scoreContainer: {
        alignItems: 'center',
    },
    percentage: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    themesContainer: {
        borderTopWidth: 1,
        paddingTop: 16,
    },
    themesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    themesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    themeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginBottom: 8,
    },
    themeIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    themeName: {
        flex: 1,
        fontSize: 12,
    },
    themePercentage: {
        fontSize: 12,
        fontWeight: 'bold',
        minWidth: 30,
        textAlign: 'right',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
    },
    backButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 