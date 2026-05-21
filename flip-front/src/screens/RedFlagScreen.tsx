import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ChunkyButton,
  DotBackground,
  DrinkModeToggle,
  GameCard,
  GameMenuActions,
  GameRulesScreen,
  PlayersModal,
  RedFlagIcon,
  RulesButton,
  SwipeableCard,
  SwipeableCardStack,
} from '../components';
import { T } from '../constants/flipTokens';
import { useEntitlements } from '../entitlements';
import { useDrinksMode } from '../hooks';
import type { RFCategoryId, RFLevelKey, RFQuestionConfig } from '../games/red-flag';
import {
  RF_CATEGORIES,
  RF_CATEGORY_COLORS,
  RF_CATEGORY_LABELS,
  RF_DEFAULT_CAT_COUNTS,
  RF_LEVEL_COLORS,
  RF_LEVEL_INDEX,
  RF_LEVEL_KEYS,
  RF_LEVEL_LABELS,
  RF_LEVEL_POINTS,
  rfLevelRequiredEntitlement,
  useRedFlagLevelAccess,
} from '../games/red-flag';
import redFlagData from '../i18n/locales/fr/red-flag.json';
import { Player, RootStackParamList } from '../types';

const REDFLAG_BG = '#E63946';

type RedFlagRouteProp = RouteProp<RootStackParamList, 'RedFlag'>;

type RFQuestion = { id: string; t: string; c: string; p: number };

const RF_CATS = redFlagData.categories;

type EntitlementCheck = ReturnType<typeof useEntitlements>['has'];

// Clamp maxLevel to the highest the player is actually entitled to. Belt-and-suspenders:
// the UI also gates locked levels, but a stale config (e.g. premium expired between
// sessions) must never produce premium-tier questions.
function clampMaxLevelByEntitlement(level: RFLevelKey, has: EntitlementCheck): RFLevelKey {
  let safe: RFLevelKey = 'soft';
  for (const lvl of RF_LEVEL_KEYS) {
    const req = rfLevelRequiredEntitlement(lvl);
    if (req !== null && !has(req)) break;
    safe = lvl;
    if (lvl === level) return safe;
  }
  return RF_LEVEL_INDEX[safe] < RF_LEVEL_INDEX[level] ? safe : level;
}

