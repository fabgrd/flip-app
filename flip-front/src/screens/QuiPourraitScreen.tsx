// Qui pourrait ? — vote de groupe, doigts pointés
// Fidèle à la maquette screens-quipourrait.jsx (Fl!p - Maquettes)
// Flow: rules → prompt → handoff → vote (secret) → tally → result → … → podium
import { Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ChunkyButton,
  DotBackground,
  DrinkModeToggle,
  GameCard,
  GameChip,
  GameHeader,
  GameRulesScreen,
  GameSetupCard,
  GameSetupSection,
  InitialAvatar,
  QuiPourraitIcon,
  RoundsStepper,
  StickerBadge,
  ThemeGrid,
  ToggleSwitch,
} from '../components';
import { T } from '../constants/flipTokens';
import { useGameContent } from '../content';
import {
  QUI_POURRAIT_DEFAULT_THEMES,
  QUI_POURRAIT_THEME_OPTIONS,
  QuiPourraitPrompt,
  QuiPourraitTheme,
  useQuiPourrait,
  useQuiPourraitThemeAccess,
} from '../games/qui-pourrait';
import { useDrinksMode } from '../hooks';
import { Player, RootStackParamList } from '../types';

type QuiPourraitScreenRouteProp = RouteProp<RootStackParamList, 'QuiPourrait'>;

type RulesStep = { n: string; title: string; desc: string };

function useRulesSteps(): RulesStep[] {
  const { t } = useTranslation();
  return t('quiPourrait:ui.rules.steps', { returnObjects: true }) as RulesStep[];
}

// ─── Screen: Rules ────────────────────────────────────────────────────────────

