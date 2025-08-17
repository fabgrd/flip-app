import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { THEME_COLORS, THEME_LABELS, usePurityTest } from '../games/purity-test';
import { CardStack } from '../games/purity-test/components';
import { Player, RootStackParamList } from '../types';

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
    totalQuestions,
  } = usePurityTest(players);
  const { theme } = useTheme();

  const handleSwipe = (playerId: string, direction: 'yes' | 'no') => {
    submitAnswer(playerId, direction);
  };

  // const handleFinishGame = () => {
  //   const results = calculateResults();
  //   navigation.navigate('PurityResults', { results });
  // };

  const handleAllCardsComplete = () => {
    setTimeout(() => {
      if (canProceedToNextQuestion) nextQuestion();
    }, 300);
  };

  useEffect(() => {
    if (isGameFinished) {
      const results = calculateResults();
      navigation.navigate('PurityResults', { results });
    }
  }, [isGameFinished]);

  useEffect(() => {
    if (canProceedToNextQuestion) {
      nextQuestion();
    }
  }, [canProceedToNextQuestion]);

  if (!currentQuestion) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.colors.text.primary }}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Header avec progression */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border },
        ]}
      >
        <Text style={[styles.questionCounter, { color: theme.colors.primary }]}>
          {t('common:labels.question', {
            current: gameState.currentQuestionIndex + 1,
            total: totalQuestions,
          })}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: theme.colors.primary },
            ]}
          />
        </View>
      </View>

      {/* Question */}
      <View style={[styles.questionContainer, { backgroundColor: theme.colors.background }]}>
        <View
          style={[styles.questionTheme, { backgroundColor: THEME_COLORS[currentQuestion.theme] }]}
        >
          <Text style={[styles.questionThemeText, { color: theme.colors.text.white }]}>
            {THEME_LABELS[currentQuestion.theme]}
          </Text>
        </View>
        <View style={styles.questionTextContainer}>
          <Text style={[styles.questionPrefix, { color: theme.colors.text.secondary }]}>
            {t('purityTest:game.questionPrefix')}
          </Text>
          <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>
            {currentQuestion.text}
          </Text>
        </View>
        <View style={[styles.pointsContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
          <Text style={[styles.pointsText, { color: theme.colors.primary }]}>
            {currentQuestion.points.yes} point{currentQuestion.points.yes > 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Pile de cartes */}
      <View style={styles.cardsContainer}>
        <CardStack
          players={(() => {
            const filteredPlayers = gameState.players.filter((player) => {
              const hasAnswered = player.answers.some(
                (answer) => answer.questionId === currentQuestion.id,
              );
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
        <Text style={[styles.remainingText, { color: theme.colors.text.secondary }]}>
          {
            gameState.players.filter(
              (player) =>
                !player.answers.some((answer) => answer.questionId === currentQuestion.id),
            ).length
          }{' '}
          {t('common:messages.remainingPlayers')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    padding: 20,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  instructionsText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pointsContainer: {
    alignSelf: 'center',
    borderRadius: 6,
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    borderRadius: 3,
    height: 6,
  },
  progressFill: {
    borderRadius: 3,
    height: '100%',
  },
  questionContainer: {
    borderRadius: 12,
    elevation: 3,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionPrefix: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  questionTextContainer: {
    alignItems: 'center',
  },
  questionTheme: {
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  questionThemeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  remainingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
