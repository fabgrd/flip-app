import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ChunkyButton,
  DotBackground,
  DrinkModeToggle,
  GameHeader,
  GameRulesScreen,
  GameSetupCard,
  GaucheDroiteIcon,
  RoundsStepper,
  RulesButton
} from '../components';
import { T } from '../constants/flipTokens';
import { POLITICAL_COLORS } from '../games/left-right';
import { CardStack } from '../games/left-right/components';
import { useLeftRight } from '../games/left-right/hooks/useLeftRight';
import { useDrinksMode } from '../hooks';
import { Player, RootStackParamList } from '../types';

type LeftRightScreenRouteProp = RouteProp<RootStackParamList, 'LeftRight'>;

function LRRules({
  players,
  onPlayersChange,
  onStart,
  onExit,
  onSettings,
  totalRounds,
  onTotalRoundsChange,
}: {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onStart: () => void;
  onExit: () => void;
  onSettings: () => void;
  totalRounds: number;
  onTotalRoundsChange: (n: number) => void;
}) {
  const { t } = useTranslation();
  const rules = (t('leftRight:ui.steps', { returnObjects: true }) as { n: string; title: string; desc: string }[]);
  return (
    <GameRulesScreen
      accentColor={T.gaucheDroiteAccent ?? T.lemon}
      title={t('leftRight:ui.title')}
      tagline={t('leftRight:ui.tagline')}
      icon={<GaucheDroiteIcon size={86} />}
      rulesModal={{ rules, title: t('leftRight:ui.modalTitle') }}
      players={players}
      onPlayersChange={onPlayersChange}
      onExit={onExit}
      onSettings={onSettings}
      minPlayers={1}
      onStart={onStart}
      startLabel={t('leftRight:ui.start')}
    >
      <View style={{ paddingHorizontal: 20, paddingBottom: 12, marginTop: 'auto' }}>
        <GameSetupCard
          accentColor={T.gaucheDroiteAccent ?? T.lemon}
          title={t('common:labels.setup').toUpperCase()}
        >
          <RoundsStepper
            value={totalRounds}
            onChange={onTotalRoundsChange}
            min={1}
            max={20}
            accentColor={T.gaucheDroiteAccent ?? T.lemon}
            inline
          />
          <DrinkModeToggle accentColor={T.lemon} inline />
        </GameSetupCard>
      </View>
    </GameRulesScreen>
  );
}

