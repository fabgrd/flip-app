import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { createGlobalStyles } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { POLITICAL_COLORS } from '../games/left-right';
import { CardStack } from '../games/left-right/components';
import { useLeftRight } from '../games/left-right/hooks/useLeftRight';
import { Player, RootStackParamList } from '../types';

type LeftRightScreenRouteProp = RouteProp<RootStackParamList, 'LeftRight'>;

export function LeftRightScreen() {
  const route = useRoute<LeftRightScreenRouteProp>();
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
  } = useLeftRight(players);
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);

  const handleSwipe = (playerId: string, direction: 'left' | 'right') => {
    submitAnswer(playerId, direction);
  };

  const handleAllCardsComplete = () => {
    setTimeout(() => {
      if (canProceedToNextQuestion) nextQuestion();
    }, 300);
  };

  useEffect(() => {
    if (isGameFinished) {
      const results = calculateResults();
      navigation.navigate('LeftRightResults', { results });
    }
  }, [isGameFinished, calculateResults, navigation]);

  useEffect(() => {
    if (canProceedToNextQuestion && !isGameFinished) {
      nextQuestion();
    }
  }, [canProceedToNextQuestion, nextQuestion, isGameFinished]);

  if (!currentQuestion) {
    return (
      <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={globalStyles.centerContainer}>
          <Text style={[globalStyles.text, { color: theme.colors.text.primary }]}>
            {t('common:labels.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Header with progress */}
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
        <View style={styles.questionTextContainer}>
          <Text style={[styles.questionPrefix, { color: theme.colors.text.secondary }]}>
            {t('leftRight:game.questionPrefix')}
          </Text>
          <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>
            {currentQuestion.text}
          </Text>
        </View>

        {/* Political indicators */}
        <View style={styles.indicatorsContainer}>
          <View style={[styles.politicalIndicator, { backgroundColor: POLITICAL_COLORS.left }]}>
            <Text style={styles.indicatorEmoji}>✊🌱</Text>
            <Text style={styles.indicatorText}>{t('leftRight:game.leftChoice')}</Text>
          </View>
          <View style={[styles.politicalIndicator, { backgroundColor: POLITICAL_COLORS.right }]}>
            <Text style={styles.indicatorEmoji}>🦅💼</Text>
            <Text style={styles.indicatorText}>{t('leftRight:game.rightChoice')}</Text>
          </View>
        </View>
      </View>

      {/* Card stack */}
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

      {/* Remaining players indicator */}
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

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={[styles.instructionsText, { color: theme.colors.text.secondary }]}>
          {t('leftRight:game.swipeLeft')} ← | → {t('leftRight:game.swipeRight')}
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
  header: {
    borderBottomWidth: 1,
    padding: 20,
  },
  indicatorEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  indicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  indicatorsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  instructionsText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  politicalIndicator: {
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
    textAlign: 'center',
  },
  questionTextContainer: {
    alignItems: 'center',
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
