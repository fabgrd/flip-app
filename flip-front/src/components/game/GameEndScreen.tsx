import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GamePlayer } from '../../types/game';
import { Colors, GlobalStyles } from '../../constants';

interface GameEndScreenProps {
    players: GamePlayer[];
    winner: GamePlayer;
    onPlayAgain: () => void;
    onGoHome: () => void;
}

export function GameEndScreen({ players, winner, onPlayAgain, onGoHome }: GameEndScreenProps) {
    const sortedPlayers = [...players].sort((a, b) => a.score - b.score);

    const handlePlayAgain = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPlayAgain();
    };

    const handleGoHome = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onGoHome();
    };

    const getRankEmoji = (index: number) => {
        switch (index) {
            case 0: return '🏆';
            case 1: return '🥈';
            case 2: return '🥉';
            default: return '😔';
        }
    };

    const getRankColor = (index: number) => {
        switch (index) {
            case 0: return Colors.warning; // Or pour le gagnant
            case 1: return Colors.text.light; // Argent pour le 2e
            case 2: return Colors.secondary; // Bronze pour le 3e
            default: return Colors.text.secondary;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header avec félicitations */}
            <View style={styles.header}>
                <Text style={styles.gameOverTitle}>Jeu terminé !</Text>
                <View style={styles.winnerSection}>
                    <Text style={styles.winnerEmoji}>🎉</Text>
                    <Text style={styles.winnerText}>Félicitations {winner.name} !</Text>
                    <Text style={styles.winnerScore}>Score final : {winner.score} 🐮</Text>
                </View>
            </View>

            {/* Classement final */}
            <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.resultsTitle}>Classement final</Text>

                {sortedPlayers.map((player, index) => (
                    <View
                        key={player.id}
                        style={[
                            styles.playerResult,
                            index === 0 && styles.winnerResult
                        ]}
                    >
                        <View style={styles.rankSection}>
                            <Text style={styles.rankEmoji}>{getRankEmoji(index)}</Text>
                            <Text style={[styles.rankNumber, { color: getRankColor(index) }]}>
                                #{index + 1}
                            </Text>
                        </View>

                        <View style={styles.playerInfo}>
                            <Text style={[
                                styles.playerName,
                                index === 0 && styles.winnerName
                            ]}>
                                {player.name}
                            </Text>
                            <Text style={styles.playerDetailsText}>
                                {player.collectedCards.length} cartes collectées
                            </Text>
                        </View>

                        <View style={styles.scoreSection}>
                            <Text style={[
                                styles.finalScore,
                                index === 0 && styles.winnerFinalScore
                            ]}>
                                {player.score}
                            </Text>
                            <Text style={styles.bullsLabel}>🐮</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[GlobalStyles.buttonSecondary, styles.actionButton]}
                    onPress={handlePlayAgain}
                >
                    <Ionicons name="refresh" size={20} color={Colors.text.white} />
                    <Text style={[GlobalStyles.buttonText, styles.actionButtonText]}>
                        Rejouer
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[GlobalStyles.buttonPrimary, styles.actionButton]}
                    onPress={handleGoHome}
                >
                    <Ionicons name="home" size={20} color={Colors.text.white} />
                    <Text style={[GlobalStyles.buttonText, styles.actionButtonText]}>
                        Accueil
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    header: {
        backgroundColor: Colors.success,
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center',
    },

    gameOverTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text.white,
        marginBottom: 20,
    },

    winnerSection: {
        alignItems: 'center',
    },

    winnerEmoji: {
        fontSize: 48,
        marginBottom: 10,
    },

    winnerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.white,
        marginBottom: 5,
    },

    winnerScore: {
        fontSize: 16,
        color: Colors.text.white,
        opacity: 0.9,
    },

    resultsContainer: {
        flex: 1,
        padding: 20,
    },

    resultsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: 20,
    },

    playerResult: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: 15,
        marginVertical: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    winnerResult: {
        borderColor: Colors.warning,
        backgroundColor: '#FFF9E6',
    },

    rankSection: {
        alignItems: 'center',
        marginRight: 15,
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
        marginRight: 10,
    },

    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 2,
    },

    winnerName: {
        color: Colors.warning,
    },

    playerDetailsText: {
        fontSize: 12,
        color: Colors.text.secondary,
    },

    scoreSection: {
        alignItems: 'center',
        minWidth: 60,
    },

    finalScore: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.danger,
    },

    winnerFinalScore: {
        color: Colors.warning,
    },

    bullsLabel: {
        fontSize: 12,
        marginTop: 2,
    },

    actionsContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },

    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },

    actionButtonText: {
        marginLeft: 8,
    },
}); 