export function LeftRightScreen() {
  const route = useRoute<LeftRightScreenRouteProp>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { enabled: drinksEnabled } = useDrinksMode();
  const [players, setPlayers] = useState<Player[]>(route.params.players as Player[]);
  const [showRules, setShowRules] = useState(true);
  const [revealQuestionId, setRevealQuestionId] = useState<string | null>(null);
  const [totalRounds, setTotalRounds] = useState<number>(10);
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
  } = useLeftRight(players, totalRounds);

  const handleSwipe = (playerId: string, direction: 'left' | 'right' | 'center') => {
    submitAnswer(playerId, direction);
  };

  const handleAllCardsComplete = () => { };

  // The "minority camp drinks" rule is mathematically impossible below 3 players
  // (you can only ever get unanimity or a 1/1 tie), so drinks mode is gated here.
  const drinksActive = drinksEnabled && gameState.players.length >= 3;

  useEffect(() => {
    if (isGameFinished) {
      const results = calculateResults();
      navigation.navigate('LeftRightResults', { results });
    }
  }, [isGameFinished, calculateResults, navigation]);

  useEffect(() => {
    if (!canProceedToNextQuestion || isGameFinished) return;
    if (drinksActive) {
      if (currentQuestion && revealQuestionId !== currentQuestion.id) {
        setRevealQuestionId(currentQuestion.id);
      }
    } else {
      nextQuestion();
    }
  }, [
    canProceedToNextQuestion,
    isGameFinished,
    drinksActive,
    currentQuestion,
    revealQuestionId,
    nextQuestion,
  ]);

  const revealData = useMemo(() => {
    if (!revealQuestionId) return null;
    const leftPlayers: Player[] = [];
    const rightPlayers: Player[] = [];
    const centerPlayers: Player[] = [];
    gameState.players.forEach((p) => {
      const a = p.answers.find((x) => x.questionId === revealQuestionId);
      if (a?.answer === 'left') leftPlayers.push(p);
      else if (a?.answer === 'right') rightPlayers.push(p);
      else if (a?.answer === 'center') centerPlayers.push(p);
    });
    const sides: Array<{ key: 'left' | 'right' | 'center'; count: number }> = [
      { key: 'left', count: leftPlayers.length },
      { key: 'right', count: rightPlayers.length },
      { key: 'center', count: centerPlayers.length },
    ].filter((s) => s.count > 0) as Array<{ key: 'left' | 'right' | 'center'; count: number }>;

    const minCount = sides.length > 0 ? Math.min(...sides.map((s) => s.count)) : 0;
    const minorityKeys = sides
      .filter((s) => s.count === minCount)
      .map((s) => s.key);

    // Only one camp voted → everyone agreed.
    const isUnanimous = sides.length <= 1;
    // Every active camp has the same count → no camp is smaller than another.
    const isTie = sides.length > 1 && minorityKeys.length === sides.length;
    // Otherwise the smallest camp(s) drink — including a partial tie for the
    // smallest count (e.g. 3/1/1 → both camps of 1 drink).
    const minoritySides: Array<'left' | 'right' | 'center'> =
      isUnanimous || isTie ? [] : minorityKeys;

    const drinkers = gameState.players.filter((p) => {
      const a = p.answers.find((x) => x.questionId === revealQuestionId);
      return a ? minoritySides.includes(a.answer) : false;
    });

    return { leftPlayers, rightPlayers, centerPlayers, minoritySides, drinkers, isTie, isUnanimous };
  }, [revealQuestionId, gameState.players]);

  const closeReveal = () => {
    setRevealQuestionId(null);
    nextQuestion();
  };

  if (showRules) {
    return (
      <LRRules
        players={players}
        onPlayersChange={setPlayers}
        onStart={() => setShowRules(false)}
        onExit={() => navigation.goBack()}
        onSettings={() => navigation.navigate('Settings')}
        totalRounds={totalRounds}
        onTotalRoundsChange={setTotalRounds}
      />
    );
  }

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

  return (
    <SafeAreaView style={styles.screen}>
      <DotBackground color={T.ink} opacity={0.06} />
      <GameHeader
        onExit={() => navigation.goBack()}
        onSettings={() => navigation.navigate('Settings' as never)}
        rules={{
          title: t('leftRight:ui.modalTitle'),
          rules: t('leftRight:ui.steps', { returnObjects: true }) as any,
          accentColor: T.lemon,
        }}
        players={players}
        onPlayersChange={setPlayers}
        progress={progress}
        progressFillColor={T.lemon}
      />
      <View style={styles.metaRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>
            {t('common:labels.question')} {gameState.currentQuestionIndex + 1}/{totalQuestions}
          </Text>
        </View>
        <Text style={styles.remainingText}>
          {t('leftRight:ui.remaining', { count: remaining })}
        </Text>
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
            { backgroundColor: POLITICAL_COLORS.center, borderColor: T.ink },
          ]}
        >
          <Text style={styles.indicatorEmoji}>⚖️</Text>
          <Text style={styles.indicatorLabel}>{t('leftRight:game.centerChoice')}</Text>
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
        <Text style={styles.hintText}>↓ {t('leftRight:game.swipeDown')}</Text>
      </View>

      {revealData && (
        <View style={styles.revealOverlay} pointerEvents="auto">
          <View style={styles.revealCard}>
            <Text style={styles.revealTitle}>{t('leftRight:ui.reveal.title')}</Text>
            <View style={styles.revealRow}>
              <View
                style={[
                  styles.revealSide,
                  { backgroundColor: POLITICAL_COLORS.left, borderColor: T.ink },
                  revealData.minoritySides.includes('left') && styles.revealSideMinority,
                ]}
              >
                <Text style={styles.revealSideLabel}>{t('leftRight:ui.reveal.left')}</Text>
                <Text style={styles.revealSideCount}>{revealData.leftPlayers.length}</Text>
                <Text style={styles.revealSideNames} numberOfLines={3}>
                  {revealData.leftPlayers.map((p) => p.name).join(', ') || '—'}
                </Text>
              </View>
              <View
                style={[
                  styles.revealSide,
                  { backgroundColor: POLITICAL_COLORS.center, borderColor: T.ink },
                  revealData.minoritySides.includes('center') && styles.revealSideMinority,
                ]}
              >
                <Text style={styles.revealSideLabel}>{t('leftRight:ui.reveal.center')}</Text>
                <Text style={styles.revealSideCount}>{revealData.centerPlayers.length}</Text>
                <Text style={styles.revealSideNames} numberOfLines={3}>
                  {revealData.centerPlayers.map((p) => p.name).join(', ') || '—'}
                </Text>
              </View>
              <View
                style={[
                  styles.revealSide,
                  { backgroundColor: POLITICAL_COLORS.right, borderColor: T.ink },
                  revealData.minoritySides.includes('right') && styles.revealSideMinority,
                ]}
              >
                <Text style={styles.revealSideLabel}>{t('leftRight:ui.reveal.right')}</Text>
                <Text style={styles.revealSideCount}>{revealData.rightPlayers.length}</Text>
                <Text style={styles.revealSideNames} numberOfLines={3}>
                  {revealData.rightPlayers.map((p) => p.name).join(', ') || '—'}
                </Text>
              </View>
            </View>
            <View style={styles.revealDrinkBanner}>
              <Text style={styles.revealDrinkText}>
                {revealData.isUnanimous
                  ? t('leftRight:ui.reveal.unanimous')
                  : revealData.isTie
                    ? t('leftRight:ui.reveal.tie')
                    : t('leftRight:ui.reveal.drink', { names: revealData.drinkers.map((p) => p.name).join(', ') })}
              </Text>
            </View>
            <ChunkyButton full color={T.paper} onPress={closeReveal}>
              {t('leftRight:ui.reveal.nextBtn')}
            </ChunkyButton>
          </View>
        </View>
      )}
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
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

  revealOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(24,22,19,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 50,
  },
  revealCard: {
    width: '100%',
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    padding: 18,
    gap: 14,
    shadowColor: T.ink,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  revealTitle: {
    color: T.ink,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  revealRow: { flexDirection: 'row', gap: 10 },
  revealSide: {
    flex: 1,
    borderWidth: 2,
    borderRadius: T.rMd,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  revealSideMinority: {
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  revealSideLabel: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  revealSideCount: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  revealSideNames: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    opacity: 0.95,
  },
  revealDrinkBanner: {
    backgroundColor: T.lemon,
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  revealDrinkText: {
    color: T.ink,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});
