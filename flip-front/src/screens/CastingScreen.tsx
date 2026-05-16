// Le Casting — jeu d'acting avec chiffres secrets
// Flow: rules → pick-devin → scenario → handoff+reveal (each actor) → perform → guess → results
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CastingIcon, DotBackground, GameMenuActions } from '../components';
import { T } from '../constants/flipTokens';
import {
  CASTING_LABELS,
  CASTING_ORANGE,
  CASTING_SCENARIOS,
  LIGHT_COLORS,
  PLAYER_COLORS,
} from '../games/casting';
import { CastingResult } from '../games/casting/types';
import { Player, RootStackParamList } from '../types';

type CastingScreenRouteProp = RouteProp<RootStackParamList, 'Casting'>;

type CastingStep =
  | 'rules'
  | 'pick-devin'
  | 'scenario'
  | 'handoff'
  | 'reveal-number'
  | 'perform'
  | 'guess'
  | 'results';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function playerColor(idx: number): string {
  return PLAYER_COLORS[idx % PLAYER_COLORS.length];
}

function playerBg(idx: number): string {
  return (T as unknown as Record<string, string>)[playerColor(idx)] ?? T.tomato;
}

function avatarTextColor(idx: number): string {
  return (LIGHT_COLORS as readonly string[]).includes(playerColor(idx)) ? T.ink : '#fff';
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Chip({
  color,
  textColor = T.ink,
  children,
}: {
  color: string;
  textColor?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={[sh.chip, { backgroundColor: color }]}>
      <Text style={[sh.chipText, { color: textColor }]}>{children}</Text>
    </View>
  );
}

function Card({
  color = T.paper,
  children,
  style,
}: {
  color?: string;
  children: React.ReactNode;
  style?: object;
}) {
  return (
    <View style={[sh.card, { backgroundColor: color }, style]}>
      {children}
    </View>
  );
}

function InkButton({
  children,
  onPress,
  disabled,
  color = T.ink,
  textColor = '#fff',
}: {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  textColor?: string;
}) {
  return (
    <TouchableOpacity
      style={[sh.inkBtn, { backgroundColor: color }, disabled && sh.inkBtnDisabled]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.85}
    >
      <Text style={[sh.inkBtnText, { color: textColor }]}>{children}</Text>
    </TouchableOpacity>
  );
}

function Sticker({
  color,
  rotation,
  children,
  textColor = T.ink,
}: {
  color: string;
  rotation: number;
  children: string;
  textColor?: string;
}) {
  return (
    <View
      style={[sh.sticker, { backgroundColor: color, transform: [{ rotate: `${rotation}deg` }] }]}
    >
      <Text style={[sh.stickerText, { color: textColor }]}>{children}</Text>
    </View>
  );
}

function Avatar({
  playerIdx,
  size = 44,
  radius = 12,
  borderColor = T.ink,
  shadowColor = CASTING_ORANGE,
}: {
  playerIdx: number;
  size?: number;
  radius?: number;
  borderColor?: string;
  shadowColor?: string;
}) {
  const letter = String.fromCharCode(65 + (playerIdx % 26));
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: playerBg(playerIdx),
        borderWidth: 2,
        borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor,
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
      }}
    >
      <Text style={{ color: avatarTextColor(playerIdx), fontSize: size * 0.4, fontWeight: '900' }}>
        {letter}
      </Text>
    </View>
  );
}

