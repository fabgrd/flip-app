// La Bombe — patate chaude / "pass the phone before it explodes" (trend TikTok)
// Fidèle à la maquette screens-bombe.jsx (Fl!p - Maquettes)
// Flow: rules → live (catégorie + tic-tac) → boom → qui tenait ? → … → podium
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import {
  ChunkyButton,
  DotBackground,
  DrinkModeToggle,
  GameCard,
  GameChip,
  GameHeader,
  GameRulesScreen,
  GameSetupCard,
  InitialAvatar,
  RoundsStepper,
  StickerBadge,
  TheBombIcon,
} from '../components';
import { T } from '../constants/flipTokens';
import { useTheBomb } from '../games/the-bomb';
import { useDrinksMode } from '../hooks';
import { Player, RootStackParamList } from '../types';

type TheBombScreenRouteProp = RouteProp<RootStackParamList, 'TheBomb'>;

const MIN_FUSE_MS = 9000;
const MAX_FUSE_MS = 20000;

// ─── Bombe animée (live) — 1:1 maquette BombVisual ────────────────────────────

const GLOW_OPACITY = [0, 0.25, 0.5, 0.85] as const;
const SPARK_DUR = [1000, 600, 360, 180] as const; // bombSpk 1s / .6s / .36s / .18s
const SHAKE_AMP = [0, 1, 2, 4] as const; // bombSk1/2/3
const SHAKE_DUR = [0, 500, 280, 140] as const;
const SHAKE_ROT = [0, 0, 1, 2] as const;