function QPRules({
  players,
  onPlayersChange,
  onStart,
  onExit,
  onSettings,
  totalRounds,
  onTotalRoundsChange,
  selectedThemes,
  onToggleTheme,
  multiVote,
  onToggleMultiVote,
}: {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onStart: () => void;
  onExit: () => void;
  onSettings: () => void;
  totalRounds: number;
  onTotalRoundsChange: (n: number) => void;
  selectedThemes: QuiPourraitTheme[];
  onToggleTheme: (theme: QuiPourraitTheme) => void;
  multiVote: boolean;
  onToggleMultiVote: () => void;
}) {
  const { t } = useTranslation();
  const rulesSteps = useRulesSteps();
  const { isThemeAllowed, requestUnlockFor } = useQuiPourraitThemeAccess();
  // Thèmes débloqués d'abord, bloqués (premium) à la fin — tri stable
  const sortedThemeOptions = [...QUI_POURRAIT_THEME_OPTIONS].sort(
    (a, b) => Number(isThemeAllowed(b.value)) - Number(isThemeAllowed(a.value)),
  );

  return (
    <GameRulesScreen
      accentColor={T.quiPourraitAccent}
      title={t('quiPourrait:ui.rules.title')}
      tagline={t('quiPourrait:ui.rules.tagline')}
      icon={<QuiPourraitIcon size={96} />}
      iconRotation={-10}
      rulesModal={{ rules: rulesSteps, title: t('quiPourrait:ui.rules.title') }}
      players={players}
      onPlayersChange={onPlayersChange}
      onExit={onExit}
      onSettings={onSettings}
      minPlayers={3}
      onStart={onStart}
      startLabel={t('quiPourrait:ui.rules.start')}
      scrollable
    >
      {/* Carte "COMMENT ON JOUE" */}
      <View style={rl.cardWrap}>
        <GameCard color={T.paper} style={rl.card}>
          <Text style={rl.cardLabel}>{t('quiPourrait:ui.rules.howToPlay')}</Text>
          {rulesSteps.map((s) => (
            <View key={s.n} style={rl.stepRow}>
              <View style={rl.stepNum}>
                <Text style={rl.stepNumText}>{s.n}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={rl.stepTitle}>{s.title}</Text>
                <Text style={rl.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
          <Text style={rl.warning}>{t('quiPourrait:ui.rules.warning')}</Text>
        </GameCard>
      </View>

      <View style={rl.setupWrap}>
        <GameSetupCard
          accentColor={T.quiPourraitAccent}
          title={t('common:labels.setup').toUpperCase()}
        >
          <RoundsStepper
            value={totalRounds}
            onChange={onTotalRoundsChange}
            min={1}
            max={15}
            accentColor={T.quiPourraitAccent}
            inline
          />
          <View style={rl.toggleRow}>
            <View style={rl.toggleIcon}>
              <Feather name="users" size={16} color={T.ink} />
            </View>
            <Text style={rl.toggleLabel}>{t('quiPourrait:ui.rules.multiVote')}</Text>
            <ToggleSwitch
              on={multiVote}
              onToggle={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onToggleMultiVote();
              }}
              activeColor={T.quiPourraitAccent}
            />
          </View>
          <GameSetupSection label={t('quiPourrait:ui.rules.themeLabel')}>
            <ThemeGrid
              options={sortedThemeOptions.map((opt) => ({
                value: opt.value,
                label: t(`quiPourrait:themes.${opt.value}`),
                emoji: opt.emoji,
                color: opt.color,
              }))}
              isActive={(v) => selectedThemes.includes(v as QuiPourraitTheme)}
              isAllowed={(v) => isThemeAllowed(v as QuiPourraitTheme)}
              onSelect={(v) => onToggleTheme(v as QuiPourraitTheme)}
              onLockedPress={(v) => requestUnlockFor(v as QuiPourraitTheme)}
            />
          </GameSetupSection>
          <DrinkModeToggle accentColor={T.quiPourraitAccent} inline />
        </GameSetupCard>
      </View>
    </GameRulesScreen>
  );
}

const rl = StyleSheet.create({
  cardWrap: { paddingHorizontal: 20, paddingTop: 8 },
  card: { borderRadius: 26, padding: 20 },
  cardLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: T.muted,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: T.quiPourraitAccent,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  stepTitle: { color: T.ink, fontSize: 17, fontWeight: '700' },
  stepDesc: { color: T.inkSoft, fontSize: 14, marginTop: 2 },
  warning: { marginTop: 12, color: T.muted, fontSize: 10.5, lineHeight: 15 },
  setupWrap: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: T.ink,
    backgroundColor: T.quiPourraitAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: { flex: 1, color: T.ink, fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
});

// ─── Screen: Prompt (annonce de la question) ──────────────────────────────────

function QPPrompt({
  prompt,
  round,
  total,
  onStart,
  onExit,
  onSettings,
  players,
  setPlayers,
}: {
  prompt: string;
  round: number;
  total: number;
  onStart: () => void;
  onExit: () => void;
  onSettings: () => void;
  players: Player[];
  setPlayers: (p: Player[]) => void;
}) {
  const { t } = useTranslation();
  const rulesSteps = useRulesSteps();
  return (
    <SafeAreaView style={pr.screen}>
      <DotBackground color={T.ink} opacity={0.08} gap={16} />
      <GameHeader
        tint={T.paper}
        onExit={onExit}
        onSettings={onSettings}
        rules={{
          title: t('quiPourrait:ui.rules.title'),
          rules: rulesSteps,
          accentColor: T.quiPourraitAccent,
        }}
        players={players}
        onPlayersChange={setPlayers}
      />
      <View style={pr.chipRow}>
        <GameChip color={T.paper}>
          {t('quiPourrait:ui.prompt.chip', { round: round + 1, total })}
        </GameChip>
      </View>

      <View style={pr.center}>
        <StickerBadge color={T.lemon} rotation={-4}>
          {t('quiPourrait:ui.prompt.sticker')}
        </StickerBadge>
        <GameCard color={T.paper} style={pr.promptCard}>
          <Text style={pr.promptText}>{prompt} ?</Text>
        </GameCard>
      </View>

      <View style={pr.footer}>
        <ChunkyButton
          full
          color={T.ink}
          textColor="#fff"
          size="lg"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onStart();
          }}
        >
          {t('quiPourrait:ui.prompt.startVote')}
        </ChunkyButton>
      </View>
    </SafeAreaView>
  );
}

const pr = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.quiPourraitAccent },
  chipRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 22,
  },
  promptCard: {
    borderRadius: 30,
    paddingVertical: 34,
    paddingHorizontal: 26,
    alignSelf: 'stretch',
    transform: [{ rotate: '-1deg' }],
  },
  promptText: {
    color: T.ink,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1.2,
    lineHeight: 36,
    textAlign: 'center',
  },
  footer: { paddingHorizontal: 20, paddingBottom: 40 },
});

