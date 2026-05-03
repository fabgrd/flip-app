import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { DotBackground, RulesButton } from '../components/common';
import { T } from '../constants/flipTokens';
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

  const handleSwipe = (playerId: string, direction: 'yes' | 'no') => {
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
      navigation.navigate('PurityResults', { results });
    }
  }, [isGameFinished]);

  useEffect(() => {
    if (canProceedToNextQuestion) nextQuestion();
  }, [canProceedToNextQuestion]);

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

  const themeColor = THEME_COLORS[currentQuestion.theme] ?? T.violet;

  const PURITY_RULES = [
    { n: '1', title: 'Lis la question', desc: 'As-tu déjà fait ça ? Sois honnête (ou pas).' },
    {
      n: '2',
      title: 'Glisse oui ou non',
      desc: "Droite = oui, gauche = non. Chaque oui = points d'impureté.",
    },
    {
      n: '3',
      title: 'Résultats',
      desc: "Le score final révèle ton niveau de pureté… ou d'impureté 😈",
    },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <DotBackground color={T.paper} opacity={0.08} />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {gameState.currentQuestionIndex + 1} / {totalQuestions}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.remainingText}>
              {remaining} restant{remaining > 1 ? 's' : ''}
            </Text>
            <RulesButton rules={PURITY_RULES} title="Test de Pureté" accentColor={T.violet} />
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` as `${number}%` }]} />
        </View>
      </View>

      {/* Question card */}
      <View style={styles.questionCard}>
        <View style={[styles.themeBadge, { backgroundColor: themeColor }]}>
          <Text style={styles.themeBadgeText}>{THEME_LABELS[currentQuestion.theme]}</Text>
        </View>
        <Text style={styles.questionPrefix}>{t('purityTest:game.questionPrefix')}</Text>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>
            +{currentQuestion.points.yes} pt{currentQuestion.points.yes > 1 ? 's' : ''}
          </Text>
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

      <View style={styles.hint}>
        <Text style={styles.hintText}>← Non | Oui →</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.violet },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#fff', fontSize: 16 },

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
  remainingText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700' },

  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: T.ink,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: T.paper,
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
    alignItems: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  themeBadge: {
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    shadowColor: T.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  themeBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionPrefix: {
    color: T.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  questionText: {
    color: T.ink,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 12,
  },
  pointsBadge: {
    backgroundColor: T.lemon,
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pointsText: { color: T.ink, fontSize: 12, fontWeight: '900' },

  cardsArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  hint: { alignItems: 'center', paddingBottom: 20 },
  hintText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontStyle: 'italic' },
});