const sh = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    shadowColor: T.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  chipText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  card: {
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
  inkBtn: {
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: T.paper,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  inkBtnDisabled: { opacity: 0.35 },
  inkBtnText: { fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
  sticker: {
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    alignSelf: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  stickerText: { fontSize: 13, fontWeight: '900', letterSpacing: 1 },
});

// ─── Rules ────────────────────────────────────────────────────────────────────

function CARules({
  onStart,
  onExit,
  onSettings,
}: {
  onStart: () => void;
  onExit: () => void;
  onSettings: () => void;
}) {
  const STEPS = [
    { n: '1', t: 'Un devin est désigné', d: 'Il observe. Les autres sont les acteurs.' },
    {
      n: '2',
      t: 'Chaque acteur reçoit un chiffre secret',
      d: 'De 1 (catastrophique) à 10 (oscar). Le devin ne sait pas.',
    },
    {
      n: '3',
      t: 'Le devin lit un scénario',
      d: "Exemple : « Trébucher à la cantine avec son plateau ».",
    },
    {
      n: '4',
      t: 'Chacun joue la scène',
      d: 'Selon son chiffre : 1 = nul à mourir, 10 = performance de dingue.',
    },
    {
      n: '5',
      t: 'Le devin devine les chiffres',
      d: "Il attribue un chiffre à chaque acteur. Plus il se trompe, plus il boit.",
    },
  ];

  const DRINKS = [
    { icon: '🎯', label: 'Pile poil (écart 0)', result: "l'acteur boit 3 (trop évident !)" },
    { icon: '👀', label: 'Presque (écart 1)', result: "l'acteur boit 1" },
    { icon: '💀', label: 'Raté (écart ≥2)', result: "l'acteur boit l'écart" },
  ];

  const rulesModal = STEPS.map((s) => ({ n: s.n, title: s.t, desc: s.d }));

  return (
    <SafeAreaView style={rls.screen}>
      <DotBackground color={T.ink} opacity={0.08} />

      <View style={rls.header}>
        <TouchableOpacity style={rls.backBtn} onPress={onExit} activeOpacity={0.85}>
          <Text style={rls.backBtnText}>←</Text>
        </TouchableOpacity>
        <GameMenuActions
          showDice={false}
          onPressSettings={onSettings}
          rules={{ rules: rulesModal, title: 'Le Casting', accentColor: CASTING_ORANGE }}
        />
      </View>

      <View style={rls.titleArea}>
        <View style={rls.iconWrap}>
          <CastingIcon size={88} />
        </View>
        <Chip color={T.paper}>Jeu n°7</Chip>
        <Text style={rls.title}>Le{'\n'}Casting</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={rls.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <Text style={rls.cardLabel}>COMMENT ON JOUE</Text>
          {STEPS.map((s, i) => (
            <View
              key={s.n}
              style={[rls.ruleRow, i < STEPS.length - 1 && rls.ruleRowDivider]}
            >
              <View style={rls.ruleNum}>
                <Text style={rls.ruleNumText}>{s.n}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={rls.ruleTitle}>{s.t}</Text>
                <Text style={rls.ruleDesc}>{s.d}</Text>
              </View>
            </View>
          ))}
        </Card>

        <View style={rls.drinkCard}>
          <Text style={rls.drinkLabel}>GORGÉES</Text>
          {DRINKS.map((d) => (
            <View key={d.icon} style={rls.drinkRow}>
              <Text style={rls.drinkIcon}>{d.icon}</Text>
              <Text style={rls.drinkName}>{d.label}</Text>
              <Text style={rls.drinkResult}>→ {d.result}</Text>
            </View>
          ))}
        </View>

        <InkButton onPress={onStart}>Lancer le casting</InkButton>
      </ScrollView>
    </SafeAreaView>
  );
}

const rls = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CASTING_ORANGE },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
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
  backBtnText: { fontSize: 20, color: T.ink, fontWeight: '900' },
  titleArea: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  iconWrap: { position: 'absolute', right: 16, top: 20, transform: [{ rotate: '8deg' }] },
  title: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -2.5,
    lineHeight: 58,
    marginTop: 10,
  },
  scroll: { padding: 20, gap: 14, paddingBottom: 40 },
  cardLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  ruleRow: { flexDirection: 'row', gap: 14, paddingVertical: 10 },
  ruleRowDivider: { borderBottomWidth: 1, borderBottomColor: `${T.muted}55` },
  ruleNum: {
    width: 32,
    height: 32,
    borderRadius: 10,
    flexShrink: 0,
    backgroundColor: CASTING_ORANGE,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleNumText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  ruleTitle: { color: T.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  ruleDesc: { color: T.inkSoft, fontSize: 13, marginTop: 2, lineHeight: 18 },
  drinkCard: {
    backgroundColor: T.lemon,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 20,
    padding: 16,
    gap: 6,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  drinkLabel: {
    color: T.ink,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  drinkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  drinkIcon: { fontSize: 15, width: 24, textAlign: 'center' },
  drinkName: { color: T.ink, fontSize: 13, fontWeight: '700', flex: 1 },
  drinkResult: { color: T.inkSoft, fontSize: 12 },
});

// ─── Pick Devin ───────────────────────────────────────────────────────────────

function CAPickDevin({
  players,
  onPick,
}: {
  players: Player[];
  onPick: (idx: number) => void;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.ink }}>
      <View style={pd.body}>
        <Text style={pd.mono}>QUI EST LE DEVIN ?</Text>
        <Text style={pd.title}>Choisis le{'\n'}jury du casting</Text>
        <Text style={pd.sub}>Le devin observe, juge, et devine les chiffres.</Text>

        <View style={pd.grid}>
          {players.map((p, i) => (
            <TouchableOpacity
              key={p.id}
              style={pd.playerBtn}
              onPress={() => onPick(i)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  pd.playerAvatar,
                  { backgroundColor: playerBg(i) },
                ]}
              >
                <Text style={[pd.playerAvatarText, { color: avatarTextColor(i) }]}>
                  {p.name[0].toUpperCase()}
                </Text>
              </View>
              <Text style={pd.playerName}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const pd = StyleSheet.create({
  body: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
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
    marginBottom: 32,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
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
    shadowColor: CASTING_ORANGE,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerAvatarText: { fontSize: 18, fontWeight: '900' },
  playerName: {
    color: T.ink,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    flex: 1,
  },
});

// ─── Scenario ─────────────────────────────────────────────────────────────────

function CAScenario({
  scenario,
  devin,
  onNext,
}: {
  scenario: string;
  devin: Player;
  onNext: () => void;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: CASTING_ORANGE }}>
      <DotBackground color={T.ink} opacity={0.07} />
      <View style={sc.header}>
        <Chip color={T.paper}>Le Devin · {devin.name}</Chip>
      </View>
      <View style={sc.body}>
        <Text style={sc.mono}>LE SCÉNARIO</Text>
        <Card style={{ padding: 28 }}>
          <Text style={sc.scenarioText}>« {scenario} »</Text>
        </Card>
        <Text style={sc.hint}>
          Lis ce scénario à voix haute.{'\n'}Ensuite, passe le tel à chaque acteur pour qu'il voie
          son chiffre.
        </Text>
      </View>
      <View style={sc.footer}>
        <InkButton onPress={onNext}>Distribuer les chiffres →</InkButton>
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.ink }}>
      <View style={hf.body}>
        <Text style={hf.counter}>{pos + 1} / {total}</Text>
        <Avatar playerIdx={playerIdx} size={120} radius={32} borderColor={T.paper} />
        <Text style={hf.name}>{player.name},{'\n'}passe au tel</Text>
        <Text style={hf.sub}>Regarde ton chiffre en secret avant d'appuyer.</Text>
      </View>
      <View style={hf.footer}>
        <InkButton onPress={onReady} color={CASTING_ORANGE} textColor="#fff">
          Je suis seul·e — révéler
        </InkButton>
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
  playerIdx,
  number,
  scenario,
  onNext,
}: {
  player: Player;
  playerIdx: number;
  number: number;
  scenario: string;
  onNext: () => void;
}) {
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
  const label = CASTING_LABELS[number] ?? '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <DotBackground opacity={0.05} />
      <View style={rn.header}>
        <Chip color={CASTING_ORANGE} textColor="#fff">
          {player.name}
        </Chip>
      </View>

      <View style={rn.body}>
        {!revealed ? (
          <View style={rn.holdWrap}>
            <Text style={rn.spotlight}>🎬</Text>
            <Text style={rn.holdTitle}>Maintiens pour{'\n'}voir ton chiffre</Text>
            <TouchableOpacity
              style={rn.holdBtn}
              onPressIn={handleReveal}
              activeOpacity={0.85}
            >
              <Text style={rn.holdBtnText}>HOLD</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={[rn.revealWrap, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[rn.numberCircle, { backgroundColor: numBg }]}>
              <Text style={[rn.numberText, { color: numFg }]}>{number}</Text>
              <Text style={[rn.numberSub, { color: numFg }]}>/10</Text>
            </View>

            <Sticker color={numBg} rotation={-4} textColor={numFg}>
              {label.toUpperCase()}
            </Sticker>

            <View style={rn.scenarioHint}>
              <Text style={rn.scenarioMono}>SCÉNARIO</Text>
              <Text style={rn.scenarioText}>« {scenario} »</Text>
            </View>

            <View style={rn.scaleTip}>
              <Text style={rn.scaleTipText}>1 = catastrophique · 10 = oscar</Text>
            </View>
          </Animated.View>
        )}
      </View>

      <View style={rn.footer}>
        <InkButton onPress={revealed ? onNext : undefined} disabled={!revealed}>
          J'ai vu — passer au suivant
        </InkButton>
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
          ACTION !
        </Animated.Text>

        <Card style={{ width: '100%', maxWidth: 320 }}>
          <Text style={pf.scenarioMono}>SCÉNARIO</Text>
          <Text style={pf.scenarioText}>« {scenario} »</Text>
        </Card>

        <View style={pf.actorsRow}>
          {actors.map((a, i) => (
            <Chip
              key={a.id}
              color={playerBg(actorIndices[i])}
              textColor={avatarTextColor(actorIndices[i])}
            >
              {a.name}
            </Chip>
          ))}
        </View>

        <Text style={pf.hint}>
          Chaque acteur joue la scène selon son chiffre.{'\n'}
          <Text style={{ color: CASTING_ORANGE, fontWeight: '800' }}>{devin.name}</Text> observe
          attentivement.
        </Text>
      </View>
      <View style={pf.footer}>
        <InkButton onPress={onNext} color={CASTING_ORANGE} textColor="#fff">
          Tout le monde a joué → Jugement
        </InkButton>
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
}: {
  actor: Player;
  actorIdx: number;
  devin: Player;
  pos: number;
  total: number;
  usedNums: number[];
  onGuess: (num: number) => void;
}) {
  const [guess, setGuess] = useState<number | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      <DotBackground opacity={0.06} />
      <View style={gp.header}>
        <Chip color={CASTING_ORANGE} textColor="#fff">
          Devin · {devin.name}
        </Chip>
        <Chip color={T.paper}>{pos + 1}/{total}</Chip>
      </View>

      <View style={gp.body}>
        <Avatar playerIdx={actorIdx} size={88} radius={24} />
        <Text style={gp.question}>
          Quel chiffre avait{'\n'}{actor.name} ?
        </Text>
        {guess !== null && (
          <Text style={gp.guessLabel}>{CASTING_LABELS[guess].toUpperCase()}</Text>
        )}

        <View style={gp.grid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
            const isUsed = usedNums.includes(n);
            const isSelected = guess === n;
            return (
              <TouchableOpacity
                key={n}
                style={[
                  gp.numBtn,
                  isSelected && gp.numBtnSelected,
                  isUsed && gp.numBtnUsed,
                ]}
                onPress={() => !isUsed && setGuess(n)}
                activeOpacity={isUsed ? 1 : 0.8}
              >
                <Text style={[gp.numText, isSelected && { color: '#fff' }, isUsed && { color: T.muted }]}>{n}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={gp.footer}>
        <InkButton onPress={guess !== null ? () => onGuess(guess!) : undefined} disabled={guess === null}>
          {pos + 1 < total ? 'Joueur suivant →' : 'Voir le verdict →'}
        </InkButton>
      </View>
    </SafeAreaView>
  );
}

const gp = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  const devin = players[devinIdx];

  const results: (CastingResult & { player: Player; playerIdx: number })[] = actors.map(
    (a, i) => {
      const pIdx = actorIndices[i];
      const real = numbers[pIdx];
      const guess = guesses[pIdx];
      const ecart = Math.abs(real - guess);
      let playerSips = 0;
      let devinSips = 0;
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
    },
  );

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
        <Sticker color={CASTING_ORANGE} rotation={-3} textColor="#fff">
          LE VERDICT
        </Sticker>
        <Text style={res.title}>Les résultats{'\n'}du casting</Text>

        {/* Stats */}
        <View style={res.statsRow}>
          <View style={[res.statCard, { backgroundColor: T.mint }]}>
            <Text style={[res.statLabel, { color: '#fff' }]}>PILE POIL</Text>
            <Text style={[res.statVal, { color: '#fff' }]}>{pilePoilCount}</Text>
          </View>
          <View style={[res.statCard, { backgroundColor: T.lemon }]}>
            <Text style={[res.statLabel, { color: T.ink }]}>PRESQUE</Text>
            <Text style={[res.statVal, { color: T.ink }]}>
              {results.filter((r) => r.ecart === 1).length}
            </Text>
          </View>
          <View style={[res.statCard, { backgroundColor: T.tomato }]}>
            <Text style={[res.statLabel, { color: '#fff' }]}>RATÉS</Text>
            <Text style={[res.statVal, { color: '#fff' }]}>
              {results.filter((r) => r.ecart >= 2).length}
            </Text>
          </View>
        </View>

        {/* Bonus */}
        {(hasCastingParfait || hasFlop) && (
          <View
            style={[res.bonusCard, { backgroundColor: hasCastingParfait ? T.mint : T.tomato }]}
          >
            <Text style={res.bonusIcon}>{hasCastingParfait ? '🎬' : '💀'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={res.bonusTitle}>
                {hasCastingParfait ? 'Casting Parfait !' : 'Flop Total !'}
              </Text>
              <Text style={res.bonusSub}>
                {hasCastingParfait
                  ? `${devin.name} a tout deviné — les acteurs boivent 2 de plus (trop prévisibles !)`
                  : `Personne trouvé — les acteurs boivent 3 de plus (jeu trop chaotique !)`}
              </Text>
            </View>
          </View>
        )}

        {/* Per-actor breakdown */}
        <Text style={res.sectionLabel}>DÉTAIL PAR ACTEUR</Text>
        {results.map((r) => {
          const tc = tagColor(r.tag);
          const tagFg = r.tag === 'PRESQUE' ? T.ink : '#fff';
          return (
            <View key={r.playerIdx} style={res.actorCard}>
              <Avatar playerIdx={r.playerIdx} size={36} radius={10} shadowColor="transparent" />
              <View style={{ flex: 1 }}>
                <Text style={res.actorName}>{r.player.name}</Text>
                <View style={res.actorNums}>
                  <View style={res.numBadge}>
                    <Text style={res.numBadgeText}>{r.real}</Text>
                  </View>
                  <Text style={res.numMono}>RÉEL →</Text>
                  <View style={[res.numBadge, { backgroundColor: tc, borderColor: T.ink }]}>
                    <Text style={[res.numBadgeText, { color: tagFg }]}>{r.guess}</Text>
                  </View>
                  <Text style={res.numMono}>DEVINÉ</Text>
                </View>
              </View>
              <View style={res.tagWrap}>
                <View style={[res.tagBadge, { backgroundColor: tc }]}>
                  <Text style={[res.tagText, { color: tagFg }]}>{r.tag}</Text>
                </View>
                <Text style={res.drinkInfo}>
                  {r.player.name} boit {r.playerSips}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Scoreboard */}
        <Text style={res.sectionLabel}>CLASSEMENT · {totalSips} GORGÉES AU TOTAL</Text>
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
              <Avatar playerIdx={item.idx} size={34} radius={10} shadowColor="transparent" />
              <View style={{ flex: 1 }}>
                <Text style={[res.rankName, isTop && { color: '#fff' }]}>
                  {item.player.name}
                  {isDevinPlayer ? (
                    <Text style={res.devinBadge}> DEVIN</Text>
                  ) : null}
                </Text>
                <Text style={[res.rankSub, isTop && { color: 'rgba(255,255,255,0.7)' }]}>
                  {item.s === 0 ? 'SOBRE' : `${item.s} GORGÉE${item.s > 1 ? 'S' : ''}`}
                </Text>
              </View>
              <Text
                style={[
                  res.rankSips,
                  {
                    color: isTop
                      ? T.lemon
                      : item.s === 0
                        ? T.mint
                        : T.tomato,
                  },
                ]}
              >
                {item.s}
              </Text>
            </View>
          );
        })}

        {/* CTAs */}
        <InkButton onPress={onExit}>Rejouer</InkButton>
        <TouchableOpacity style={res.secondaryBtn} onPress={onExit} activeOpacity={0.85}>
          <Text style={res.secondaryBtnText}>Retour au hub</Text>
        </TouchableOpacity>
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
  secondaryBtn: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 2,
  },
  secondaryBtnText: { color: T.ink, fontSize: 15, fontWeight: '800' },
});

