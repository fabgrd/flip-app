// Paranoïa — secret question, target picks, coin flip reveals or hides
// Flow: rules → handoff Q → q-show → handoff Target → t-pick → coin → reveal → next/end
import { Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ChunkyButton,
  DotBackground,
  DrinkModeToggle,
  GameCard,
  GameChip,
  GameMenuActions,
  InitialAvatar,
  ParanoiaIcon,
  PlayersModal,
  StickerBadge,
} from '../components';
import { T } from '../constants/flipTokens';
import { ContentItem, useGameContent } from '../content';
import { ParanoiaHistoryEntry, ParanoiaOrder, ParanoiaStep } from '../games/paranoia';
import { useDrinksMode } from '../hooks';
import { Player, RootStackParamList } from '../types';
import { shuffleArray } from '../utils/array';

type ParanoiaScreenRouteProp = RouteProp<RootStackParamList, 'Paranoia'>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildOrder(players: Player[], questions: readonly ContentItem[]): ParanoiaOrder[] {
  if (players.length < 2 || questions.length === 0) return [];
  const idxs = players.map((_, i) => i).sort(() => Math.random() - 0.5);
  const qs = shuffleArray([...questions]).slice(0, players.length);
  return idxs.map((qIdx, i) => {
    const others = players.map((_, j) => j).filter((j) => j !== qIdx);
    const tIdx = others[Math.floor(Math.random() * others.length)];
    return { q: qIdx, t: tIdx, question: qs[i].text };
  });
}

// ─── Screen: Rules ────────────────────────────────────────────────────────────

function PNRules({
  players,
  onPlayersChange,
  onStart,
  onExit,
  onSettings,
}: {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onStart: () => void;
  onExit: () => void;
  onSettings: () => void;
}) {
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const { t } = useTranslation();
  const rulesModal = t('paranoia:ui.rules.steps', {
    returnObjects: true,
  }) as { n: string; title: string; desc: string }[];

  return (
    <SafeAreaView style={rules.screen}>
      <DotBackground color={T.ink} opacity={0.1} />

      <View style={rules.header}>
        <ChunkyButton square size="sm" color={T.paper} onPress={onExit}>
          <Feather name="arrow-left" size={18} color={T.ink} />
        </ChunkyButton>
        <GameMenuActions
          showDice={false}
          onPressSettings={onSettings}
          rules={{ rules: rulesModal, title: t('paranoia:ui.rules.title'), accentColor: T.teal }}
          players={players}
          onPlayersChange={onPlayersChange}
        />
      </View>

      <View style={rules.titleArea}>
        {/* Paranoia icon top-right */}
        <View style={rules.iconWrap}>
          <ParanoiaIcon size={80} />
        </View>

        <Text style={rules.title}>{t('paranoia:ui.rules.title')}</Text>
        <Text style={rules.tagline}>{t('paranoia:ui.rules.tagline')}</Text>
      </View>

      <View style={{ flex: 1 }} />

      <View style={rules.toggleWrap}>
        <DrinkModeToggle accentColor={T.teal} />
      </View>

      <View style={rules.footer}>
        <ChunkyButton
          full
          color={T.paper}
          onPress={() => {
            if (players.length < 4) {
              setShowPlayersModal(true);
              return;
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            onStart();
          }}
        >
          {t('paranoia:ui.rules.start')}
        </ChunkyButton>
      </View>
      <PlayersModal
        visible={showPlayersModal}
        onClose={() => setShowPlayersModal(false)}
        onPlayersChange={onPlayersChange}
      />
    </SafeAreaView>
  );
}

const rules = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.teal },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtnText: { fontSize: 20, color: T.ink, fontWeight: '900' },
  titleArea: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 0 },
  iconWrap: { position: 'absolute', right: 16, top: 18 },
  title: {
    color: '#fff',
    fontSize: 68,
    fontWeight: '900',
    letterSpacing: -2.5,
    lineHeight: 72,
    marginTop: 12,
  },
  tagline: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: 6,
  },
  toggleWrap: { paddingHorizontal: 20, paddingBottom: 12 },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Screen: Handoff ──────────────────────────────────────────────────────────

