import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Player, RootStackParamList } from '../types';
import { usePurityTest } from '../games/purity-test';
import { THEME_COLORS, THEME_LABELS } from '../games/purity-test';
import { CardStack } from '../games/purity-test/components';
import { Colors } from '../constants';

type PurityTestScreenRouteProp = RouteProp<RootStackParamList, 'PurityTest'>;

export function PurityTestScreen() {
    const route = useRoute<PurityTestScreenRouteProp>();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { players } = route.params as { players: Player[] };
    const {
        gameState,
        currentQuestion,
        progress,
        submitAnswer,
        nextQuestion,
        canProceedToNextQuestion,
        calculateResults,
        isGameFinished,
        totalQuestions
    } = usePurityTest(players);

    const handleSwipe = (playerId: string, direction: 'yes' | 'no') => {
        submitAnswer(playerId, direction);
    };

    const handleFinishGame = () => {
        const results = calculateResults();
        (navigation as any).navigate('PurityResults', { results });
    };

    const handleAllCardsComplete = () => {
        setTimeout(() => {
            if (canProceedToNextQuestion)
                nextQuestion();
        }, 300);
    };

    useEffect(() => {
        if (isGameFinished) {
            const results = calculateResults();
            (navigation as any).navigate('PurityResults', { results });
        }
    }, [isGameFinished]);

    useEffect(() => {
        if (canProceedToNextQuestion) {
            nextQuestion();
        }
    }, [canProceedToNextQuestion]);


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
                    {t('common:labels.question', { current: gameState.currentQuestionIndex + 1, total: totalQuestions })}
                </Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
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
                <View style={styles.questionTextContainer}>
                    <Text style={styles.questionPrefix}>{t('purityTest:game.questionPrefix')}</Text>
                    <Text style={styles.questionText}>{currentQuestion.text}</Text>
                </View>
                <View style={styles.pointsContainer}>
                    <Text style={styles.pointsText}>
                        {currentQuestion.points.yes} point{currentQuestion.points.yes > 1 ? 's' : ''}
                    </Text>
                </View>
            </View>

            {/* Pile de cartes */}
            <View style={styles.cardsContainer}>
                <CardStack
                    players={(() => {
                        const filteredPlayers = gameState.players.filter(player => {
                            const hasAnswered = player.answers.some(answer => answer.questionId === currentQuestion.id);
                            return !hasAnswered;
                        });
                        return filteredPlayers;
                    })()}
                    onSwipe={handleSwipe}
                    onComplete={handleAllCardsComplete}
                />
            </View>

            {/* Indicateur des joueurs restants */}
            <View style={styles.remainingContainer}>
                <Text style={styles.remainingText}>
                    {gameState.players.filter(player =>
                        !player.answers.some(answer => answer.questionId === currentQuestion.id)
                    ).length} {t('common:messages.remainingPlayers')}
                </Text>
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
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
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
    questionTextContainer: {
        alignItems: 'center',
    },
    questionPrefix: {
        fontSize: 16,
        color: Colors.text.secondary,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    questionText: {
        fontSize: 18,
        color: Colors.text.primary,
        textAlign: 'center',
        lineHeight: 24,
    },
    pointsContainer: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 12,
    },
    pointsText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    instructionsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    instructionsText: {
        fontSize: 14,
        color: Colors.text.secondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    cardsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    remainingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    remainingText: {
        fontSize: 14,
        color: Colors.text.secondary,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});