// ─── Screen: Handoff (passage du tel) ─────────────────────────────────────────

function QPHandoff({
  player,
  idx,
  total,
  onReady,
}: {
  player: Player;
  idx: number;
  total: number;
  onReady: () => void;
}) {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: T.ink }}>
      <SafeAreaView style={ho.screen}>
        <View style={ho.center}>
          <Text style={ho.voterLabel}>
            {t('quiPourrait:ui.handoff.voterLabel', { idx: idx + 1, total })}
          </Text>
          <InitialAvatar
            index={idx}
            label={player.name[0]?.toUpperCase()}
            size={120}
            radius={32}
            borderColor={T.ink}
            shadowColor={T.quiPourraitAccent}
          />
          <Text style={ho.title}>{t('quiPourrait:ui.handoff.title', { name: player.name })}</Text>
          <Text style={ho.subtitle}>{t('quiPourrait:ui.handoff.subtitle')}</Text>
        </View>
        <View style={ho.footer}>
          <ChunkyButton full color={T.lemon} size="lg" onPress={onReady}>
            {t('quiPourrait:ui.handoff.cta')}
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
  voterLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, letterSpacing: 2 },
  title: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1.4,
    lineHeight: 42,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  footer: { padding: 20, paddingBottom: 40 },
});

// ─── Screen: Vote secret ──────────────────────────────────────────────────────

