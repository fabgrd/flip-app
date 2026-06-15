// Le Casting — jeu d'acting avec chiffres secrets
// Flow: rules → pick-devin → scenario → handoff+reveal (each actor) → perform → guess → results
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CastingIcon,
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
  PlayerPickerGrid,
  RoundsStepper,
  StickerBadge,
  ThemeGrid,
} from '../components';
import { getPlayerBgColor, getPlayerTextColor } from '../constants';
import { T } from '../constants/flipTokens';
import type { CastingTheme } from '../games/casting';
import {
  CASTING_LABELS,
  CASTING_ORANGE,
  CASTING_THEME_OPTIONS,
  getScenariosForThemes,
  getScenariosForThemesI18n,
  useCasting,
  useCastingThemeAccess,
} from '../games/casting';
import { CastingResult, CastingStep } from '../games/casting/types';
import { useDrinksMode } from '../hooks';
import { Player, RootStackParamList } from '../types';
import { drinkColumnLabel, drinkSoberLabel, drinkUnit, drinkUnitLower } from '../utils/drinks';

type CastingScreenRouteProp = RouteProp<RootStackParamList, 'Casting'>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function playerBg(idx: number): string {
  return getPlayerBgColor(idx);
}

function avatarTextColor(idx: number): string {
  return getPlayerTextColor(idx);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Rules ────────────────────────────────────────────────────────────────────

function CARules({
  players,
  onPlayersChange,
  onStart,
  onExit,
  onSettings,
  selectedThemes,
  onToggleTheme,
  totalRounds,
  onTotalRoundsChange,
}: {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onStart: () => void;
  onExit: () => void;
  onSettings: () => void;
  selectedThemes: CastingTheme[];
  onToggleTheme: (theme: CastingTheme) => void;
  totalRounds: number;
  onTotalRoundsChange: (n: number) => void;
}) {
  const { t } = useTranslation();
  const { enabled: drinksEnabled } = useDrinksMode();
  const { isThemeAllowed, requestUnlockFor } = useCastingThemeAccess();
  const rawSteps = t('casting:rules.steps', { returnObjects: true }) as { n: string; title: string; desc?: string; descDrink?: string; descSober?: string }[];
  const STEPS = rawSteps.map((s) => ({
    n: s.n,
    title: s.title,
    desc: drinksEnabled ? (s.descDrink ?? s.desc ?? '') : (s.descSober ?? s.desc ?? ''),
  }));

  return (
    <GameRulesScreen
      accentColor={CASTING_ORANGE}
      title={t('casting:rules.title')}
      tagline={t('casting:rules.tagline')}
      icon={<CastingIcon size={88} />}
      iconRotation={8}
      rulesModal={{ rules: STEPS, title: t('casting:rules.modalTitle') }}
      players={players}
      onPlayersChange={onPlayersChange}
      onExit={onExit}
      onSettings={onSettings}
      minPlayers={3}
      onStart={onStart}
      startLabel={t('casting:rules.start')}
      scrollable
    >
      <View style={rls.scroll}>
        <GameSetupCard accentColor={CASTING_ORANGE} title={t('common:labels.setup').toUpperCase()}>
          <RoundsStepper
            value={totalRounds}
            onChange={onTotalRoundsChange}
            min={1}
            max={20}
            accentColor={CASTING_ORANGE}
            inline
          />
          <GameSetupSection label={t('casting:rules.themeLabel')}>
            <ThemeGrid
              options={CASTING_THEME_OPTIONS.map((opt) => ({
                value: opt.value,
                label: t(`casting:themes.${opt.value}`),
                emoji: opt.emoji,
                color: opt.color,
              }))}
              isActive={(v) => selectedThemes.includes(v as CastingTheme)}
              isAllowed={(v) => isThemeAllowed(v as CastingTheme)}
              onSelect={(v) => onToggleTheme(v as CastingTheme)}
              onLockedPress={(v) => requestUnlockFor(v as CastingTheme)}
            />
          </GameSetupSection>
          <DrinkModeToggle accentColor={CASTING_ORANGE} inline />
        </GameSetupCard>
      </View>
    </GameRulesScreen>
  );
}

const rls = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 8, gap: 14 },
  themesSectionLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
});