const RF_VERDICTS = [
  {
    pctMax: 15,
    title: 'Green Flag absolu-e',
    quote: "T'es si sain-e que c'est suspect. On te surveille.",
    color: T.mint,
  },
  {
    pctMax: 30,
    title: 'Presque fréquentable',
    quote: "T'as des red flags mais rien que la thérapie peut pas fix.",
    color: '#8BC34A',
  },
  {
    pctMax: 50,
    title: 'Zone grise assumée',
    quote: 'Tes exs ont probablement un groupe WhatsApp à ton sujet.',
    color: T.lemon,
  },
  {
    pctMax: 70,
    title: 'Catastrophe sentimentale',
    quote: "Tu détruis des relations sans même t'en rendre compte. Respect.",
    color: '#FF8A50',
  },
  {
    pctMax: 85,
    title: 'Danger public',
    quote: 'Tes exs devraient pouvoir déduire la thérapie de leurs impôts.',
    color: REDFLAG_BG,
  },
  {
    pctMax: 101,
    title: 'Red Flag nucléaire',
    quote: "L'armée devrait t'interdire de télécharger Tinder.",
    color: '#8B0000',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getCatById(id: string) {
  return RF_CATS.find((c) => c.id === id) ?? { id, name: id, color: T.muted };
}

function getVerdict(pct: number) {
  return RF_VERDICTS.find((v) => pct <= v.pctMax) ?? RF_VERDICTS[RF_VERDICTS.length - 1];
}

/**
 * Builds the question set for a play session.
 * - Picks up to `config.catCounts[cat]` questions per category.
 * - Restricts to questions whose `points` ≤ the max points of the (entitlement-clamped) maxLevel.
 * - Per-category max points (used by RFResult) is computed from the actually-selected pool so
 *   percentages stay meaningful regardless of the chosen levels/counts.
 */
function buildQuestions(
  config: RFQuestionConfig,
  has: EntitlementCheck,
): { questions: RFQuestion[]; rfMax: number; catMax: Record<RFCategoryId, number> } {
  const safeLevel = clampMaxLevelByEntitlement(config.maxLevel, has);
  const maxPoints = RF_LEVEL_POINTS[safeLevel];

  const selected: RFQuestion[] = [];
  const catMax = RF_CATEGORIES.reduce(
    (acc, cat) => ({ ...acc, [cat]: 0 }),
    {} as Record<RFCategoryId, number>,
  );

  RF_CATEGORIES.forEach((catId, ci) => {
    const wanted = Math.max(0, Math.round(config.catCounts[catId] ?? 0));
    if (wanted === 0) return;
    const pool = shuffle(
      redFlagData.questions.filter((q) => q.category === catId && q.points <= maxPoints),
    );
    const take = pool.slice(0, wanted);
    take.forEach((q, pi) => {
      selected.push({ id: `${ci}-${pi}-${q.id}`, t: q.text, c: catId, p: q.points });
      catMax[catId] += q.points;
    });
  });

  const questions = shuffle(selected);
  const rfMax = questions.reduce((s, q) => s + q.p, 0);
  return { questions, rfMax, catMax };
}

// ─── RFPlayerCard ─────────────────────────────────────────────────────────────

function RFPlayerCard({
  item,
  onSwipe,
  onSwipeComplete,
  isActive = true,
  zIndex = 1,
}: {
  item: Player;
  onSwipe: (dir: 'oui' | 'non') => void;
  onSwipeComplete?: () => void;
  isActive?: boolean;
  zIndex?: number;
}) {
  return (
    <SwipeableCard
      player={item}
      leftDirection={{ key: 'non', color: T.mint, overlayColor: T.mint, emoji: '💚', label: 'Non' }}
      rightDirection={{
        key: 'oui',
        color: REDFLAG_BG,
        overlayColor: REDFLAG_BG,
        emoji: '🚩',
        label: 'Oui',
      }}
      onSwipe={(dir) => onSwipe(dir as 'oui' | 'non')}
      onSwipeComplete={onSwipeComplete}
      isActive={isActive}
      zIndex={zIndex}
    />
  );
}

// ─── RFRules ─────────────────────────────────────────────────────────────────

const RF_RULES = [
  { n: '1', title: 'Lis la question', desc: 'As-tu déjà fait ça ? Sois honnête.' },
  { n: '2', title: 'Swipe → si coupable', desc: 'Droite = oui = +points. Gauche = non = 0 point.' },
  {
    n: '3',
    title: 'Résultats',
    desc: 'Ton score révèle ton niveau de toxicité sentimentale.',
  },
];

function RFRules({
  players,
  onPlayersChange,
  onStart,
  onExit,
  onSettings,
  catCounts,
  maxLevel,
  onChangeCatCount,
  onChangeMaxLevel,
}: {
  players: Player[];
  onPlayersChange: (p: Player[]) => void;
  onStart: () => void;
  onExit: () => void;
  onSettings: () => void;
  catCounts: Record<RFCategoryId, number>;
  maxLevel: RFLevelKey;
  onChangeCatCount: (cat: RFCategoryId, value: number) => void;
  onChangeMaxLevel: (level: RFLevelKey) => void;
}) {
  const { isLevelAllowed, requestUnlockFor } = useRedFlagLevelAccess();
  const catTotal = RF_CATEGORIES.reduce((sum, cat) => sum + (catCounts[cat] ?? 0), 0);
  const maxIdx = RF_LEVEL_INDEX[maxLevel];

  return (
    <GameRulesScreen
      accentColor={REDFLAG_BG}
      title={'Es-tu un\nRed Flag ?'}
      tagline="Tes exs auraient aimé te faire passer ce test"
      icon={<RedFlagIcon size={88} />}
      iconRotation={8}
      rulesModal={{ rules: RF_RULES, title: 'Red Flag' }}
      players={players}
      onPlayersChange={onPlayersChange}
      onExit={onExit}
      onSettings={onSettings}
      minPlayers={1}
      onStart={onStart}
      startLabel="Découvrir la vérité 🚩"
      startDisabled={catTotal === 0}
    >
      <View style={rls.cardWrap}>
        <ScrollView contentContainerStyle={rls.cardScroll} showsVerticalScrollIndicator={false}>
          <DrinkModeToggle accentColor={REDFLAG_BG} />

          <View style={rls.card}>
            <Text style={rls.cardLabel}>NIVEAU DE QUESTIONS</Text>
            <Text style={rls.helperText}>Questions jusqu&apos;au niveau sélectionné</Text>
            <View style={rls.levelRow}>
              {RF_LEVEL_KEYS.map((level, i) => {
                const isActive = i <= maxIdx;
                const isSelected = level === maxLevel;
                const allowed = isLevelAllowed(level);
                return (
                  <TouchableOpacity
                    key={level}
                    style={[
                      rls.levelBtn,
                      isActive &&
                        allowed && { backgroundColor: RF_LEVEL_COLORS[level], borderColor: T.ink },
                      isSelected && allowed && rls.levelBtnSelected,
                      !allowed && rls.levelBtnLocked,
                    ]}
                    onPress={() => (allowed ? onChangeMaxLevel(level) : requestUnlockFor(level))}
                    activeOpacity={0.75}
                  >
                    {!allowed && (
                      <Feather name="lock" size={10} color={T.ink} style={rls.levelLockIcon} />
                    )}
                    <Text
                      style={[
                        rls.levelBtnText,
                        isActive && allowed && rls.levelBtnTextActive,
                        !allowed && rls.levelBtnTextLocked,
                      ]}
                    >
                      {RF_LEVEL_LABELS[level]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={rls.card}>
            <Text style={rls.cardLabel}>REPARTITION DES THEMES</Text>
            <Text style={rls.helperText}>Total: {catTotal} questions</Text>
            {RF_CATEGORIES.map((cat) => (
              <View key={cat} style={rls.sliderRow}>
                <View style={rls.sliderHeader}>
                  <Text style={rls.sliderLabel}>{RF_CATEGORY_LABELS[cat]}</Text>
                  <Text style={rls.sliderValue}>{catCounts[cat] ?? 0}</Text>
                </View>
                <Slider
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={catCounts[cat] ?? 0}
                  onValueChange={(value: number) => onChangeCatCount(cat, Math.round(value))}
                  minimumTrackTintColor={RF_CATEGORY_COLORS[cat]}
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

const rls = StyleSheet.create({
  screen: { flex: 1, backgroundColor: REDFLAG_BG },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtnText: { fontSize: 20, color: T.ink, fontWeight: '900' },
  titleArea: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  iconWrap: { position: 'absolute', right: 16, top: 20, transform: [{ rotate: '8deg' }] },
  title: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -2.5,
    lineHeight: 56,
    marginTop: 8,
    marginBottom: 4,
  },
  tagline: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: 4,
  },
  // Horizontal padding lives on the ScrollView contentContainer, not on the wrapper View,
  // so that card shadows (offset +5,+5) stay inside the ScrollView's clip region on Android.
  cardWrap: { paddingTop: 18, flex: 1 },
  cardScroll: { paddingHorizontal: 20, paddingBottom: 12, gap: 14 },
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
    marginBottom: 8,
  },
  helperText: { color: T.inkSoft, fontSize: 12, marginBottom: 12 },
  sliderRow: { marginBottom: 12 },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
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
    position: 'relative',
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
  footer: { paddingHorizontal: 20, paddingBottom: 24, paddingTop: 12 },
});

// ─── RFPlay ───────────────────────────────────────────────────────────────────

function RFPlay({
  questions,
  players,
  onFinish,
}: {
  questions: RFQuestion[];
  players: Player[];
  onFinish: (playerScores: Record<string, Record<string, number>>) => void;
}) {
  const { enabled: drinksEnabled } = useDrinksMode();
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const playerScores = useRef<Record<string, Record<string, number>>>({});

  const total = questions.length;
  const currentQ = questions[questionIdx];
  const cat = getCatById(currentQ.c);
  const remainingPlayers = players.filter((p) => !answeredIds.has(p.id));
  const progress = total > 0 ? (questionIdx / total) * 100 : 0;

  const handleSwipe = (player: Player, dir: 'oui' | 'non') => {
    if (dir === 'oui') {
      if (!playerScores.current[player.id]) playerScores.current[player.id] = {};
      const ps = playerScores.current[player.id];
      ps[currentQ.c] = (ps[currentQ.c] ?? 0) + currentQ.p;
    }
    setAnsweredIds((prev) => new Set([...prev, player.id]));
  };

  const handleAllAnswered = () => {
    setTimeout(() => {
      if (questionIdx + 1 >= total) {
        onFinish(playerScores.current);
      } else {
        setQuestionIdx((i) => i + 1);
        setAnsweredIds(new Set());
      }
    }, 300);
  };

  return (
    <SafeAreaView style={play.screen}>
      <DotBackground color={T.paper} opacity={0.08} />

      {/* Header */}
      <View style={play.header}>
        <View style={play.headerRow}>
          <View style={play.chip}>
            <Text style={play.chipText}>
              {questionIdx + 1} / {total}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={play.remainingText}>
              {remainingPlayers.length} restant{remainingPlayers.length > 1 ? 's' : ''}
            </Text>
            <RulesButton rules={RF_RULES} title="Red Flag" accentColor={REDFLAG_BG} />
          </View>
        </View>
        <View style={play.progressBar}>
          <View style={[play.progressFill, { width: `${progress}%` as `${number}%` }]} />
        </View>
      </View>

      {/* Question card */}
      <View style={play.questionCard}>
        <View style={[play.catBadge, { backgroundColor: cat.color }]}>
          <Text style={play.catBadgeText}>{cat.name.toUpperCase()}</Text>
        </View>
        <Text style={play.questionPrefix}>AS-TU DÉJÀ...</Text>
        <Text style={play.questionText}>{currentQ.t} ?</Text>
        <View style={[play.ptsBadge, drinksEnabled && play.drinkBadge]}>
          <Text style={[play.ptsBadgeText, drinksEnabled && play.drinkBadgeText]}>
            {drinksEnabled
              ? `🍻 ${currentQ.p} gorgée${currentQ.p > 1 ? 's' : ''} si oui`
              : `🚩 +${currentQ.p} pts`}
          </Text>
        </View>
      </View>

      {/* Player card stack */}
      <View style={play.cardsArea}>
        {remainingPlayers.length > 0 ? (
          <SwipeableCardStack<Player, 'oui' | 'non'>
            items={remainingPlayers}
            onSwipe={(player, dir) => handleSwipe(player, dir)}
            onComplete={handleAllAnswered}
            heightRatio={0.4}
            CardComponent={RFPlayerCard}
          />
        ) : null}
      </View>

      {/* Hint */}
      <View style={play.hint}>
        <Text style={play.hintText}>← Non | Oui →</Text>
      </View>
    </SafeAreaView>
  );
}

const play = StyleSheet.create({
  screen: { flex: 1, backgroundColor: REDFLAG_BG },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
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
  remainingText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '700' },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: T.ink,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: T.paper, borderRadius: 999 },

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
  catBadge: {
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
    shadowColor: T.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  catBadgeText: {
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
  ptsBadge: {
    backgroundColor: T.lemon,
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  ptsBadgeText: { color: T.ink, fontSize: 12, fontWeight: '900' },
  drinkBadge: { backgroundColor: REDFLAG_BG, borderColor: T.ink },
  drinkBadgeText: { color: '#fff' },

  cardsArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { alignItems: 'center', paddingBottom: 20 },
  hintText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontStyle: 'italic' },
});

// ─── RFResult ─────────────────────────────────────────────────────────────────

function RFResult({
  players,
  playerScores,
  rfMax,
  catMax,
  onReplay,
  onExit,
}: {
  players: Player[];
  playerScores: Record<string, Record<string, number>>;
  rfMax: number;
  catMax: Record<RFCategoryId, number>;
  onReplay: () => void;
  onExit: () => void;
}) {
  const results = players
    .map((p) => {
      const scores = playerScores[p.id] ?? {};
      const total = Object.values(scores).reduce((s, v) => s + v, 0);
      const pct = rfMax > 0 ? Math.round((total / rfMax) * 100) : 0;
      const verdict = getVerdict(pct);
      return { player: p, scores, pct, verdict };
    })
    .sort((a, b) => b.pct - a.pct);

  return (
    <SafeAreaView style={res.screen}>
      <DotBackground color={T.paper} opacity={0.07} />
      <ScrollView contentContainerStyle={res.scroll} showsVerticalScrollIndicator={false}>
        <Text style={res.title}>🚩 Résultats</Text>

        {results.map(({ player, scores, pct, verdict }) => (
          <GameCard
            key={player.id}
            style={[res.playerCard, { borderLeftColor: verdict.color, borderLeftWidth: 6 }]}
          >
            <View style={res.playerHeader}>
              <Text style={res.playerName}>{player.name}</Text>
              <View style={[res.scoreBadge, { backgroundColor: verdict.color }]}>
                <Text style={res.scorePct}>{pct}%</Text>
              </View>
            </View>
            <Text style={res.verdictTitle}>{verdict.title}</Text>
            <Text style={res.verdictQuote}>"{verdict.quote}"</Text>
            <View style={res.bars}>
              {RF_CATEGORIES.map((catId) => {
                const cat = getCatById(catId);
                const max = catMax[catId] ?? 0;
                const catPct = max > 0 ? Math.round(((scores[catId] ?? 0) / max) * 100) : 0;
                if (max === 0) return null;
                return (
                  <View key={catId} style={res.catRow}>
                    <Text style={res.catName}>{cat.name}</Text>
                    <View style={res.barTrack}>
                      <View
                        style={[
                          res.barFill,
                          { width: `${catPct}%` as `${number}%`, backgroundColor: cat.color },
                        ]}
                      />
                    </View>
                    <Text style={res.catPct}>{catPct}%</Text>
                  </View>
                );
              })}
            </View>
          </GameCard>
        ))}

        <View style={res.btnRow}>
          <ChunkyButton color={T.paper} onPress={onReplay} style={{ flex: 1 }}>
            Rejouer
          </ChunkyButton>
          <ChunkyButton color={T.ink} textColor="#fff" onPress={onExit} style={{ flex: 1 }}>
            Retour
          </ChunkyButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const res = StyleSheet.create({
  screen: { flex: 1, backgroundColor: REDFLAG_BG },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16, gap: 14 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1, marginBottom: 4 },
  playerCard: { gap: 8, overflow: 'hidden' },
  playerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  playerName: { color: T.ink, fontSize: 20, fontWeight: '900', letterSpacing: -0.6 },
  scoreBadge: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: T.ink,
    paddingHorizontal: 10,
    paddingVertical: 3,
    shadowColor: T.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  scorePct: { color: '#fff', fontSize: 15, fontWeight: '900' },
  verdictTitle: { color: T.ink, fontSize: 16, fontWeight: '900', letterSpacing: -0.4 },
  verdictQuote: { color: T.inkSoft, fontSize: 13, fontStyle: 'italic', lineHeight: 18 },
  bars: { gap: 6, marginTop: 4 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catName: { width: 86, fontSize: 11, fontWeight: '800', color: T.inkSoft },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: T.bgAlt,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${T.ink}15`,
  },
  barFill: { height: '100%', borderRadius: 4, minWidth: 3 },
  catPct: { width: 32, textAlign: 'right', fontSize: 11, fontWeight: '800', color: T.ink },
  btnRow: { flexDirection: 'row', gap: 12 },
});

// ─── RedFlagScreen ────────────────────────────────────────────────────────────

export function RedFlagScreen() {
  const route = useRoute<RedFlagRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { has } = useEntitlements();
  const { highestAllowedLevel } = useRedFlagLevelAccess();
  const [players, setPlayers] = useState<Player[]>(route.params.players);
  const [step, setStep] = useState<'rules' | 'play' | 'result'>('rules');
  const [playerScores, setPlayerScores] = useState<Record<string, Record<string, number>>>({});
  const [catCounts, setCatCounts] = useState<Record<RFCategoryId, number>>(() => ({
    ...RF_DEFAULT_CAT_COUNTS,
  }));
  const [maxLevel, setMaxLevel] = useState<RFLevelKey>(highestAllowedLevel);
  const [session, setSession] = useState<{
    questions: RFQuestion[];
    rfMax: number;
    catMax: Record<RFCategoryId, number>;
  } | null>(null);

  const startGame = () => {
    const built = buildQuestions({ catCounts, maxLevel }, has);
    if (built.questions.length === 0) return;
    setSession(built);
    setPlayerScores({});
    setStep('play');
  };

  if (step === 'rules') {
    return (
      <RFRules
        players={players}
        onPlayersChange={setPlayers}
        onStart={startGame}
        onExit={() => navigation.goBack()}
        onSettings={() => navigation.navigate('Settings')}
        catCounts={catCounts}
        maxLevel={maxLevel}
        onChangeCatCount={(cat, value) =>
          setCatCounts((prev) => ({ ...prev, [cat]: Math.max(0, Math.round(value)) }))
        }
        onChangeMaxLevel={setMaxLevel}
      />
    );
  }

  if (step === 'play' && session) {
    return (
      <RFPlay
        questions={session.questions}
        players={players}
        onFinish={(scores) => {
          setPlayerScores(scores);
          setStep('result');
        }}
      />
    );
  }

  if (step === 'result' && session) {
    return (
      <RFResult
        players={players}
        playerScores={playerScores}
        rfMax={session.rfMax}
        catMax={session.catMax}
        onReplay={() => setStep('rules')}
        onExit={() => navigation.goBack()}
      />
    );
  }

  // Defensive fallback: should never happen since startGame builds session before advancing.
  return null;
}