function QPVote({
  players,
  setPlayers,
  voterIdx,
  prompt,
  multiVote,
  onVote,
  onExit,
  onSettings,
}: {
  players: Player[];
  setPlayers: (p: Player[]) => void;
  voterIdx: number;
  prompt: string;
  multiVote: boolean;
  onVote: (targetIdxs: number[]) => void;
  onExit: () => void;
  onSettings: () => void;
}) {
  const { t } = useTranslation();
  const rulesSteps = useRulesSteps();
  const [picked, setPicked] = useState<number[]>([]);

  const togglePick = (i: number) => {
    Haptics.selectionAsync();
    setPicked((prev) => {
      if (multiVote) {
        return prev.includes(i) ? prev.filter((v) => v !== i) : [...prev, i];
      }
      return [i];
    });
  };

  return (
    <SafeAreaView style={vt.screen}>
      <DotBackground opacity={0.06} gap={14} />
      <GameHeader
        tint={T.paper}
        onExit={onExit}
        onSettings={onSettings}
        rules={{
          title: t('quiPourrait:ui.rules.title'),
          rules: rulesSteps,
          accentColor: T.quiPourraitAccent,
        }}
        players={players}
        onPlayersChange={setPlayers}
      />
      <View style={vt.chipRow}>
        <GameChip color={T.quiPourraitAccent} textColor="#fff">
          {t('quiPourrait:ui.vote.chip', { name: players[voterIdx]?.name })}
        </GameChip>
      </View>

      <View style={vt.promptArea}>
        <Text style={vt.label}>{t('quiPourrait:ui.vote.label')}</Text>
        <Text style={vt.promptText}>{prompt} ?</Text>
      </View>

      <ScrollView contentContainerStyle={vt.grid} showsVerticalScrollIndicator={false}>
        {players.map((p, i) => {
          const self = i === voterIdx;
          const sel = picked.includes(i);
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => togglePick(i)}
              activeOpacity={0.85}
              style={[vt.playerBtn, sel && vt.playerBtnSelected]}
            >
              <InitialAvatar index={i} size={46} radius={13} />
              <Text style={[vt.playerName, sel && { color: '#fff' }]}>
                {self ? t('quiPourrait:ui.vote.self', { name: p.name }) : p.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={vt.footer}>
        <ChunkyButton
          full
          color={T.ink}
          textColor="#fff"
          size="lg"
          disabled={picked.length === 0}
          onPress={() => {
            if (picked.length === 0) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onVote(picked);
          }}
        >
          {t('quiPourrait:ui.vote.submit')}
        </ChunkyButton>
      </View>
    </SafeAreaView>
  );
}

const vt = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  chipRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  promptArea: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 },
  label: { color: T.quiPourraitAccentDark, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 },
  promptText: {
    color: T.ink,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 30,
  },
  grid: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  playerBtn: {
    width: '47%',
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 8,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  playerBtnSelected: {
    backgroundColor: T.quiPourraitAccent,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
    transform: [{ translateX: 4 }, { translateY: 4 }],
  },
  playerName: { color: T.ink, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  footer: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 },
});

// ─── Screen: Tally (suspense) ─────────────────────────────────────────────────

function QPTally({ prompt, onReveal }: { prompt: string; onReveal: () => void }) {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: T.ink }}>
      <SafeAreaView style={ty.screen}>
        <DotBackground color="#fff" opacity={0.05} gap={16} />
        <View style={ty.center}>
          <Text style={ty.drum}>🥁</Text>
          <Text style={ty.label}>{t('quiPourrait:ui.tally.label')}</Text>
          <Text style={ty.promptText}>{prompt} ?</Text>
          <Text style={ty.subtitle}>{t('quiPourrait:ui.tally.subtitle')}</Text>
        </View>
        <View style={ty.footer}>
          <ChunkyButton
            full
            color={T.lemon}
            size="lg"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              onReveal();
            }}
          >
            {t('quiPourrait:ui.tally.reveal')}
          </ChunkyButton>
        </View>
      </SafeAreaView>
    </View>
  );
}

const ty = StyleSheet.create({
  screen: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 12,
  },
  drum: { fontSize: 64, marginBottom: 6 },
  label: { color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 2 },
  promptText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 32,
    textAlign: 'center',
    maxWidth: 300,
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
  },
  footer: { padding: 20, paddingBottom: 40 },
});

// ─── Screen: Résultat du round ────────────────────────────────────────────────