// ─── Pick Devin ───────────────────────────────────────────────────────────────

function CAPickDevin({ players, onPick }: { players: Player[]; onPick: (idx: number) => void }) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.ink }}>
      <View style={pd.header}>
        <Text style={pd.mono}>{t('casting:pickDevin.mono')}</Text>
        <Text style={pd.title}>{t('casting:pickDevin.title')}</Text>
        <Text style={pd.sub}>{t('casting:pickDevin.sub')}</Text>
      </View>
      <PlayerPickerGrid
        players={players}
        onSelect={(_, i) => onPick(i)}
        shadowColor={CASTING_ORANGE}
      />
    </SafeAreaView>
  );
}

const pd = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  mono: {
    color: '#fff',
    opacity: 0.6,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 40,
    marginBottom: 10,
  },
  sub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    lineHeight: 20,
  },
});

// ─── Scenario ─────────────────────────────────────────────────────────────────

function CAScenario({
  scenario,
  devin,
  onNext,
  onExit,
  onSettings,
  players,
  setPlayers,
}: {
  scenario: string;
  devin: Player;
  onNext: () => void;
  onExit: () => void;
  onSettings: () => void;
  players: Player[];
  setPlayers: (p: Player[]) => void;
}) {
  const { t } = useTranslation();
  const rulesSteps = t('casting:rules.steps', { returnObjects: true }) as any;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: CASTING_ORANGE }}>
      <DotBackground color={T.ink} opacity={0.07} />
      <GameHeader
        tint={T.paper}
        onExit={onExit}
        onSettings={onSettings}
        rules={{ title: t('casting:rules.modalTitle'), rules: rulesSteps, accentColor: CASTING_ORANGE }}
        players={players}
        onPlayersChange={setPlayers}
      />
      <View style={sc.header}>
        <GameChip color={T.paper}>{t('casting:scenario.devinChip', { name: devin.name })}</GameChip>
      </View>
      <View style={sc.body}>
        <Text style={sc.mono}>{t('casting:scenario.mono')}</Text>
        <GameCard style={{ padding: 28 }}>
          <Text style={sc.scenarioText}>« {scenario} »</Text>
        </GameCard>
        <Text style={sc.hint}>{t('casting:scenario.hint')}</Text>
      </View>
      <View style={sc.footer}>
        <ChunkyButton full color={T.paper} onPress={onNext}>
          {t('casting:scenario.distributeBtn')}
        </ChunkyButton>
      </View>
    </SafeAreaView>
  );
}

const sc = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 8 },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  mono: {
    color: '#fff',
    opacity: 0.75,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    alignSelf: 'center',
  },
  scenarioText: {
    color: T.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 33,
    textAlign: 'center',
  },
  hint: {
    color: '#fff',
    fontSize: 15,
    opacity: 0.9,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Handoff ──────────────────────────────────────────────────────────────────

function CAHandoff({
  player,
  playerIdx,
  pos,
  total,
  onReady,
}: {
  player: Player;
  playerIdx: number;
  pos: number;
  total: number;
  onReady: () => void;
}) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.ink }}>
      <View style={hf.body}>
        <Text style={hf.counter}>
          {pos + 1} / {total}
        </Text>
        <InitialAvatar
          index={playerIdx}
          size={120}
          radius={32}
          borderColor={T.paper}
          shadowColor={CASTING_ORANGE}
        />
        <Text style={hf.name}>{t('casting:handoff.instruction', { name: player.name })}</Text>
        <Text style={hf.sub}>{t('casting:handoff.sub')}</Text>
      </View>
      <View style={hf.footer}>
        <ChunkyButton full color={CASTING_ORANGE} shadowColor={CASTING_ORANGE} onPress={onReady}>
          {t('casting:handoff.revealBtn')}
        </ChunkyButton>
      </View>
    </SafeAreaView>
  );
}