function BombVisual({ level, lit }: { level: number; lit: boolean }) {
  const glow = useRef(new Animated.Value(GLOW_OPACITY[0])).current;
  const spark = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  // Halo : opacité par niveau, transition 200ms
  useEffect(() => {
    Animated.timing(glow, {
      toValue: GLOW_OPACITY[level],
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [glow, level]);

  // Étincelle qui scintille — seulement mèche allumée, plus vite à chaque niveau
  useEffect(() => {
    if (!lit) return;
    spark.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(spark, {
          toValue: 1,
          duration: SPARK_DUR[level] / 2,
          useNativeDriver: true,
        }),
        Animated.timing(spark, {
          toValue: 0,
          duration: SPARK_DUR[level] / 2,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [spark, level, lit]);

  // Tremblement du corps par niveau
  useEffect(() => {
    if (level === 0) {
      shake.setValue(0);
      return;
    }
    const half = SHAKE_DUR[level] / 2;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: half, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: half, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shake, level]);

  const amp = SHAKE_AMP[level];
  const rot = SHAKE_ROT[level];
  const translateX = shake.interpolate({ inputRange: [0, 1], outputRange: [-amp, amp] });
  const translateY = shake.interpolate({ inputRange: [0, 1], outputRange: [amp, -amp] });
  const rotate = shake.interpolate({
    inputRange: [0, 1],
    outputRange: [`-${rot}deg`, `${rot}deg`],
  });
  const sparkScale = spark.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });
  const sparkOpacity = spark.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  return (
    <View style={bv.wrap}>
      {/* Halo radial orange */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: glow }]}>
        <Svg width={240} height={240}>
          <Defs>
            <RadialGradient id="bombGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={T.bombAccent} stopOpacity={1} />
              <Stop offset="70%" stopColor={T.bombAccent} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={120} cy={120} r={120} fill="url(#bombGlow)" />
        </Svg>
      </Animated.View>

      {/* Corps de la bombe */}
      <Animated.View
        style={{ width: 168, height: 168, transform: [{ translateX }, { translateY }, { rotate }] }}
      >
        <Svg width={168} height={168} viewBox="0 0 168 168" fill="none">
          <Circle cx={84} cy={98} r={62} fill="#0d0c0a" />
          <Circle
            cx={84}
            cy={98}
            r={62}
            fill="none"
            stroke={level >= 2 ? T.bombAccent : '#2a2722'}
            strokeWidth={3}
          />
          <Ellipse cx={64} cy={76} rx={16} ry={11} fill="#fff" opacity={0.18} />
          {/* embout */}
          <Rect
            x={100}
            y={34}
            width={26}
            height={26}
            rx={5}
            transform="rotate(45 113 47)"
            fill="#0d0c0a"
          />
          {/* mèche */}
          <Path
            d="M120 36 Q150 18 142 2"
            fill="none"
            stroke="#6b6256"
            strokeWidth={5}
            strokeLinecap="round"
          />
        </Svg>

        {/* étincelle qui scintille — visible seulement mèche allumée */}
        {lit && (
          <Animated.View
            style={[bv.spark, { opacity: sparkOpacity, transform: [{ scale: sparkScale }] }]}
          >
            <Svg width={26} height={26}>
              <Defs>
                <RadialGradient id="bombSpark" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#FFE08A" stopOpacity={1} />
                  <Stop offset="55%" stopColor={T.bombAccent} stopOpacity={1} />
                  <Stop offset="75%" stopColor={T.bombAccent} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={13} cy={13} r={13} fill="url(#bombSpark)" />
            </Svg>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const bv = StyleSheet.create({
  wrap: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Centrée sur le bout de la mèche (142, 2 dans le viewBox 168)
  spark: {
    position: 'absolute',
    top: -11,
    right: 13,
    width: 26,
    height: 26,
  },
});

// ─── Screen: Rules ────────────────────────────────────────────────────────────

function TBRules({
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
  const rulesSteps = t('theBomb:ui.rules.steps', {
    returnObjects: true,
  }) as { n: string; title: string; desc: string }[];

  return (
    <GameRulesScreen
      accentColor={T.bombAccent}
      title={t('theBomb:ui.rules.title')}
      tagline={t('theBomb:ui.rules.tagline')}
      icon={<TheBombIcon size={100} />}
      iconRotation={8}
      rulesModal={{ rules: rulesSteps, title: t('theBomb:ui.rules.title') }}
      players={players}
      onPlayersChange={onPlayersChange}
      onExit={onExit}
      onSettings={onSettings}
      minPlayers={3}
      onStart={onStart}
      startLabel={t('theBomb:ui.rules.start')}
      scrollable
    >
      {/* Carte "COMMENT ON JOUE" — 1:1 maquette */}
      <View style={ru.cardWrap}>
        <GameCard color={T.paper} style={ru.card}>
          <Text style={ru.cardLabel}>{t('theBomb:ui.rules.howToPlay')}</Text>
          {rulesSteps.map((s) => (
            <View key={s.n} style={ru.stepRow}>
              <View style={ru.stepNum}>
                <Text style={ru.stepNumText}>{s.n}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={ru.stepTitle}>{s.title}</Text>
                <Text style={ru.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
          <Text style={ru.warning}>{t('theBomb:ui.rules.warning')}</Text>
        </GameCard>
      </View>

      <View style={ru.setupWrap}>
        <GameSetupCard accentColor={T.bombAccent} title={t('common:labels.setup').toUpperCase()}>
          <RoundsStepper
            value={totalRounds}
            onChange={onTotalRoundsChange}
            min={1}
            max={15}
            accentColor={T.bombAccent}
            inline
          />
          <DrinkModeToggle accentColor={T.bombAccent} inline />
        </GameSetupCard>
      </View>
    </GameRulesScreen>
  );
}

const ru = StyleSheet.create({
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
    backgroundColor: T.bombAccent,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  stepTitle: { color: T.ink, fontSize: 17, fontWeight: '700' },
  stepDesc: { color: T.inkSoft, fontSize: 14, marginTop: 2 },
  warning: {
    marginTop: 12,
    color: T.muted,
    fontSize: 10.5,
    lineHeight: 15,
  },
  setupWrap: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
});

// ─── Screen: Live (catégorie + tic-tac temps réel) ────────────────────────────

// Fond qui s'assombrit/rougit par niveau — 1:1 maquette dangerBg
const DANGER_BG = ['#181613', '#241a12', '#3a1d0c', '#5c1f08'] as const;

function TBLive({
  category,
  round,
  totalRounds,
  onBoom,
  onExit,
  onSettings,
  players,
  setPlayers,
}: {
  category: string;
  round: number;
  totalRounds: number;
  onBoom: () => void;
  onExit: () => void;
  onSettings: () => void;
  players: Player[];
  setPlayers: (p: Player[]) => void;
}) {
  const { t } = useTranslation();
  const rulesSteps = t('theBomb:ui.rules.steps', {
    returnObjects: true,
  }) as { n: string; title: string; desc: string }[];
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(0);
  const [passes, setPasses] = useState(0);
  const [flash, setFlash] = useState(false);
  const fuseRef = useRef(0);
  const startRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTickRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (flashRef.current) clearTimeout(flashRef.current);
      doneRef.current = true;
    };
  }, []);

  const begin = () => {
    fuseRef.current = MIN_FUSE_MS + Math.random() * (MAX_FUSE_MS - MIN_FUSE_MS); // 9–20s, caché
    startRef.current = Date.now();
    lastTickRef.current = 0;
    doneRef.current = false;
    setStarted(true);
    intervalRef.current = setInterval(() => {
      if (doneRef.current) return;
      const now = Date.now();
      const elapsed = now - startRef.current;
      const ratio = Math.min(1, elapsed / fuseRef.current);
      const lvl = ratio < 0.45 ? 0 : ratio < 0.72 ? 1 : ratio < 0.9 ? 2 : 3;
      setLevel((prev) => (prev === lvl ? prev : lvl));
      // Tic-tac haptique qui s'accélère — cadence 600ms → 80ms comme la maquette
      const cadence = 600 - ratio * 520;
      if (now - lastTickRef.current >= cadence) {
        lastTickRef.current = now;
        Haptics.selectionAsync();
      }
      if (elapsed >= fuseRef.current) {
        doneRef.current = true;
        if (intervalRef.current) clearInterval(intervalRef.current);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        onBoom();
      }
    }, 60);
  };

  const pass = () => {
    setPasses((p) => p + 1);
    setFlash(true);
    if (flashRef.current) clearTimeout(flashRef.current);
    flashRef.current = setTimeout(() => setFlash(false), 130);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const dangerBg = DANGER_BG[started ? level : 0];

  return (
    <View style={[lv.screen, { backgroundColor: dangerBg }]}>
      {flash && <View pointerEvents="none" style={lv.flash} />}
      <SafeAreaView style={{ flex: 1 }}>
        <GameHeader
          tint={T.paper}
          onExit={onExit}
          onSettings={onSettings}
          rules={{
            title: t('theBomb:ui.rules.title'),
            rules: rulesSteps,
            accentColor: T.bombAccent,
          }}
          players={players}
          onPlayersChange={setPlayers}
        />
        <View style={lv.chipRow}>
          <GameChip color={T.bombAccent} textColor="#fff">
            {t('theBomb:ui.live.roundChip', { round: round + 1, target: totalRounds })}
          </GameChip>
        </View>

        <View style={lv.catArea}>
          <Text style={lv.catLabel}>{t('theBomb:ui.live.categoryLabel')}</Text>
          <Text style={lv.catText}>{category}</Text>
        </View>

        <View style={lv.center}>
          <BombVisual level={started ? level : 0} lit={started} />
        </View>

        <View style={lv.footer}>
          {!started ? (
            <ChunkyButton full color={T.lemon} size="lg" onPress={begin}>
              {t('theBomb:ui.live.startFuse')}
            </ChunkyButton>
          ) : (
            <>
              <Text style={lv.passHint}>
                {passes === 0
                  ? t('theBomb:ui.live.passHintFirst')
                  : t('theBomb:ui.live.passHint', { count: passes, plural: passes > 1 ? 's' : '' })}
              </Text>
              <TouchableOpacity style={lv.passBtn} onPress={pass} activeOpacity={0.85}>
                <Text style={lv.passBtnText}>{t('theBomb:ui.live.passCta')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const lv = StyleSheet.create({
  screen: { flex: 1 },
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.14)',
    zIndex: 6,
  },
  chipRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  catArea: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 16 },
  catLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    letterSpacing: 2,
  },
  catText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 36,
    textAlign: 'center',
    marginTop: 4,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  passHint: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center' },
  passBtn: {
    height: 84,
    borderRadius: 24,
    backgroundColor: T.bombAccent,
    borderWidth: 3,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  passBtnText: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
});

// ─── Screen: Boom (explosion plein écran) ─────────────────────────────────────

function TBBoom({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const pop = useRef(new Animated.Value(0.2)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // bombPop: .2 → 1.25 → 1 + bombShakeAll une fois, après 40ms
    Animated.sequence([
      Animated.delay(40),
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pop, { toValue: 1.25, duration: 250, useNativeDriver: true }),
          Animated.timing(pop, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(shake, { toValue: -6, duration: 80, useNativeDriver: true }),
          Animated.timing(shake, { toValue: 6, duration: 80, useNativeDriver: true }),
          Animated.timing(shake, { toValue: -5, duration: 80, useNativeDriver: true }),
          Animated.timing(shake, { toValue: 5, duration: 80, useNativeDriver: true }),
          Animated.timing(shake, { toValue: 0, duration: 80, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
    const timer = setTimeout(onDone, 1500);
    return () => clearTimeout(timer);
  }, [onDone, pop, shake]);

  const popOpacity = pop.interpolate({
    inputRange: [0.2, 0.8],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <TouchableOpacity style={bm.screen} onPress={onDone} activeOpacity={1}>
      <Animated.View style={{ alignItems: 'center', transform: [{ translateX: shake }] }}>
        <Animated.Text style={[bm.emoji, { opacity: popOpacity, transform: [{ scale: pop }] }]}>
          💥
        </Animated.Text>
        <Text style={bm.title}>{t('theBomb:ui.boom.title')}</Text>
      </Animated.View>
      <Text style={bm.hint}>{t('theBomb:ui.boom.continue')}</Text>
    </TouchableOpacity>
  );
}

const bm = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: T.bombAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 130, lineHeight: 140 },
  title: {
    marginTop: 8,
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
    color: '#fff',
    textShadowColor: T.ink,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  hint: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
});

// ─── Screen: Qui tenait le tel ? ──────────────────────────────────────────────

function TBBlame({
  players,
  setPlayers,
  category,
  onPick,
  onExit,
  onSettings,
}: {
  players: Player[];
  setPlayers: (p: Player[]) => void;
  category: string;
  onPick: (idx: number) => void;
  onExit: () => void;
  onSettings: () => void;
}) {
  const { t } = useTranslation();
  const rulesSteps = t('theBomb:ui.rules.steps', {
    returnObjects: true,
  }) as { n: string; title: string; desc: string }[];
  return (
    <SafeAreaView style={bl.screen}>
      <DotBackground opacity={0.06} gap={14} />
      <GameHeader
        tint={T.paper}
        onExit={onExit}
        onSettings={onSettings}
        rules={{
          title: t('theBomb:ui.rules.title'),
          rules: rulesSteps,
          accentColor: T.bombAccent,
        }}
        players={players}
        onPlayersChange={setPlayers}
      />
      <View style={bl.chipRow}>
        <GameChip color={T.bombAccent} textColor="#fff">
          {category}
        </GameChip>
      </View>

      <View style={bl.hero}>
        <StickerBadge color={T.tomato} rotation={-3} textColor="#fff" style={bl.sticker}>
          {t('theBomb:ui.blame.badge')}
        </StickerBadge>
        <Text style={bl.title}>{t('theBomb:ui.blame.title')}</Text>
        <Text style={bl.subtitle}>{t('theBomb:ui.blame.subtitle')}</Text>
      </View>

      <ScrollView contentContainerStyle={bl.grid} showsVerticalScrollIndicator={false}>
        {players.map((p, i) => (
          <ChunkyButton
            key={p.id}
            color={T.paper}
            style={bl.playerBtnWrap}
            metrics={{ height: 106, radius: 20 }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onPick(i);
            }}
          >
            <View style={bl.playerInner}>
              <InitialAvatar index={i} size={46} radius={13} />
              <Text style={bl.playerName}>{p.name}</Text>
            </View>
          </ChunkyButton>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const bl = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  chipRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  hero: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 },
  sticker: { alignSelf: 'flex-start' },
  title: {
    marginTop: 14,
    color: T.ink,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -1.2,
  },
  subtitle: { marginTop: 8, color: T.inkSoft, fontSize: 14 },
  grid: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  playerBtnWrap: { width: '47%' },
  playerInner: { alignItems: 'center', gap: 8 },
  playerName: { color: T.ink, fontSize: 15, fontWeight: '700' },
});

// ─── Screen: Explosé — la victime assume (+ gorgées en mode sips) ─────────────

function TBExploded({
  victim,
  victimIdx,
  round,
  isLast,
  onNext,
  onExit,
  onSettings,
  players,
  setPlayers,
}: {
  victim: Player;
  victimIdx: number;
  round: number;
  isLast: boolean;
  onNext: () => void;
  onExit: () => void;
  onSettings: () => void;
  players: Player[];
  setPlayers: (p: Player[]) => void;
}) {
  const { t } = useTranslation();
  const rulesSteps = t('theBomb:ui.rules.steps', {
    returnObjects: true,
  }) as { n: string; title: string; desc: string }[];
  const { enabled: drinksEnabled } = useDrinksMode();
  // Les gorgées montent avec les manches : manche 1 → 1, manche 5 → 5
  const sips = round + 1;

  const wobble = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wobble, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.timing(wobble, { toValue: 0, duration: 260, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [wobble]);
  const wobbleRot = wobble.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '4deg'] });

  return (
    <View style={{ flex: 1, backgroundColor: T.ink }}>
      <SafeAreaView style={ex.screen}>
        <GameHeader
          tint={T.paper}
          onExit={onExit}
          onSettings={onSettings}
          rules={{
            title: t('theBomb:ui.rules.title'),
            rules: rulesSteps,
            accentColor: T.bombAccent,
          }}
          players={players}
          onPlayersChange={setPlayers}
        />
        <View style={ex.center}>
          <StickerBadge color={T.bombAccent} rotation={-4} textColor="#fff">
            {t('theBomb:ui.exploded.badge')}
          </StickerBadge>

          <Animated.View style={{ transform: [{ rotate: wobbleRot }] }}>
            <InitialAvatar
              index={victimIdx}
              label={victim.name[0]?.toUpperCase()}
              size={120}
              radius={32}
              borderColor={T.ink}
              shadowColor={T.bombAccent}
            />
            <Text style={ex.boomEmoji}>💥</Text>
          </Animated.View>

          <Text style={ex.title}>{t('theBomb:ui.exploded.title', { name: victim.name })}</Text>
          <Text style={ex.subtitle}>{t('theBomb:ui.exploded.subtitle')}</Text>

          {drinksEnabled && (
            <View style={ex.drinkBanner}>
              <Text style={ex.drinkEmoji}>🍻</Text>
              <Text style={ex.drinkText}>
                {t('theBomb:ui.exploded.drink', { count: sips, plural: sips > 1 ? 's' : '' })}
              </Text>
            </View>
          )}
        </View>

        <View style={ex.footer}>
          <ChunkyButton
            full
            color={T.bombAccent}
            textColor="#fff"
            shadowColor={T.bombAccent}
            size="lg"
            onPress={onNext}
          >
            {isLast ? t('theBomb:ui.exploded.podium') : t('theBomb:ui.exploded.next')}
          </ChunkyButton>
        </View>
      </SafeAreaView>
    </View>
  );
}

const ex = StyleSheet.create({
  screen: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 24,
  },
  boomEmoji: {
    position: 'absolute',
    top: -18,
    right: -22,
    fontSize: 44,
  },
  title: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.5,
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
  drinkBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: T.bombAccent,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  drinkEmoji: { fontSize: 22 },
  drinkText: { flex: 1, color: T.ink, fontSize: 15, letterSpacing: -0.2 },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Screen: Podium ───────────────────────────────────────────────────────────

const MEDALS = ['💣', '🥈', '🥉'];

function TBPodium({
  players,
  setPlayers,
  explosions,
  onReplay,
  onExit,
  onSettings,
}: {
  players: Player[];
  setPlayers: (p: Player[]) => void;
  explosions: number[];
  onReplay: () => void;
  onExit: () => void;
  onSettings: () => void;
}) {
  const { t } = useTranslation();
  const rulesSteps = t('theBomb:ui.rules.steps', {
    returnObjects: true,
  }) as { n: string; title: string; desc: string }[];
  const ranked = players.map((p, i) => ({ p, i, e: explosions[i] ?? 0 })).sort((a, b) => b.e - a.e);
  const top = ranked[0];
  const podium = ranked.slice(0, 3);
  const hasVictim = (top?.e ?? 0) > 0;

  return (
    <SafeAreaView style={pd.screen}>
      <DotBackground color={T.ink} opacity={0.08} gap={16} />
      <GameHeader
        tint={T.paper}
        onExit={onExit}
        onSettings={onSettings}
        rules={{
          title: t('theBomb:ui.rules.title'),
          rules: rulesSteps,
          accentColor: T.bombAccent,
        }}
        players={players}
        onPlayersChange={setPlayers}
      />

      <ScrollView contentContainerStyle={pd.content} showsVerticalScrollIndicator={false}>
        <View style={pd.hero}>
          <StickerBadge color={T.paper} rotation={-5}>
            {t('theBomb:ui.podium.badge')}
          </StickerBadge>
          <Text style={pd.title}>
            {hasVictim
              ? t('theBomb:ui.podium.title', { name: top.p.name })
              : t('theBomb:ui.podium.titleNone')}
          </Text>
          <Text style={pd.subtitle}>
            {hasVictim
              ? t('theBomb:ui.podium.subtitle', { count: top.e, plural: top.e > 1 ? 's' : '' })
              : t('theBomb:ui.podium.subtitleNone')}
          </Text>
        </View>

        <View style={pd.cards}>
          {podium.map(({ p, i, e }, idx) => (
            <GameCard key={p.id} color={T.paper} style={pd.card}>
              <View style={pd.cardRow}>
                <Text style={pd.medal}>{MEDALS[idx]}</Text>
                <InitialAvatar index={i} size={48} radius={14} />
                <Text style={pd.playerName}>{p.name}</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={pd.count}>{e}</Text>
                  <Text style={pd.countLabel}>{t('theBomb:ui.podium.explosionsLabel')}</Text>
                </View>
              </View>
            </GameCard>
          ))}
        </View>

        <View style={pd.btnStack}>
          <ChunkyButton full color={T.ink} textColor="#fff" size="lg" onPress={onReplay}>
            {t('theBomb:ui.podium.playAgain')}
          </ChunkyButton>
          <ChunkyButton full color={T.paper} size="md" onPress={onExit}>
            {t('theBomb:ui.podium.backToHub')}
          </ChunkyButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const pd = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bombAccent },
  content: { paddingBottom: 40 },
  hero: { paddingHorizontal: 20, paddingTop: 14, alignItems: 'center' },
  title: {
    marginTop: 22,
    color: '#fff',
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 48,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.92)',
    fontSize: 15,
    textAlign: 'center',
  },
  cards: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  card: { borderRadius: 22, padding: 14 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  medal: { fontSize: 28, width: 36, textAlign: 'center' },
  playerName: {
    flex: 1,
    color: T.ink,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  count: {
    color: T.bombAccentDark,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 28,
  },
  countLabel: { color: T.muted, fontSize: 9.5, letterSpacing: 0.5 },
  btnStack: { paddingHorizontal: 20, paddingTop: 26, gap: 10 },
});

// ─── Main Component ───────────────────────────────────────────────────────────

export function TheBombScreen() {
  const route = useRoute<TheBombScreenRouteProp>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const categories = t('theBomb:categories', { returnObjects: true }) as string[];

  const {
    players,
    setPlayers,
    step,
    setStep,
    round,
    totalRounds,
    setTotalRounds,
    category,
    explosions,
    victimIdx,
    isLastRound,
    pickVictim,
    nextRound,
    restart,
  } = useTheBomb(route.params.players as Player[], categories);

  const goBack = () => (navigation as any).goBack();
  const goHome = () => (navigation as any).navigate('Home');
  const goSettings = () => (navigation as any).navigate('Settings');

  if (step === 'rules') {
    return (
      <TBRules
        players={players}
        onPlayersChange={setPlayers}
        onStart={() => setStep('live')}
        onExit={goBack}
        onSettings={goSettings}
        totalRounds={totalRounds}
        onTotalRoundsChange={setTotalRounds}
      />
    );
  }

  if (step === 'live') {
    return (
      <TBLive
        key={round}
        category={category}
        round={round}
        totalRounds={totalRounds}
        onBoom={() => setStep('boom')}
        onExit={goBack}
        onSettings={goSettings}
        players={players}
        setPlayers={setPlayers}
      />
    );
  }

  if (step === 'boom') {
    return <TBBoom onDone={() => setStep('blame')} />;
  }

  if (step === 'blame') {
    return (
      <TBBlame
        players={players}
        setPlayers={setPlayers}
        category={category}
        onPick={pickVictim}
        onExit={goBack}
        onSettings={goSettings}
      />
    );
  }

  if (step === 'exploded') {
    const vIdx = victimIdx ?? 0;
    return (
      <TBExploded
        victim={players[vIdx]}
        victimIdx={vIdx}
        round={round}
        isLast={isLastRound}
        onNext={nextRound}
        onExit={goBack}
        onSettings={goSettings}
        players={players}
        setPlayers={setPlayers}
      />
    );
  }

  if (step === 'end') {
    return (
      <TBPodium
        players={players}
        setPlayers={setPlayers}
        explosions={explosions}
        onReplay={restart}
        onExit={goHome}
        onSettings={goSettings}
      />
    );
  }

  return null;
}