function PNHandoff({
  playerIdx,
  playerName,
  role,
  subtitle,
  accentColor,
  onReady,
}: {
  playerIdx: number;
  playerName: string;
  role: string;
  subtitle: string;
  accentColor: string;
  onReady: () => void;
}) {
  const btnTextColor = accentColor === T.lemon ? T.ink : '#fff';
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: T.ink }}>
      <SafeAreaView style={ho.screen}>
        <View style={ho.center}>
          <View style={[ho.roleBadge, { backgroundColor: accentColor, borderColor: accentColor }]}>
            <Text style={ho.roleBadgeText}>
              {t('paranoia:ui.handoff.roleLabel', { role: role.toUpperCase() })}
            </Text>
          </View>

          <InitialAvatar
            index={playerIdx}
            label={playerName[0].toUpperCase()}
            size={120}
            radius={32}
            borderColor={T.ink}
            shadowColor={accentColor}
          />

          <Text style={ho.name}>{t('paranoia:ui.handoff.givePhone', { name: playerName })}</Text>
          <Text style={ho.subtitle}>{subtitle}</Text>
        </View>

        <View style={ho.footer}>
          <ChunkyButton
            full
            color={accentColor}
            textColor={btnTextColor}
            shadowColor={accentColor}
            onPress={onReady}
          >
            {t('paranoia:ui.handoff.ready')}
          </ChunkyButton>
        </View>
      </SafeAreaView>
    </View>
  );
}

