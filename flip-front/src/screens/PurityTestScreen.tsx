import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { usePurityTest } from '../games/purity-test';
import { THEME_COLORS, THEME_LABELS } from '../games/purity-test';
import { DraggablePlayerCard } from '../games/purity-test/components/DraggablePlayerCard';
import { Colors } from '../constants';

type PurityTestScreenRouteProp = RouteProp<RootStackParamList, 'PurityTest'>;

export function PurityTestScreen() {
    const route = useRoute<PurityTestScreenRouteProp>();
    const navigation = useNavigation();
    const { players } = route.params;
    const {
        gameState,
        currentQuestion,
        progress,
        submitAnswer,
        nextQuestion,
        canProceedToNextQuestion,
        calculateResults,
        getPlayerAnswer,
        isGameFinished,
        totalQuestions
    } = usePurityTest(players);

    const handleAnswer = (playerId: string, answer: 'yes' | 'no') => {
        submitAnswer(playerId, answer);
    };

    const handleNextQuestion = () => {
        if (canProceedToNextQuestion) {
            nextQuestion();
        }
    };

    const handleFinishGame = () => {
        const results = calculateResults();
        (navigation as any).navigate('PurityResults', { results });
    };

    if (isGameFinished) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.finishedContainer}>
                    <Text style={styles.finishedTitle}>🎉 Test terminé !</Text>
                    <Text style={styles.finishedSubtitle}>
                        Tous les joueurs ont répondu aux {totalQuestions} questions
                    </Text>
                    <TouchableOpacity
                        style={styles.resultsButton}
                        onPress={handleFinishGame}
                    >
                        <Text style={styles.resultsButtonText}>Voir les résultats</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!currentQuestion) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text>Chargement...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header avec progression */}
            <View style={styles.header}>
                <Text style={styles.questionCounter}>
                    Question {gameState.currentQuestionIndex + 1} / {totalQuestions}
                </Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.themeLabel}>
                    Thème: {THEME_LABELS[currentQuestion.theme]}
                </Text>
            </View>

            {/* Question */}
            <View style={styles.questionContainer}>
                <View style={[
                    styles.questionTheme,
                    { backgroundColor: THEME_COLORS[currentQuestion.theme] }
                ]}>
                    <Text style={styles.questionThemeText}>
                        {THEME_LABELS[currentQuestion.theme]}
                    </Text>
                </View>
                <Text style={styles.questionText}>{currentQuestion.text}</Text>
            </View>

            {/* Zones de réponse */}
            <View style={styles.dropZonesContainer}>
                <View style={[styles.staticDropZone, { backgroundColor: '#FF6B6B' }]}>
                    <Text style={styles.dropZoneText}>NON</Text>
                </View>
                <View style={[styles.staticDropZone, { backgroundColor: '#6BCF7F' }]}>
                    <Text style={styles.dropZoneText}>OUI</Text>
                </View>
            </View>

            {/* Cartes des joueurs */}
            <ScrollView style={styles.playersContainer}>
                {gameState.players.map(player => {
                    const hasAnswered = getPlayerAnswer(player.id) !== null;
                    return (
                        <DraggablePlayerCard
                            key={player.id}
                            player={player}
                            hasAnswered={hasAnswered}
                            onAnswer={handleAnswer}
                        />
                    );
                })}
            </ScrollView>

            {/* Bouton suivant */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        !canProceedToNextQuestion && styles.disabledButton
                    ]}
                    onPress={handleNextQuestion}
                    disabled={!canProceedToNextQuestion}
                >
                    <Text style={[
                        styles.nextButtonText,
                        !canProceedToNextQuestion && styles.disabledButtonText
                    ]}>
                        {gameState.currentQuestionIndex === totalQuestions - 1 ? 'Terminer' : 'Suivant'}
                    </Text>
                </TouchableOpacity>

                {!canProceedToNextQuestion && (
                    <Text style={styles.waitingText}>
                        En attente des réponses de tous les joueurs...
                    </Text>
                )}
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
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    questionCounter: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 10,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    themeLabel: {
        fontSize: 14,
        color: Colors.text.primary,
        textAlign: 'center',
    },
    questionContainer: {
        padding: 20,
        backgroundColor: Colors.background,
        margin: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    questionTheme: {
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 16,
    },
    questionThemeText: {
        color: Colors.text.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    questionText: {
        fontSize: 18,
        color: Colors.text.primary,
        textAlign: 'center',
        lineHeight: 24,
    },
    dropZonesContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    staticDropZone: {
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

    playersContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    footer: {
        padding: 20,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    nextButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#E0E0E0',
    },
    nextButtonText: {
        color: Colors.text.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButtonText: {
        color: Colors.text.primary,
    },
    waitingText: {
        textAlign: 'center',
        color: Colors.text.primary,
        fontSize: 14,
        marginTop: 8,
    },
    finishedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    finishedTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 16,
    },
    finishedSubtitle: {
        fontSize: 18,
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: 32,
    },
    resultsButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    resultsButtonText: {
        color: Colors.text.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 