function QPResult({
  players,
  setPlayers,
  counts,
  winners,
  prompt,
  lastRound,
  onNext,
  onExit,
  onSettings,
}: {
  players: Player[];
  setPlayers: (p: Player[]) => void;
  counts: number[];
  winners: number[];
  prompt: string;
  lastRound: boolean;
  onNext: () => void;
  onExit: () => void;
  onSettings: () => void;
}) {
  const { t } = useTranslation();
  const rulesSteps = useRulesSteps();
  const { enabled: drinksEnabled } = useDrinksMode();
  const max = Math.max(...counts, 0);
  const tie = winners.length > 1;
  const noVote = winners.length === 0;
  const sorted = players.map((p, i) => ({ p, c: counts[i] ?? 0, i })).sort((a, b) => b.c - a.c);

  const detailLine = noVote
    ? null
    : drinksEnabled
      ? t('quiPourrait:ui.result.drink', {
          count: max,
          plural: max > 1 ? 's' : '',
          each: tie ? t('quiPourrait:ui.result.drinkEach') : '',
          prompt,
        })
      : t('quiPourrait:ui.result.noDrink', {
          count: max,
          plural: max > 1 ? 's' : '',
          prompt,
        });

  return (
    <SafeAreaView style={rs.screen}>
      <DotBackground color={T.ink} opacity={0.08} gap={16} />
      <GameHeader
        tint={T.paper}
        onExit={onExit}
        onSettings={onSettings}
        rules={{
          title: t('quiPourrait:ui.rules.title'),
          rules: rulesSteps,
          accentColor: T.quiPourraitAccent,
        }}
        players={players}
        onPlayersChange={setPlayers}
      />

      <ScrollView contentContainerStyle={rs.content} showsVerticalScrollIndicator={false}>
        <View style={rs.hero}>
          <StickerBadge color={T.lemon} rotation={-4}>
            {tie ? t('quiPourrait:ui.result.stickerTie') : t('quiPourrait:ui.result.sticker')}
          </StickerBadge>

          {noVote ? (
            <Text style={rs.noVoteTitle}>{t('quiPourrait:ui.result.noVoteTitle')}</Text>
          ) : (
            <View style={rs.winnersRow}>
              {winners.map((wi) => (
                <View key={wi} style={rs.winner}>
                  <View>
                    <Text style={rs.crown}>👑</Text>
                    <View style={rs.winnerRing}>
                      <InitialAvatar
                        index={wi}
                        label={players[wi]?.name[0]?.toUpperCase()}
                        size={96}
                        radius={26}
                      />
                    </View>
                  </View>
                  <Text style={rs.winnerName}>{players[wi]?.name}</Text>
                </View>
              ))}
            </View>
          )}

          {detailLine != null && <Text style={rs.drinkLine}>{detailLine}</Text>}
        </View>

        <View style={rs.detailWrap}>
          <GameCard color={T.paper} style={rs.detailCard}>
            <Text style={rs.detailLabel}>{t('quiPourrait:ui.result.detailLabel')}</Text>
            <View style={{ gap: 10 }}>
              {sorted.map(({ p, c, i }) => (
                <View key={p.id} style={rs.barRow}>
                  <InitialAvatar index={i} size={30} radius={9} />
                  <Text style={rs.barName} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <View style={rs.barTrack}>
                    <View
                      style={[
                        rs.barFill,
                        {
                          width: `${max ? (c / max) * 100 : 0}%` as `${number}%`,
                          backgroundColor: c === max && c > 0 ? T.quiPourraitAccent : T.muted,
                        },
                      ]}
                    />
                  </View>
                  <Text style={rs.barCount}>{c}</Text>
                </View>
              ))}
            </View>
          </GameCard>
        </View>

        <View style={rs.footer}>
          <ChunkyButton full color={T.ink} textColor="#fff" size="lg" onPress={onNext}>
            {lastRound ? t('quiPourrait:ui.result.podium') : t('quiPourrait:ui.result.next')}
          </ChunkyButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const rs = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.quiPourraitAccent },
  content: { paddingBottom: 40 },
  hero: { paddingHorizontal: 20, paddingTop: 14, alignItems: 'center' },
  noVoteTitle: {
    marginTop: 22,
    color: '#fff',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 42,
    textAlign: 'center',
  },
  winnersRow: {
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  winner: { alignItems: 'center', gap: 10 },
  crown: {
    position: 'absolute',
    top: -24,
    alignSelf: 'center',
    fontSize: 30,
    zIndex: 2,
  },
  winnerRing: {
    padding: 4,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  winnerName: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.8 },
  drinkLine: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  detailWrap: { paddingHorizontal: 20, paddingTop: 24 },
  detailCard: { borderRadius: 24, padding: 16 },
  detailLabel: { color: T.muted, fontSize: 11, letterSpacing: 1, marginBottom: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barName: { width: 60, color: T.ink, fontSize: 14, fontWeight: '700' },
  barTrack: {
    flex: 1,
    height: 16,
    backgroundColor: T.bgAlt,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: T.ink,
    overflow: 'hidden',
  },
  barFill: { height: '100%' },
  barCount: {
    width: 18,
    textAlign: 'right',
    color: T.ink,
    fontSize: 13,
    fontWeight: '700',
  },
  footer: { paddingHorizontal: 20, paddingTop: 22 },
});

// ─── Screen: Podium final ─────────────────────────────────────────────────────

const MEDALS = ['🥇', '🥈', '🥉'];

function QPPodium({
  players,
  setPlayers,
  scores,
  onReplay,
  onExit,
  onSettings,
}: {
  players: Player[];
  setPlayers: (p: Player[]) => void;
  scores: number[];
  onReplay: () => void;
  onExit: () => void;
  onSettings: () => void;
}) {
  const { t } = useTranslation();
  const rulesSteps = useRulesSteps();
  const ranked = players.map((p, i) => ({ p, i, s: scores[i] ?? 0 })).sort((a, b) => b.s - a.s);
  const top = ranked[0];
  const podium = ranked.slice(0, 3);
  const hasWinner = (top?.s ?? 0) > 0;

  return (
    <SafeAreaView style={po.screen}>
      <DotBackground color={T.ink} opacity={0.08} gap={16} />
      <GameHeader
        tint={T.paper}
        onExit={onExit}
        onSettings={onSettings}
        rules={{
          title: t('quiPourrait:ui.rules.title'),
          rules: rulesSteps,
          accentColor: T.quiPourraitAccent,
        }}
        players={players}
        onPlayersChange={setPlayers}
      />

      <ScrollView contentContainerStyle={po.content} showsVerticalScrollIndicator={false}>
        <View style={po.hero}>
          <StickerBadge color={T.tomato} rotation={-5} textColor="#fff">
            {t('quiPourrait:ui.podium.badge')}
          </StickerBadge>
          <Text style={po.title}>
            {hasWinner
              ? t('quiPourrait:ui.podium.title', { name: top.p.name })
              : t('quiPourrait:ui.podium.titleNone')}
          </Text>
          <Text style={po.subtitle}>
            {hasWinner
              ? t('quiPourrait:ui.podium.subtitle', {
                  count: top.s,
                  plural: top.s > 1 ? 's' : '',
                })
              : t('quiPourrait:ui.podium.subtitleNone')}
          </Text>
        </View>

        <View style={po.cards}>
          {podium.map(({ p, i, s }, idx) => (
            <GameCard key={p.id} color={T.paper} style={po.card}>
              <View style={po.cardRow}>
                <Text style={po.medal}>{MEDALS[idx]}</Text>
                <InitialAvatar index={i} size={48} radius={14} />
                <Text style={po.playerName}>{p.name}</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={po.count}>{s}</Text>
                  <Text style={po.countLabel}>{t('quiPourrait:ui.podium.scoreLabel')}</Text>
                </View>
              </View>
            </GameCard>
          ))}
        </View>

        <View style={po.btnStack}>
          <ChunkyButton full color={T.ink} textColor="#fff" size="lg" onPress={onReplay}>
            {t('quiPourrait:ui.podium.playAgain')}
          </ChunkyButton>
          <ChunkyButton full color={T.paper} size="md" onPress={onExit}>
            {t('quiPourrait:ui.podium.backToHub')}
          </ChunkyButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const po = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.lemon },
  content: { paddingBottom: 40 },
  hero: { paddingHorizontal: 20, paddingTop: 14, alignItems: 'center' },
  title: {
    marginTop: 22,
    color: T.ink,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 46,
    textAlign: 'center',
  },
  subtitle: { marginTop: 12, color: T.inkSoft, fontSize: 15, textAlign: 'center' },
  cards: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  card: { borderRadius: 22, padding: 14 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  medal: { fontSize: 30, width: 36, textAlign: 'center' },
  playerName: {
    flex: 1,
    color: T.ink,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  count: {
    color: T.quiPourraitAccentDark,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 28,
  },
  countLabel: { color: T.muted, fontSize: 9.5, letterSpacing: 0.5 },
  btnStack: { paddingHorizontal: 20, paddingTop: 26, gap: 10 },
});

// ─── Main Component ───────────────────────────────────────────────────────────

export function QuiPourraitScreen() {
  const route = useRoute<QuiPourraitScreenRouteProp>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const allPrompts = t('quiPourrait:prompts', { returnObjects: true }) as QuiPourraitPrompt[];
  const prompts = useGameContent(allPrompts);
  const { filterAllowed } = useQuiPourraitThemeAccess();

  const [selectedThemes, setSelectedThemes] = useState<QuiPourraitTheme[]>([
    ...QUI_POURRAIT_DEFAULT_THEMES,
  ]);
  const [multiVote, setMultiVote] = useState(false);

  const {
    players,
    setPlayers,
    step,
    setStep,
    round,
    totalRounds,
    setTotalRounds,
    voter,
    counts,
    winners,
    scores,
    currentPrompt,
    isLastRound,
    startGame,
    beginVoting,
    castVote,
    reveal,
    nextRound,
    restart,
  } = useQuiPourrait(route.params.players as Player[]);

  const goBack = () => (navigation as any).goBack();
  const goHome = () => (navigation as any).navigate('Home');
  const goSettings = () => (navigation as any).navigate('Settings');

  const toggleTheme = (theme: QuiPourraitTheme) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((v) => v !== theme) : [...prev, theme],
    );
  };

  const handleStart = () => {
    const safeThemes = filterAllowed(selectedThemes);
    const activeThemes = safeThemes.length > 0 ? safeThemes : (['daily'] as QuiPourraitTheme[]);
    const pool = prompts.filter((p) => activeThemes.includes(p.theme)).map((p) => p.text);
    const fallback = prompts.filter((p) => p.theme === 'daily').map((p) => p.text);
    startGame(pool.length > 0 ? pool : fallback);
  };

  if (step === 'rules') {
    return (
      <QPRules
        players={players}
        onPlayersChange={setPlayers}
        onStart={handleStart}
        onExit={goBack}
        onSettings={goSettings}
        totalRounds={totalRounds}
        onTotalRoundsChange={setTotalRounds}
        selectedThemes={selectedThemes}
        onToggleTheme={toggleTheme}
        multiVote={multiVote}
        onToggleMultiVote={() => setMultiVote((m) => !m)}
      />
    );
  }

  if (step === 'prompt') {
    return (
      <QPPrompt
        prompt={currentPrompt}
        round={round}
        total={totalRounds}
        onStart={beginVoting}
        onExit={goBack}
        onSettings={goSettings}
        players={players}
        setPlayers={setPlayers}
      />
    );
  }

  if (step === 'handoff') {
    return (
      <QPHandoff
        player={players[voter]}
        idx={voter}
        total={players.length}
        onReady={() => setStep('vote')}
      />
    );
  }

  if (step === 'vote') {
    return (
      <QPVote
        key={voter}
        players={players}
        setPlayers={setPlayers}
        voterIdx={voter}
        prompt={currentPrompt}
        multiVote={multiVote}
        onVote={castVote}
        onExit={goBack}
        onSettings={goSettings}
      />
    );
  }

  if (step === 'tally') {
    return <QPTally prompt={currentPrompt} onReveal={reveal} />;
  }

  if (step === 'result') {
    return (
      <QPResult
        players={players}
        setPlayers={setPlayers}
        counts={counts}
        winners={winners}
        prompt={currentPrompt}
        lastRound={isLastRound}
        onNext={nextRound}
        onExit={goBack}
        onSettings={goSettings}
      />
    );
  }

  if (step === 'end') {
    return (
      <QPPodium
        players={players}
        setPlayers={setPlayers}
        scores={scores}
        onReplay={restart}
        onExit={goHome}
        onSettings={goSettings}
      />
    );
  }

  return null;
}