// ─── Orchestrator ─────────────────────────────────────────────────────────────

function CastingGame({ players, onExit, onSettings }: { players: Player[]; onExit: () => void; onSettings: () => void }) {
  const [step, setStep] = useState<CastingStep>('rules');
  const [devinIdx, setDevinIdx] = useState<number | null>(null);
  const [scenario, setScenario] = useState('');
  const [numbers, setNumbers] = useState<Record<number, number>>({});
  const [curPos, setCurPos] = useState(0);
  const [guessPos, setGuessPos] = useState(0);
  const [guesses, setGuesses] = useState<Record<number, number>>({});

  const { actors, actorIndices } = useMemo(() => {
    if (devinIdx === null) return { actors: [] as Player[], actorIndices: [] as number[] };
    const a: Player[] = [];
    const ai: number[] = [];
    players.forEach((p, i) => {
      if (i !== devinIdx) {
        a.push(p);
        ai.push(i);
      }
    });
    return { actors: a, actorIndices: ai };
  }, [devinIdx, players]);

  const pickDevin = (idx: number) => {
    setDevinIdx(idx);
    setScenario(pickRandom(CASTING_SCENARIOS));
    const nums: Record<number, number> = {};
    players.forEach((_, i) => {
      if (i !== idx) nums[i] = Math.floor(Math.random() * 10) + 1;
    });
    setNumbers(nums);
    setStep('scenario');
  };

  if (step === 'rules') {
    return <CARules onStart={() => setStep('pick-devin')} onExit={onExit} onSettings={onSettings} />;
  }

  if (step === 'pick-devin') {
    return <CAPickDevin players={players} onPick={pickDevin} />;
  }

  if (step === 'scenario' && devinIdx !== null) {
    return (
      <CAScenario
        scenario={scenario}
        devin={players[devinIdx]}
        onNext={() => { setCurPos(0); setStep('handoff'); }}
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
        onNext={() => {
          if (curPos + 1 < actors.length) {
            setCurPos(curPos + 1);
            setStep('handoff');
          } else {
            setStep('perform');
          }
        }}
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
        onNext={() => { setGuessPos(0); setStep('guess'); }}
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
        onGuess={(num) => {
          const ng = { ...guesses, [actorIdx]: num };
          setGuesses(ng);
          if (guessPos + 1 < actors.length) {
            setGuessPos(guessPos + 1);
          } else {
            setStep('results');
          }
        }}
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