const hf = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 24,
  },
  counter: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  name: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 42,
    textAlign: 'center',
  },
  sub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Reveal Number ────────────────────────────────────────────────────────────

function CARevealNumber({
  player,
  playerIdx: _playerIdx,
  number,
  scenario,
  onNext,
  onExit,
  onSettings,
  players,
  setPlayers,
}: {
  player: Player;
  playerIdx: number;
  number: number;
  scenario: string;
  onNext: () => void;
  onExit: () => void;
  onSettings: () => void;
  players: Player[];
  setPlayers: (p: Player[]) => void;
}) {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  const handleReveal = () => {
    setRevealed(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const numBg =
    number <= 3 ? T.cobalt : number <= 6 ? CASTING_ORANGE : number <= 8 ? T.tomato : T.lemon;
  const numFg = number >= 9 ? T.ink : '#fff';
  const label = t(`casting:labels.${number}`);

  const rulesSteps = t('casting:rules.steps', { returnObjects: true }) as any;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <DotBackground opacity={0.05} />
      <GameHeader
        tint={T.paper}
        onExit={onExit}
        onSettings={onSettings}
        rules={{ title: t('casting:rules.modalTitle'), rules: rulesSteps, accentColor: CASTING_ORANGE }}
        players={players}
        onPlayersChange={setPlayers}
      />
      <View style={rn.header}>
        <GameChip color={CASTING_ORANGE} textColor="#fff">
          {player.name}
        </GameChip>
      </View>

      <View style={rn.body}>
        {!revealed ? (
          <View style={rn.holdWrap}>
            <Text style={rn.spotlight}>🎬</Text>
            <Text style={rn.holdTitle}>{t('casting:revealNumber.holdTitle')}</Text>
            <TouchableOpacity style={rn.holdBtn} onPressIn={handleReveal} activeOpacity={0.85}>
              <Text style={rn.holdBtnText}>{t('casting:revealNumber.holdBtn')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={[rn.revealWrap, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[rn.numberCircle, { backgroundColor: numBg }]}>
              <Text style={[rn.numberText, { color: numFg }]}>{number}</Text>
              <Text style={[rn.numberSub, { color: numFg }]}>/10</Text>
            </View>

            <StickerBadge color={numBg} rotation={-4} textColor={numFg}>
              {label.toUpperCase()}
            </StickerBadge>

            <View style={rn.scenarioHint}>
              <Text style={rn.scenarioMono}>{t('casting:revealNumber.scenarioMono')}</Text>
              <Text style={rn.scenarioText}>« {scenario} »</Text>
            </View>

            <View style={rn.scaleTip}>
              <Text style={rn.scaleTipText}>{t('casting:revealNumber.scaleTip')}</Text>
            </View>
          </Animated.View>
        )}
      </View>

      <View style={rn.footer}>
        <ChunkyButton
          full
          color={CASTING_ORANGE}
          onPress={revealed ? onNext : undefined}
          disabled={!revealed}
        >
          {t('casting:revealNumber.nextBtn')}
        </ChunkyButton>
      </View>
    </SafeAreaView>
  );
}

const rn = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 8 },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  holdWrap: { alignItems: 'center', gap: 20 },
  spotlight: { fontSize: 80 },
  holdTitle: {
    color: T.ink,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 33,
    textAlign: 'center',
  },
  holdBtn: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: CASTING_ORANGE,
    borderWidth: 3,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    marginTop: 10,
  },
  holdBtnText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  revealWrap: { alignItems: 'center', gap: 18, width: '100%' },
  numberCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  numberText: { fontSize: 72, fontWeight: '900', letterSpacing: -3, lineHeight: 72 },
  numberSub: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, opacity: 0.8 },
  scenarioHint: { alignItems: 'center', gap: 4, maxWidth: 280 },
  scenarioMono: {
    color: T.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  scenarioText: {
    color: T.inkSoft,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  scaleTip: {
    backgroundColor: T.bgAlt,
    borderWidth: 1.5,
    borderColor: `${T.muted}50`,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  scaleTipText: { color: T.muted, fontSize: 12 },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Perform ──────────────────────────────────────────────────────────────────

function CAPerform({
  scenario,
  devin,
  actors,
  actorIndices,
  onNext,
}: {
  scenario: string;
  devin: Player;
  actors: Player[];
  actorIndices: number[];
  onNext: () => void;
}) {
  const { t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.ink }}>
      <DotBackground color="#fff" opacity={0.04} />
      <View style={pf.body}>
        <Animated.Text style={[pf.action, { transform: [{ scale: scaleAnim }] }]}>
          {t('casting:perform.action')}
        </Animated.Text>

        <GameCard style={{ width: '100%', maxWidth: 320 }}>
          <Text style={pf.scenarioMono}>{t('casting:perform.scenarioMono')}</Text>
          <Text style={pf.scenarioText}>« {scenario} »</Text>
        </GameCard>

        <View style={pf.actorsRow}>
          {actors.map((a, i) => (
            <GameChip
              key={a.id}
              color={playerBg(actorIndices[i])}
              textColor={avatarTextColor(actorIndices[i])}
            >
              {a.name}
            </GameChip>
          ))}
        </View>

        <Text style={pf.hint}>{t('casting:perform.hint', { devin: devin.name })}</Text>
      </View>
      <View style={pf.footer}>
        <ChunkyButton full color={CASTING_ORANGE} shadowColor={CASTING_ORANGE} onPress={onNext}>
          {t('casting:perform.judgeBtn')}
        </ChunkyButton>
      </View>
    </SafeAreaView>
  );
}

const pf = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  action: {
    color: CASTING_ORANGE,
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: -3,
    lineHeight: 68,
    textAlign: 'center',
  },
  scenarioMono: {
    color: T.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  scenarioText: {
    color: T.ink,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  actorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  hint: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Guess ────────────────────────────────────────────────────────────────────

function CAGuessPlayer({
  actor,
  actorIdx,
  devin,
  pos,
  total,
  usedNums,
  onGuess,
  onExit,
  onSettings,
  players,
  setPlayers,
}: {
  actor: Player;
  actorIdx: number;
  devin: Player;
  pos: number;
  total: number;
  usedNums: number[];
  onGuess: (num: number) => void;
  onExit: () => void;
  onSettings: () => void;
  players: Player[];
  setPlayers: (p: Player[]) => void;
}) {
  const { t } = useTranslation();
  const [guess, setGuess] = useState<number | null>(null);
  const rulesSteps = t('casting:rules.steps', { returnObjects: true }) as any;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      <DotBackground opacity={0.06} />
      <GameHeader
        tint={T.paper}
        onExit={onExit}
        onSettings={onSettings}
        rules={{ title: t('casting:rules.modalTitle'), rules: rulesSteps, accentColor: CASTING_ORANGE }}
        players={players}
        onPlayersChange={setPlayers}
      />
      <View style={gp.header}>
        <GameChip color={CASTING_ORANGE} textColor="#fff">
          {t('casting:guess.devinChip', { name: devin.name })}
        </GameChip>
        <GameChip color={T.paper}>
          {pos + 1}/{total}
        </GameChip>
      </View>

      <View style={gp.body}>
        <InitialAvatar index={actorIdx} size={88} radius={24} shadowColor={CASTING_ORANGE} />
        <Text style={gp.question}>{t('casting:guess.question', { name: actor.name })}</Text>
        {guess !== null && <Text style={gp.guessLabel}>{t(`casting:labels.${guess}`).toUpperCase()}</Text>}

        <View style={gp.grid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
            const isUsed = usedNums.includes(n);
            const isSelected = guess === n;
            return (
              <TouchableOpacity
                key={n}
                style={[gp.numBtn, isSelected && gp.numBtnSelected, isUsed && gp.numBtnUsed]}
                onPress={() => !isUsed && setGuess(n)}
                activeOpacity={isUsed ? 1 : 0.8}
              >
                <Text
                  style={[
                    gp.numText,
                    isSelected && { color: '#fff' },
                    isUsed && { color: T.muted },
                  ]}
                >
                  {n}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={gp.footer}>
        <ChunkyButton
          full
          color={CASTING_ORANGE}
          onPress={guess !== null ? () => onGuess(guess!) : undefined}
          disabled={guess === null}
        >
          {pos + 1 < total ? t('casting:guess.nextBtn') : t('casting:guess.verdictBtn')}
        </ChunkyButton>
      </View>
    </SafeAreaView>
  );
}

const gp = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  question: {
    color: T.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 30,
    textAlign: 'center',
    marginTop: 4,
  },
  guessLabel: {
    color: T.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    maxWidth: 300,
    justifyContent: 'center',
    marginTop: 8,
  },
  numBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  numBtnSelected: {
    backgroundColor: CASTING_ORANGE,
    shadowOpacity: 0,
    elevation: 0,
    transform: [{ translateX: 3 }, { translateY: 3 }],
  },
  numBtnUsed: {
    backgroundColor: T.bgAlt,
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.35,
  },
  numText: { color: T.ink, fontSize: 22, fontWeight: '900' },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Results ──────────────────────────────────────────────────────────────────

function CAResults({
  players,
  devinIdx,
  actorIndices,
  actors,
  numbers,
  guesses,
  onExit,
}: {
  players: Player[];
  devinIdx: number;
  actorIndices: number[];
  actors: Player[];
  numbers: Record<number, number>;
  guesses: Record<number, number>;
  onExit: () => void;
}) {
  const { t } = useTranslation();
  const devin = players[devinIdx];
  const { enabled: drinksEnabled } = useDrinksMode();

  const results: (CastingResult & { player: Player; playerIdx: number })[] = actors.map((a, i) => {
    const pIdx = actorIndices[i];
    const real = numbers[pIdx];
    const guess = guesses[pIdx];
    const ecart = Math.abs(real - guess);
    let playerSips = 0;
    const devinSips = 0;
    let tag: CastingResult['tag'];
    if (ecart === 0) {
      // Trop évident — le devin l'a trouvé du premier coup
      playerSips = 3;
      tag = 'PILE POIL';
    } else if (ecart === 1) {
      // Presque — légèrement lisible
      playerSips = 1;
      tag = 'PRESQUE';
    } else {
      // Raté — l'acteur a mal joué et tout le monde est perdu
      playerSips = ecart;
      tag = 'RATÉ';
    }
    return { player: a, playerIdx: pIdx, real, guess, ecart, playerSips, devinSips, tag };
  });

  const pilePoilCount = results.filter((r) => r.ecart === 0).length;
  const hasCastingParfait = pilePoilCount >= 3;
  const hasFlop = pilePoilCount === 0;

  const sips: Record<number, number> = {};
  players.forEach((_, i) => (sips[i] = 0));
  results.forEach((r) => {
    sips[r.playerIdx] += r.playerSips;
    sips[devinIdx] += r.devinSips;
  });
  if (hasCastingParfait) {
    // Tous trop évidents — acteurs boivent 2 bonus chacun
    actorIndices.forEach((idx) => (sips[idx] += 2));
  }
  if (hasFlop) {
    // Performance chaotique — acteurs boivent 3 bonus chacun
    actorIndices.forEach((idx) => (sips[idx] += 3));
  }

  const totalSips = Object.values(sips).reduce((a, b) => a + b, 0);

  const ranked = players
    .map((p, i) => ({ player: p, idx: i, s: sips[i] }))
    .sort((a, b) => b.s - a.s);

  const tagLabel = (tag: string) => {
    if (tag === 'PILE POIL') return t('casting:results.pilePoil');
    if (tag === 'PRESQUE') return t('casting:results.presque');
    return t('casting:results.rates');
  };

  const tagColor = (tag: CastingResult['tag']) => {
    if (tag === 'PILE POIL') return T.mint;
    if (tag === 'PRESQUE') return T.lemon;
    return T.tomato;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      <DotBackground opacity={0.06} />
      <ScrollView contentContainerStyle={res.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <StickerBadge color={CASTING_ORANGE} rotation={-3} textColor="#fff">
          {t('casting:results.badge')}
        </StickerBadge>
        <Text style={res.title}>{t('casting:results.title')}</Text>

        {/* Stats */}
        <View style={res.statsRow}>
          <View style={[res.statCard, { backgroundColor: T.mint }]}>
            <Text style={[res.statLabel, { color: '#fff' }]}>{t('casting:results.pilePoil')}</Text>
            <Text style={[res.statVal, { color: '#fff' }]}>{pilePoilCount}</Text>
          </View>
          <View style={[res.statCard, { backgroundColor: T.lemon }]}>
            <Text style={[res.statLabel, { color: T.ink }]}>{t('casting:results.presque')}</Text>
            <Text style={[res.statVal, { color: T.ink }]}>
              {results.filter((r) => r.ecart === 1).length}
            </Text>
          </View>
          <View style={[res.statCard, { backgroundColor: T.tomato }]}>
            <Text style={[res.statLabel, { color: '#fff' }]}>{t('casting:results.rates')}</Text>
            <Text style={[res.statVal, { color: '#fff' }]}>
              {results.filter((r) => r.ecart >= 2).length}
            </Text>
          </View>
        </View>

        {/* Bonus */}
        {(hasCastingParfait || hasFlop) && (
          <View style={[res.bonusCard, { backgroundColor: hasCastingParfait ? T.mint : T.tomato }]}>
            <Text style={res.bonusIcon}>{hasCastingParfait ? '🎬' : '💀'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={res.bonusTitle}>
                {hasCastingParfait ? t('casting:results.castingParfait') : t('casting:results.flopTotal')}
              </Text>
              <Text style={res.bonusSub}>
                {hasCastingParfait
                  ? t('casting:results.castingParfaitSub', { devin: devin.name, verb: drinksEnabled ? 'boivent' : 'prennent', unit: drinkUnitLower(2, drinksEnabled) })
                  : t('casting:results.flopTotalSub', { verb: drinksEnabled ? 'boivent' : 'prennent', unit: drinkUnitLower(3, drinksEnabled) })}
              </Text>
            </View>
          </View>
        )}

        {/* Per-actor breakdown */}
        <Text style={res.sectionLabel}>{t('casting:results.actorDetail')}</Text>
        {results.map((r) => {
          const tc = tagColor(r.tag);
          const tagFg = r.tag === 'PRESQUE' ? T.ink : '#fff';
          return (
            <View key={r.playerIdx} style={res.actorCard}>
              <InitialAvatar index={r.playerIdx} size={36} radius={10} shadowColor="transparent" />
              <View style={{ flex: 1 }}>
                <Text style={res.actorName}>{r.player.name}</Text>
                <View style={res.actorNums}>
                  <View style={res.numBadge}>
                    <Text style={res.numBadgeText}>{r.real}</Text>
                  </View>
                  <Text style={res.numMono}>{t('casting:results.realArrow')}</Text>
                  <View style={[res.numBadge, { backgroundColor: tc, borderColor: T.ink }]}>
                    <Text style={[res.numBadgeText, { color: tagFg }]}>{r.guess}</Text>
                  </View>
                  <Text style={res.numMono}>{t('casting:results.devinedLabel')}</Text>
                </View>
              </View>
              <View style={res.tagWrap}>
                <View style={[res.tagBadge, { backgroundColor: tc }]}>
                  <Text style={[res.tagText, { color: tagFg }]}>{tagLabel(r.tag)}</Text>
                </View>
                <Text style={res.drinkInfo}>
                  {t(drinksEnabled ? 'casting:results.actorDrinks' : 'casting:results.actorSober', { name: r.player.name, count: r.playerSips })}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Scoreboard */}
        <Text style={res.sectionLabel}>
          {t('casting:results.rankingLabel', { total: totalSips, unit: drinkColumnLabel(drinksEnabled) })}
        </Text>
        {ranked.map((item, i) => {
          const isTop = i === 0 && item.s > 0;
          const isDevinPlayer = item.idx === devinIdx;
          return (
            <View
              key={item.player.id}
              style={[res.rankCard, isTop && { backgroundColor: CASTING_ORANGE }]}
            >
              <View style={[res.rankNum, isTop && { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                <Text style={[res.rankNumText, isTop && { color: '#fff' }]}>#{i + 1}</Text>
              </View>
              <InitialAvatar index={item.idx} size={34} radius={10} shadowColor="transparent" />
              <View style={{ flex: 1 }}>
                <Text style={[res.rankName, isTop && { color: '#fff' }]}>
                  {item.player.name}
                  {isDevinPlayer ? <Text style={res.devinBadge}>{t('casting:results.devinBadge')}</Text> : null}
                </Text>
                <Text style={[res.rankSub, isTop && { color: 'rgba(255,255,255,0.7)' }]}>
                  {item.s === 0 ? drinkSoberLabel(drinksEnabled) : drinkUnit(item.s, drinksEnabled)}
                </Text>
              </View>
              <Text
                style={[
                  res.rankSips,
                  {
                    color: isTop ? T.lemon : item.s === 0 ? T.mint : T.tomato,
                  },
                ]}
              >
                {item.s}
              </Text>
            </View>
          );
        })}

        {/* CTAs */}
        <ChunkyButton full color={CASTING_ORANGE} onPress={onExit}>
          {t('casting:results.playAgain')}
        </ChunkyButton>
        <ChunkyButton full color={T.paper} textColor={T.ink} onPress={onExit}>
          {t('casting:results.backToHub')}
        </ChunkyButton>
      </ScrollView>
    </SafeAreaView>
  );
}

const res = StyleSheet.create({
  scroll: { padding: 20, gap: 12, paddingBottom: 48 },
  title: {
    color: T.ink,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 40,
    marginTop: 16,
  },
  sectionLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 16,
    padding: 12,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  statLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  statVal: { fontSize: 28, fontWeight: '900' },
  bonusCard: {
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  bonusIcon: { fontSize: 28 },
  bonusTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  bonusSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2, lineHeight: 18 },
  actorCard: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  actorName: { color: T.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  actorNums: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  numBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: T.ink,
    borderWidth: 1.5,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numBadgeText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  numMono: { color: T.muted, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  tagWrap: { alignItems: 'flex-end', gap: 4 },
  tagBadge: {
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  tagText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  drinkInfo: { color: T.inkSoft, fontSize: 11, fontWeight: '600' },
  rankCard: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  rankNum: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: T.bgAlt,
    borderWidth: 1.5,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumText: { color: T.ink, fontSize: 11, fontWeight: '700' },
  rankName: { color: T.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  devinBadge: { fontSize: 9, opacity: 0.6, letterSpacing: 1, fontWeight: '700' },
  rankSub: { color: T.muted, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginTop: 1 },
  rankSips: { fontSize: 26, fontWeight: '900' },
});

// ─── Orchestrator ─────────────────────────────────────────────────────────────

function CastingGame({
  players: initialPlayers,
  onExit,
  onSettings,
}: {
  players: Player[];
  onExit: () => void;
  onSettings: () => void;
}) {
  const { t } = useTranslation();
  const { filterAllowed } = useCastingThemeAccess();
  const {
    players,
    setPlayers,
    step,
    setStep,
    devinIdx,
    scenario,
    numbers,
    curPos,
    guessPos,
    guesses,
    selectedThemes,
    totalRounds,
    setTotalRounds,
    toggleTheme,
    actors,
    actorIndices,
    pickDevin: pickDevinAction,
    startActors,
    advanceReveal,
    startGuesses,
    submitGuess,
  } = useCasting(initialPlayers);

  const onPickDevin = (idx: number) => {
    const safeThemes = filterAllowed(selectedThemes);
    const activeThemes = safeThemes.length > 0 ? safeThemes : ['daily' as CastingTheme];
    const scenariosData = t('casting:scenarios', { returnObjects: true }) as Record<CastingTheme, string[]>;
    const pool = getScenariosForThemesI18n(activeThemes, scenariosData);
    const finalPool = pool.length > 0 ? pool : getScenariosForThemes(activeThemes);
    pickDevinAction(idx, pickRandom(finalPool));
  };

  if (step === 'rules') {
    return (
      <CARules
        players={players}
        onPlayersChange={setPlayers}
        onStart={() => setStep('pick-devin')}
        onExit={onExit}
        onSettings={onSettings}
        selectedThemes={selectedThemes}
        onToggleTheme={toggleTheme}
        totalRounds={totalRounds}
        onTotalRoundsChange={setTotalRounds}
      />
    );
  }

  if (step === 'pick-devin') {
    return <CAPickDevin players={players} onPick={onPickDevin} />;
  }

  if (step === 'scenario' && devinIdx !== null) {
    return (
      <CAScenario
        scenario={scenario}
        devin={players[devinIdx]}
        onNext={startActors}
        onExit={onExit}
        onSettings={onSettings}
        players={players}
        setPlayers={setPlayers}
      />
    );
  }

  if (step === 'handoff') {
    const actor = actors[curPos];
    const actorIdx = actorIndices[curPos];
    return (
      <CAHandoff
        player={actor}
        playerIdx={actorIdx}
        pos={curPos}
        total={actors.length}
        onReady={() => setStep('reveal-number')}
      />
    );
  }

  if (step === 'reveal-number') {
    const actor = actors[curPos];
    const actorIdx = actorIndices[curPos];
    return (
      <CARevealNumber
        player={actor}
        playerIdx={actorIdx}
        number={numbers[actorIdx]}
        scenario={scenario}
        onNext={advanceReveal}
        onExit={onExit}
        onSettings={onSettings}
        players={players}
        setPlayers={setPlayers}
      />
    );
  }

  if (step === 'perform' && devinIdx !== null) {
    return (
      <CAPerform
        scenario={scenario}
        devin={players[devinIdx]}
        actors={actors}
        actorIndices={actorIndices}
        onNext={startGuesses}
      />
    );
  }

  if (step === 'guess' && devinIdx !== null) {
    const actor = actors[guessPos];
    const actorIdx = actorIndices[guessPos];
    const usedNums = Object.values(guesses);
    return (
      <CAGuessPlayer
        key={guessPos}
        actor={actor}
        actorIdx={actorIdx}
        devin={players[devinIdx]}
        pos={guessPos}
        total={actors.length}
        usedNums={usedNums}
        onExit={onExit}
        onSettings={onSettings}
        players={players}
        setPlayers={setPlayers}
        onGuess={(num) => submitGuess(actorIdx, num)}
      />
    );
  }

  if (step === 'results' && devinIdx !== null) {
    return (
      <CAResults
        players={players}
        devinIdx={devinIdx}
        actorIndices={actorIndices}
        actors={actors}
        numbers={numbers}
        guesses={guesses}
        onExit={onExit}
      />
    );
  }

  return null;
}

// ─── Screen wrapper ───────────────────────────────────────────────────────────

export function CastingScreen() {
  const navigation = useNavigation();
  const route = useRoute<CastingScreenRouteProp>();
  const { players } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <CastingGame
        players={players}
        onExit={() => (navigation as any).goBack()}
        onSettings={() => (navigation as any).navigate('Settings')}
      />
    </View>
  );
}
