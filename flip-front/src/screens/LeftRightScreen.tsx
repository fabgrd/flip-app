import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { DotBackground, RulesButton } from '../components/common';
import { T } from '../constants/flipTokens';
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
    if (canProceedToNextQuestion && !isGameFinished) nextQuestion();
  }, [canProceedToNextQuestion, nextQuestion, isGameFinished]);

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>{t('common:labels.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const remaining = gameState.players.filter(
    (p) => !p.answers.some((a) => a.questionId === currentQuestion.id),
  ).length;

  const LEFT_RIGHT_RULES = [
    {
      n: '1',
      title: 'Une phrase apparaît',
      desc: 'Elle décrit une opinion politique ou une valeur.',
    },
    {
      n: '2',
      title: 'Chacun joue tour à tour',
      desc: 'Glisse vers la gauche ou la droite selon tes convictions.',
    },
    {
      n: '3',
      title: 'Résultats collectifs',
      desc: 'On révèle le spectre politique de chaque joueur à la fin.',
    },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <DotBackground color={T.ink} opacity={0.06} />
      {/* Header / progress */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {t('common:labels.question')} {gameState.currentQuestionIndex + 1}/{totalQuestions}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.remainingText}>
              {remaining} restant{remaining > 1 ? 's' : ''}
            </Text>
            <RulesButton rules={LEFT_RIGHT_RULES} title="Gauche ou Droite" accentColor={T.lemon} />
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` as `${number}%` }]} />
        </View>
      </View>

      {/* Question card */}
      <View style={styles.questionCard}>
        <Text style={styles.questionPrefix}>{t('leftRight:game.questionPrefix')}</Text>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
      </View>

      {/* Political direction indicators */}
      <View style={styles.indicators}>
        <View
          style={[styles.indicator, { backgroundColor: POLITICAL_COLORS.left, borderColor: T.ink }]}
        >
          <Text style={styles.indicatorEmoji}>✊🌱</Text>
          <Text style={styles.indicatorLabel}>{t('leftRight:game.leftChoice')}</Text>
        </View>
        <View
          style={[
            styles.indicator,
            { backgroundColor: POLITICAL_COLORS.right, borderColor: T.ink },
          ]}
        >
          <Text style={styles.indicatorEmoji}>🦅💼</Text>
          <Text style={styles.indicatorLabel}>{t('leftRight:game.rightChoice')}</Text>
        </View>
      </View>

      {/* Card stack */}
      <View style={styles.cardsArea}>
        <CardStack
          players={gameState.players.filter(
            (p) => !p.answers.some((a) => a.questionId === currentQuestion.id),
          )}
          onSwipe={handleSwipe}
          onComplete={handleAllCardsComplete}
        />
      </View>

      {/* Swipe hint */}
      <View style={styles.hint}>
        <Text style={styles.hintText}>
          {t('leftRight:game.swipeLeft')} ← | → {t('leftRight:game.swipeRight')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.gaucheDroiteAccent ?? T.lemon },

  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: T.ink, fontSize: 16 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: T.paper,
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipText: { color: T.ink, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  remainingText: { color: T.inkSoft, fontSize: 13, fontWeight: '700' },

  progressBar: {
    height: 8,
    backgroundColor: `${T.ink}20`,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: T.ink,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: T.ink,
    borderRadius: 999,
  },

  questionCard: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  questionPrefix: {
    color: T.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
    textAlign: 'center',
  },
  questionText: {
    color: T.ink,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 26,
    textAlign: 'center',
  },

  indicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 10,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: T.rSm,
    paddingVertical: 8,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  indicatorEmoji: { fontSize: 18, marginBottom: 2 },
  indicatorLabel: { color: '#fff', fontSize: 12, fontWeight: '900', textAlign: 'center' },

  cardsArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hint: { alignItems: 'center', paddingBottom: 20 },
  hintText: { color: T.inkSoft, fontSize: 13, fontStyle: 'italic' },
});
