import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChunkyButton,
  DotBackground,
  DrinkModeToggle,
  GameMenuActions,
  GameRulesScreen,
  PlayersModal,
  PureteIcon,
  RulesButton,
} from '../components';
import { T } from '../constants/flipTokens';
import { CardStack } from '../games/purity-test/components';
import { THEME_COLORS, THEME_LABELS } from '../games/purity-test/constants';
import { usePurityTest } from '../games/purity-test/hooks/usePurityTest';
import type { LevelKey, Theme } from '../games/purity-test/types';
import { usePurityLevelAccess } from '../games/purity-test/usePurityLevelAccess';
import { useDrinksMode } from '../hooks';
import { Player, RootStackParamList } from '../types';

type PurityTestScreenRouteProp = RouteProp<RootStackParamList, 'PurityTest'>;

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

const LEVEL_KEYS: LevelKey[] = ['level1', 'level2', 'level3', 'level4', 'level5'];

const LEVEL_LABELS: Record<LevelKey, string> = {
  level1: 'Soft',
  level2: 'Chill',
  level3: 'Medium',
  level4: 'Hot',
  level5: 'Hard',
  levelBonus: 'Bonus',
};

const LEVEL_COLORS = ['#8BC4A0', '#6BB5DE', '#F4C542', '#F4834F', '#E05252'];

function maxLevelToLevelCounts(maxLevel: LevelKey): Record<LevelKey, number> {
  const maxIdx = LEVEL_KEYS.indexOf(maxLevel);
  const counts: Record<LevelKey, number> = {
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    levelBonus: 0,
  };
  LEVEL_KEYS.forEach((key, i) => {
    counts[key] = i <= maxIdx ? 5 : 0;
  });
  return counts;
}