const ho = StyleSheet.create({
  screen: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 24,
  },
  roleBadge: {
    borderWidth: 2,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    transform: [{ rotate: '-4deg' }],
  },
  roleBadgeText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  name: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 44,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Screen: Question Show ────────────────────────────────────────────────────

function PNQuestionShow({
  questionerName,
  targetIdx,
  targetName,
  question,
  onNext,
}: {
  questionerName: string;
  targetIdx: number;
  targetName: string;
  question: string;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={qs.screen}>
      <DotBackground opacity={0.05} />
      <View style={qs.header}>
        <GameChip color={T.teal} textColor="#fff">
          {t('paranoia:ui.questionShow.chipQuestioner', { name: questionerName })}
        </GameChip>
      </View>
      <View style={qs.body}>
        <Text style={qs.label}>{t('paranoia:ui.questionShow.secretLabel')}</Text>
        <GameCard color={T.lemon} style={{ padding: 28 }}>
          <Text style={qs.questionText}>« {question} »</Text>
        </GameCard>

        <View style={{ marginTop: 24 }}>
          <Text style={qs.label}>{t('paranoia:ui.questionShow.askTo')}</Text>
          <GameCard style={{ padding: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <InitialAvatar index={targetIdx} size={44} radius={12} />
              <View>
                <Text style={qs.targetLabel}>{t('paranoia:ui.questionShow.targetLabel')}</Text>
                <Text style={qs.targetName}>{targetName}</Text>
              </View>
            </View>
          </GameCard>
        </View>

        <Text style={qs.hint}>{t('paranoia:ui.questionShow.hint')}</Text>
      </View>
      <View style={qs.footer}>
        <ChunkyButton full color={T.teal} onPress={onNext}>
          {t('paranoia:ui.questionShow.passToTarget', { name: targetName })}
        </ChunkyButton>
      </View>
    </SafeAreaView>
  );
}

const qs = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.paper },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 20, justifyContent: 'center' },
  label: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  questionText: {
    color: T.ink,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 34,
  },
  targetLabel: { color: T.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  targetName: { color: T.ink, fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  hint: { color: T.inkSoft, fontSize: 14, fontStyle: 'italic', marginTop: 18 },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Screen: Target Pick ──────────────────────────────────────────────────────

function PNTargetPick({
  targetName,
  question,
  players,
  excludeIdx,
  answer,
  setAnswer,
  onNext,
}: {
  targetName: string;
  question: string;
  players: Player[];
  excludeIdx: number;
  answer: number | null;
  setAnswer: (i: number) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={tp.screen}>
      <DotBackground color={T.ink} opacity={0.1} />
      <View style={tp.header}>
        <GameChip color={T.paper}>{t('paranoia:ui.targetPick.chipTarget', { name: targetName })}</GameChip>
      </View>
      <View style={tp.questionArea}>
        <Text style={tp.label}>{t('paranoia:ui.targetPick.questionLabel')}</Text>
        <GameCard style={{ padding: 18 }}>
          <Text style={tp.questionText}>« {question} »</Text>
        </GameCard>
      </View>
      <View style={tp.pickHeader}>
        <Text style={tp.pickTitle}>{t('paranoia:ui.targetPick.pickTitle')}</Text>
        <Text style={tp.pickSub}>{t('paranoia:ui.targetPick.pickSub')}</Text>
      </View>

      <ScrollView
        style={tp.grid}
        contentContainerStyle={tp.gridContent}
        showsVerticalScrollIndicator={false}
      >
        {players.map((p, i) => {
          if (i === excludeIdx) return null;
          const isSelected = answer === i;
          return (
            <TouchableOpacity
              key={p.id}
              style={[tp.playerBtn, isSelected && tp.playerBtnSelected]}
              onPress={() => setAnswer(i)}
              activeOpacity={0.85}
            >
              <InitialAvatar index={i} size={36} radius={10} />
              <Text style={tp.playerName}>{p.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={tp.footer}>
        <ChunkyButton full color={T.paper} onPress={onNext} disabled={answer == null}>
          {t('paranoia:ui.targetPick.coinFlip')}
        </ChunkyButton>
      </View>
    </SafeAreaView>
  );
}

const tp = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.violet },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  questionArea: { paddingHorizontal: 20, paddingTop: 14 },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  questionText: {
    color: T.ink,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  pickHeader: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  pickTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  pickSub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 3 },
  grid: { flex: 1 },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  playerBtn: {
    width: '47%',
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  playerBtnSelected: {
    backgroundColor: T.lemon,
    shadowOffset: { width: 0, height: 0 },
    transform: [{ translateX: 4 }, { translateY: 4 }],
  },
  playerName: { color: T.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3, flex: 1 },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Screen: Coin Flip ────────────────────────────────────────────────────────

function PNCoinFlip({
  targetName,
  chosenSide,
  setChosenSide,
  coin,
  setCoin,
  onNext,
}: {
  targetName: string;
  chosenSide: 'pile' | 'face' | null;
  setChosenSide: (s: 'pile' | 'face') => void;
  coin: 'pile' | 'face' | null;
  setCoin: (r: 'pile' | 'face') => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  const [flipping, setFlipping] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;

  const flip = () => {
    // Determine result before animating so visual matches outcome
    const result: 'pile' | 'face' = Math.random() < 0.5 ? 'pile' : 'face';
    setFlipping(true);
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: 1800, // 5 full turns — always lands at 0° (front face, no mirroring)
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setCoin(result);
      setFlipping(false);
    });
  };

  const rotateY = spinAnim.interpolate({
    inputRange: [0, 1800],
    outputRange: ['0deg', '1800deg'],
  });

  const titleText =
    coin != null
      ? chosenSide === coin
        ? t('paranoia:ui.coinFlip.titleSecretKept')
        : t('paranoia:ui.coinFlip.titleRevealed')
      : chosenSide
        ? t('paranoia:ui.coinFlip.titleFlip')
        : t('paranoia:ui.coinFlip.titleChoose');

  const coinBg = coin === 'face' ? T.teal : T.lemon;
  const coinTextColor = coin === 'face' ? '#fff' : T.ink;
  // Hide text during spin — a circle mid-air shows nothing readable
  const coinLabel =
    flipping
      ? ''
      : (coin === 'face'
        ? t('paranoia:ui.coinFlip.sideFace')
        : t('paranoia:ui.coinFlip.sidePile')
      ).toUpperCase();

  return (
    <SafeAreaView style={cf.screen}>
      <DotBackground opacity={0.06} />
      <View style={cf.header}>
        <GameChip color={T.violet} textColor="#fff">
          {t('paranoia:ui.coinFlip.chipTarget', { name: targetName })}
        </GameChip>
      </View>

      <View style={cf.center}>
        <Text style={cf.title}>{titleText}</Text>

        <Animated.View style={[cf.coin, { backgroundColor: coinBg, transform: [{ rotateY }] }]}>
          <Text style={[cf.coinText, { color: coinTextColor }]}>{coinLabel}</Text>
        </Animated.View>

        {coin == null && (
          <View style={cf.sideRow}>
            {(['pile', 'face'] as const).map((side) => {
              const isSelected = chosenSide === side;
              const bg = isSelected ? (side === 'pile' ? T.lemon : T.teal) : T.paper;
              const txtColor = isSelected && side === 'face' ? '#fff' : T.ink;
              return (
                <TouchableOpacity
                  key={side}
                  style={[cf.sideBtn, { backgroundColor: bg }, isSelected && cf.sideBtnSelected]}
                  onPress={() => !flipping && setChosenSide(side)}
                  activeOpacity={0.85}
                >
                  <Text style={[cf.sideBtnText, { color: txtColor }]}>
                    {side === 'pile'
                      ? t('paranoia:ui.coinFlip.sidePile')
                      : t('paranoia:ui.coinFlip.sideFace')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <View style={cf.footer}>
        {coin == null ? (
          <ChunkyButton full color={T.ink} onPress={flip} disabled={!chosenSide || flipping}>
            {flipping ? t('paranoia:ui.coinFlip.flipping') : t('paranoia:ui.coinFlip.flipCta')}
          </ChunkyButton>
        ) : (
          <ChunkyButton full color={T.ink} onPress={onNext}>
            {t('paranoia:ui.coinFlip.seeVerdict')}
          </ChunkyButton>
        )}
      </View>
    </SafeAreaView>
  );
}

const cf = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 24,
  },
  title: {
    color: T.ink,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    textAlign: 'center',
    lineHeight: 32,
  },
  coin: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  coinText: { fontSize: 48, fontWeight: '900', letterSpacing: -2 },
  sideRow: { flexDirection: 'row', gap: 12 },
  sideBtn: {
    width: 110,
    height: 56,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  sideBtnSelected: {
    shadowOffset: { width: 0, height: 0 },
    transform: [{ translateX: 4 }, { translateY: 4 }],
  },
  sideBtnText: { fontSize: 18, fontWeight: '900', letterSpacing: -0.4 },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Screen: Reveal ───────────────────────────────────────────────────────────

function PNReveal({
  won,
  questionerName,
  targetName,
  question,
  pickedPlayerIdx,
  pickedPlayerName,
  onNext,
}: {
  won: boolean;
  questionerName: string;
  targetName: string;
  question: string;
  pickedPlayerIdx: number;
  pickedPlayerName: string;
  onNext: () => void;
}) {
  const { enabled: drinksEnabled } = useDrinksMode();
  const { t } = useTranslation();
  // Drink rule: revealed → the picked player drinks 2 sips. Kept secret → the target drinks 1.
  const drinker = won ? targetName : pickedPlayerName;
  const sips = won ? 1 : 2;
  const drinkPlural = sips > 1 ? 's' : '';
  return (
    <SafeAreaView style={[rev.screen, { backgroundColor: won ? T.mint : T.teal }]}>
      <DotBackground color={T.ink} opacity={0.1} />

      <View style={rev.top}>
        <StickerBadge color={T.paper} rotation={-6}>
          {won ? t('paranoia:ui.reveal.badgeKept') : t('paranoia:ui.reveal.badgeRevealed')}
        </StickerBadge>
        <Text style={[rev.verdict, { color: won ? T.ink : '#fff' }]}>
          {won ? t('paranoia:ui.reveal.verdictKept') : t('paranoia:ui.reveal.verdictRevealed')}
        </Text>
      </View>

      <View style={rev.cardArea}>
        {!won ? (
          <GameCard>
            <Text style={rev.cardLabel}>{t('paranoia:ui.reveal.questionWas')}</Text>
            <Text style={rev.revealQuestion}>« {question} »</Text>
            <View style={rev.answerRow}>
              <Text style={rev.answerLabel}>{t('paranoia:ui.reveal.answerLabel')}</Text>
              <InitialAvatar index={pickedPlayerIdx} size={32} radius={10} />
              <Text style={rev.answerName}>{pickedPlayerName}</Text>
            </View>
          </GameCard>
        ) : (
          <GameCard>
            <Text style={rev.wonText}>
              <Text style={{ fontWeight: '900' }}>{targetName}</Text>{' '}
              {t('paranoia:ui.reveal.keptTextBefore')}
              <Text style={{ fontWeight: '900' }}>{questionerName}</Text>
              {t('paranoia:ui.reveal.keptTextAfter')}
            </Text>
          </GameCard>
        )}
      </View>

      {drinksEnabled && (
        <View style={rev.drinkBanner}>
          <Text style={rev.drinkBannerEmoji}>🍻</Text>
          <Text style={rev.drinkBannerText}>
            {t('paranoia:ui.reveal.drink', {
              name: drinker,
              count: sips,
              plural: drinkPlural,
            })}
          </Text>
        </View>
      )}

      <View style={rev.footer}>
        <ChunkyButton full color={T.paper} onPress={onNext}>
          {t('paranoia:ui.reveal.next')}
        </ChunkyButton>
      </View>
    </SafeAreaView>
  );
}

const rev = StyleSheet.create({
  screen: { flex: 1 },
  top: { paddingTop: 40, paddingHorizontal: 20, alignItems: 'center', gap: 20 },
  verdict: { fontSize: 72, fontWeight: '900', letterSpacing: -3, lineHeight: 68 },
  cardArea: { flex: 1, paddingHorizontal: 20, paddingTop: 20, justifyContent: 'center' },
  cardLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  revealQuestion: {
    color: T.ink,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
    letterSpacing: -0.8,
    marginTop: 8,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: `${T.muted}55`,
  },
  answerLabel: { color: T.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  answerName: { color: T.ink, fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  wonText: { color: T.ink, fontSize: 16, lineHeight: 24 },
  drinkBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  drinkBannerEmoji: { fontSize: 22 },
  drinkBannerText: { flex: 1, color: T.ink, fontSize: 15, letterSpacing: -0.2 },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Screen: End ──────────────────────────────────────────────────────────────

function PNEnd({
  history,
  players,
  onExit,
  onRestart,
}: {
  history: ParanoiaHistoryEntry[];
  players: Player[];
  onExit: () => void;
  onRestart: () => void;
}) {
  const revealedCount = history.filter((h) => h.revealed).length;
  const keptCount = history.length - revealedCount;
  const { t } = useTranslation();

  return (
    <SafeAreaView style={end.screen}>
      <DotBackground opacity={0.06} />

      <View style={end.hero}>
        <StickerBadge color={T.teal} rotation={-4}>
          {t('paranoia:ui.end.badge')}
        </StickerBadge>
        <Text style={end.title}>{t('paranoia:ui.end.title')}</Text>
      </View>

      <View style={end.statsRow}>
        <GameCard color={T.mint} style={{ flex: 1, padding: 14 }}>
          <Text style={end.statLabel}>{t('paranoia:ui.end.kept')}</Text>
          <Text style={end.statValue}>{keptCount}</Text>
        </GameCard>
        <GameCard color={T.teal} style={{ flex: 1, padding: 14 }}>
          <Text style={end.statLabel}>{t('paranoia:ui.end.revealed')}</Text>
          <Text style={end.statValue}>{revealedCount}</Text>
        </GameCard>
      </View>

      <ScrollView contentContainerStyle={end.list} showsVerticalScrollIndicator={false}>
        {history.map((h, i) => (
          <View key={i} style={end.historyCard}>
            <View style={end.historyRow}>
              <View style={[end.badge, { backgroundColor: h.revealed ? T.teal : T.mint }]}>
                <Text style={end.badgeText}>
                  {h.revealed
                    ? t('paranoia:ui.end.statusRevealed')
                    : t('paranoia:ui.end.statusKept')}
                </Text>
              </View>
              <Text style={end.historyText} numberOfLines={1}>
                <Text style={{ fontWeight: '900', color: T.ink }}>{players[h.q]?.name}</Text>
                <Text style={{ color: T.inkSoft }}> → </Text>
                <Text style={{ fontWeight: '900', color: T.ink }}>{players[h.t]?.name}</Text>
                <Text style={{ color: T.inkSoft }}>{t('paranoia:ui.end.answerShort')}</Text>
                <Text style={{ fontWeight: '900', color: T.ink }}>{players[h.a]?.name}</Text>
              </Text>
            </View>
            {h.revealed && <Text style={end.revealedQ}>« {h.question} »</Text>}
          </View>
        ))}

        <View style={end.btnStack}>
          <ChunkyButton full color={T.teal} onPress={onRestart}>
            {t('paranoia:ui.end.playAgain')}
          </ChunkyButton>
          <ChunkyButton full color={T.paper} textColor={T.ink} onPress={onExit}>
            {t('paranoia:ui.end.backToHub')}
          </ChunkyButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const end = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  hero: { padding: 20, paddingBottom: 4, gap: 16, alignItems: 'flex-start' },
  title: {
    color: T.ink,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingBottom: 4 },
  statLabel: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, opacity: 0.85 },
  statValue: { color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  list: { padding: 20, paddingTop: 12, paddingBottom: 40, gap: 8 },
  historyCard: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 16,
    padding: 12,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  historyText: { flex: 1, fontSize: 13, color: T.inkSoft },
  revealedQ: {
    marginTop: 6,
    color: T.ink,
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  btnStack: { gap: 10, marginTop: 8 },
});

// ─── Main Component ───────────────────────────────────────────────────────────

export function ParanoiaScreen() {
  const route = useRoute<ParanoiaScreenRouteProp>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>(route.params.players as Player[]);

  const allQuestions = t('paranoia:questions', { returnObjects: true }) as ContentItem[];
  const questions = useGameContent(allQuestions);

  const [order] = useState<ParanoiaOrder[]>(() => buildOrder(players, questions));
  const [step, setStep] = useState<ParanoiaStep>('rules');
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [coin, setCoin] = useState<'pile' | 'face' | null>(null);
  const [chosenSide, setChosenSide] = useState<'pile' | 'face' | null>(null);
  const [history, setHistory] = useState<ParanoiaHistoryEntry[]>([]);

  const cur = order[round];
  const questioner = players[cur?.q ?? 0];
  const target = players[cur?.t ?? 0];

  const goToNext = () => {
    const won = chosenSide === coin;
    const entry: ParanoiaHistoryEntry = {
      q: cur.q,
      t: cur.t,
      a: answer!,
      question: cur.question,
      revealed: !won,
    };
    const nextHistory = [...history, entry];
    setHistory(nextHistory);
    setAnswer(null);
    setCoin(null);
    setChosenSide(null);

    if (round + 1 >= order.length) {
      setStep('end');
    } else {
      setRound((r) => r + 1);
      setStep('q-handoff');
    }
  };

  if (step === 'rules') {
    return (
      <PNRules
        players={players}
        onPlayersChange={setPlayers}
        onStart={() => setStep('q-handoff')}
        onExit={() => (navigation as any).goBack()}
        onSettings={() => (navigation as any).navigate('Settings')}
      />
    );
  }

  if (step === 'q-handoff') {
    return (
      <PNHandoff
        playerIdx={cur.q}
        playerName={questioner.name}
        role={t('paranoia:ui.roles.questioner')}
        subtitle={t('paranoia:ui.handoff.subtitleQuestioner')}
        accentColor={T.teal}
        onReady={() => setStep('q-show')}
      />
    );
  }

  if (step === 'q-show') {
    return (
      <PNQuestionShow
        questionerName={questioner.name}
        targetIdx={cur.t}
        targetName={target.name}
        question={cur.question}
        onNext={() => setStep('t-handoff')}
      />
    );
  }

  if (step === 't-handoff') {
    return (
      <PNHandoff
        playerIdx={cur.t}
        playerName={target.name}
        role={t('paranoia:ui.roles.target')}
        subtitle={t('paranoia:ui.handoff.subtitleTarget')}
        accentColor={T.violet}
        onReady={() => setStep('t-pick')}
      />
    );
  }

  if (step === 't-pick') {
    return (
      <PNTargetPick
        targetName={target.name}
        question={cur.question}
        players={players}
        excludeIdx={cur.t}
        answer={answer}
        setAnswer={setAnswer}
        onNext={() => setStep('coin')}
      />
    );
  }

  if (step === 'coin') {
    return (
      <PNCoinFlip
        targetName={target.name}
        chosenSide={chosenSide}
        setChosenSide={setChosenSide}
        coin={coin}
        setCoin={setCoin}
        onNext={() => setStep('reveal')}
      />
    );
  }

  if (step === 'reveal') {
    const won = chosenSide === coin;
    return (
      <PNReveal
        won={won}
        questionerName={questioner.name}
        targetName={target.name}
        question={cur.question}
        pickedPlayerIdx={answer ?? 0}
        pickedPlayerName={players[answer ?? 0]?.name ?? ''}
        onNext={goToNext}
      />
    );
  }

  if (step === 'end') {
    return (
      <PNEnd
        history={history}
        players={players}
        onExit={() => (navigation as any).navigate('Home')}
        onRestart={() => {
          setStep('rules');
          setRound(0);
          setAnswer(null);
          setCoin(null);
          setChosenSide(null);
          setHistory([]);
        }}
      />
    );
  }

  return null;
}
