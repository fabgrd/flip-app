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
import { RootStackParamList, PurityResults } from '../types';
import { THEME_LABELS, THEME_COLORS } from '../games/purity-test';
import { Colors } from '../constants';

type PurityResultsScreenRouteProp = RouteProp<RootStackParamList, 'PurityResults'>;

export function PurityResultsScreen() {
    const route = useRoute<PurityResultsScreenRouteProp>();
    const navigation = useNavigation();
    const { results } = route.params;

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
        if (percentage >= 90) return { label: 'Diabolique', color: '#FD79A8', emoji: '👹' };
        if (percentage >= 75) return { label: 'Très impur(e)', color: '#FF6B6B', emoji: '😈' };
        if (percentage >= 60) return { label: 'Coquin(e)', color: '#FFEAA7', emoji: '😏' };
        if (percentage >= 45) return { label: 'Mitigé(e)', color: '#FFD93D', emoji: '😐' };
        if (percentage >= 30) return { label: 'Plutôt sage', color: '#4ECDC4', emoji: '🙂' };
        if (percentage >= 15) return { label: 'Assez pur(e)', color: '#96CEB4', emoji: '😊' };
        return { label: 'Saint(e)', color: '#6BCF7F', emoji: '😇' };
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🏆 Résultats du Test d'Impureté</Text>
                <Text style={styles.subtitle}>Classement par pourcentage d'impureté</Text>
            </View>

            <ScrollView style={styles.resultsContainer}>
                {results.players.map((result, index) => {
                    const impurityLevel = getImpurityLevel(result.impurityPercentage);
                    return (
                        <View key={result.player.id} style={styles.playerResult}>
                            <View style={styles.playerHeader}>
                                <View style={styles.rankContainer}>
                                    <Text style={styles.rankEmoji}>{getRankEmoji(result.rank)}</Text>
                                    <Text style={styles.rankNumber}>#{result.rank}</Text>
                                </View>
                                <View style={styles.playerInfo}>
                                    <Text style={styles.playerName}>{result.player.name}</Text>
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
                            <View style={styles.themesContainer}>
                                <Text style={styles.themesTitle}>Détail par thème :</Text>
                                <View style={styles.themesGrid}>
                                    {Object.entries(result.themePercentages).map(([theme, percentage]) => (
                                        <View key={theme} style={styles.themeItem}>
                                            <View style={[
                                                styles.themeIndicator,
                                                { backgroundColor: THEME_COLORS[theme as keyof typeof THEME_COLORS] }
                                            ]} />
                                            <Text style={styles.themeName}>
                                                {THEME_LABELS[theme as keyof typeof THEME_LABELS]}
                                            </Text>
                                            <Text style={styles.themePercentage}>{percentage}%</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
                    <Text style={styles.backButtonText}>Retour à l'accueil</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    header: {
        padding: 20,
        backgroundColor: Colors.background,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
    resultsContainer: {
        flex: 1,
        padding: 16,
    },
    playerResult: {
        backgroundColor: Colors.background,
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
        color: Colors.text.secondary,
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
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
        borderTopColor: '#E0E0E0',
        paddingTop: 16,
    },
    themesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.primary,
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
        color: Colors.text.secondary,
    },
    themePercentage: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.text.primary,
        minWidth: 30,
        textAlign: 'right',
    },
    footer: {
        padding: 20,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    backButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    backButtonText: {
        color: Colors.text.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 