function PurityRules({
  players,
  onPlayersChange,
  onStart,
  onExit,
  onSettings,
  themeCounts,
  maxLevel,
  onChangeThemeCount,
  onChangeMaxLevel,
}: {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onStart: () => void;
  onExit: () => void;
  onSettings: () => void;
  themeCounts: Record<Theme, number>;
  maxLevel: LevelKey;
  onChangeThemeCount: (theme: Theme, value: number) => void;
  onChangeMaxLevel: (level: LevelKey) => void;
}) {
  const { isLevelAllowed, requestUnlockFor } = usePurityLevelAccess();
  const themeTotal = Object.values(themeCounts).reduce((sum, val) => sum + val, 0);
  const maxIdx = LEVEL_KEYS.indexOf(maxLevel);

  return (
    <GameRulesScreen
      accentColor={T.violet}
      title={'Test\nde Pureté'}
      tagline="Combien de péchés à ton actif ?"
      icon={<PureteIcon size={86} />}
      rulesModal={{ rules: PURITY_RULES, title: 'Test de Pureté' }}
      players={players}
      onPlayersChange={onPlayersChange}
      onExit={onExit}
      onSettings={onSettings}
      minPlayers={1}
      onStart={onStart}
      startLabel="Commencer le test"
      startDisabled={themeTotal === 0}
    >
      <View style={pr.cardWrap}>
        <ScrollView contentContainerStyle={pr.cardScroll} showsVerticalScrollIndicator={false}>
          <DrinkModeToggle accentColor={T.violet} />

          <View style={pr.card}>
            <Text style={pr.cardLabel}>NIVEAU DE QUESTIONS</Text>
            <Text style={pr.helperText}>Questions jusqu&apos;au niveau sélectionné</Text>
            <View style={pr.levelRow}>
              {LEVEL_KEYS.map((level, i) => {
                const isActive = i <= maxIdx;
                const isSelected = level === maxLevel;
                const allowed = isLevelAllowed(level);
                return (
                  <TouchableOpacity
                    key={level}
                    style={[
                      pr.levelBtn,
                      isActive &&
                        allowed && { backgroundColor: LEVEL_COLORS[i], borderColor: T.ink },
                      isSelected && allowed && pr.levelBtnSelected,
                      !allowed && pr.levelBtnLocked,
                    ]}
                    onPress={() => (allowed ? onChangeMaxLevel(level) : requestUnlockFor(level))}
                    activeOpacity={0.75}
                  >
                    {!allowed && (
                      <Feather name="lock" size={10} color={T.ink} style={pr.levelLockIcon} />
                    )}
                    <Text
                      style={[
                        pr.levelBtnText,
                        isActive && allowed && pr.levelBtnTextActive,
                        !allowed && pr.levelBtnTextLocked,
                      ]}
                    >
                      {LEVEL_LABELS[level]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={pr.card}>
            <Text style={pr.cardLabel}>REPARTITION DES THEMES</Text>
            <Text style={pr.helperText}>Total: {themeTotal} questions</Text>
            {(Object.keys(themeCounts) as Theme[]).map((theme) => (
              <View key={theme} style={pr.sliderRow}>
                <View style={pr.sliderHeader}>
                  <Text style={pr.sliderLabel}>{THEME_LABELS[theme]}</Text>
                  <Text style={pr.sliderValue}>{themeCounts[theme]}</Text>
                </View>
                <Slider
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={themeCounts[theme]}
                  onValueChange={(value: number) => onChangeThemeCount(theme, value)}
                  minimumTrackTintColor={THEME_COLORS[theme]}
                  maximumTrackTintColor="#E6E2DD"
                  thumbTintColor={T.ink}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </GameRulesScreen>
  );
}

const pr = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.violet },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtnText: { fontSize: 20, color: T.ink, fontWeight: '900' },
  titleArea: { paddingHorizontal: 20, paddingTop: 16 },
  iconWrap: { position: 'absolute', right: 16, top: 18 },
  title: {
    color: '#fff',
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 62,
    marginTop: 12,
  },
  tagline: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: 6,
  },
  // Horizontal padding lives on the ScrollView contentContainer, not on the wrapper View,
  // so that card shadows (offset +5,+5) stay inside the ScrollView's clip region on Android.
  cardWrap: { paddingTop: 24, flex: 1 },
  cardScroll: { paddingHorizontal: 20, paddingBottom: 12, gap: 16 },
  card: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 24,
    padding: 20,
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  helperText: { color: T.inkSoft, fontSize: 12, marginBottom: 12 },
  sliderRow: { marginBottom: 14 },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sliderLabel: { color: T.ink, fontSize: 14, fontWeight: '800' },
  sliderValue: { color: T.ink, fontSize: 13, fontWeight: '900' },
  levelRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  levelBtn: {
    flex: 1,
    minWidth: 56,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E6E2DD',
    backgroundColor: '#F5F2ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBtnSelected: {
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  levelBtnText: { color: T.muted, fontSize: 11, fontWeight: '800', textAlign: 'center' },
  levelBtnTextActive: { color: T.ink },
  levelBtnLocked: {
    backgroundColor: '#EFEAE3',
    borderColor: '#DCD3C5',
    opacity: 0.78,
  },
  levelBtnTextLocked: { color: T.muted },
  levelLockIcon: { position: 'absolute', top: 4, right: 4 },
  footer: { padding: 20, paddingBottom: 32 },
});

export function PurityTestScreen() {
  const route = useRoute<PurityTestScreenRouteProp>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { enabled: drinksEnabled } = useDrinksMode();
  const { highestAllowedLevel } = usePurityLevelAccess();
  const [players, setPlayers] = useState<Player[]>(route.params.players as Player[]);
  const [showRules, setShowRules] = useState(true);
  const [themeCounts, setThemeCounts] = useState<Record<Theme, number>>({
    sex: 5,
    drugs: 5,
    morality: 5,
    hygiene: 5,
  });
  const [maxLevel, setMaxLevel] = useState<LevelKey>(highestAllowedLevel);
  const levelCounts = maxLevelToLevelCounts(maxLevel);
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
    resetGame,
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

  if (showRules) {
    return (
      <PurityRules
        players={players}
        onPlayersChange={setPlayers}
        onStart={() => {
          resetGame({ themeCounts, levelCounts });
          setShowRules(false);
        }}
        onExit={() => navigation.goBack()}
        onSettings={() => navigation.navigate('Settings')}
        themeCounts={themeCounts}
        maxLevel={maxLevel}
        onChangeThemeCount={(theme, value) =>
          setThemeCounts((prev) => ({ ...prev, [theme]: Math.round(value) }))
        }
        onChangeMaxLevel={setMaxLevel}
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

  const themeColor = THEME_COLORS[currentQuestion.theme] ?? T.violet;

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
        <View style={[styles.pointsBadge, drinksEnabled && styles.drinkBadge]}>
          <Text style={[styles.pointsText, drinksEnabled && styles.drinkText]}>
            {drinksEnabled
              ? `🍻 ${currentQuestion.points.yes} gorgée${currentQuestion.points.yes > 1 ? 's' : ''} si oui`
              : `+${currentQuestion.points.yes} pt${currentQuestion.points.yes > 1 ? 's' : ''}`}
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
  drinkBadge: { backgroundColor: T.tomato, borderColor: T.ink },
  drinkText: { color: '#fff' },

  cardsArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  hint: { alignItems: 'center', paddingBottom: 20 },
  hintText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontStyle: 'italic' },
});
