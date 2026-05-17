// L'Apéro — card guessing drinking game
// Flow: rules → pick dealer → rounds (guess1 → hint → guess2 → reveal) → dealer-pass / quad-flip → end
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CardCrosshatch,
  DotBackground,
  GameCard,
  GameChip,
  GameMenuActions,
  InkButton,
  isRedSuit,
  PlayingCardBack,
  PlayingCardFace,
  StickerBadge,
} from '../components';
import { AperoIcon } from '../components/icons/AperoIcon';
import { getPlayerBgColor, getPlayerTextColor } from '../constants';
import { T } from '../constants/flipTokens';
import { Player, RootStackParamList } from '../types';

type AperoScreenRouteProp = RouteProp<RootStackParamList, 'Apero'>;

// ─── Card constants ───────────────────────────────────────────────────────────

const AP_VALS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'V', 'D', 'R', 'A'] as const;
type ApVal = (typeof AP_VALS)[number];

const AP_PTS: Record<ApVal, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  V: 11,
  D: 12,
  R: 13,
  A: 14,
};

const AP_SUITS = ['♠', '♥', '♦', '♣'] as const;
const AP_NAMES: Partial<Record<ApVal, string>> = { A: 'As', V: 'Valet', D: 'Dame', R: 'Roi' };

function apName(v: ApVal): string {
  return AP_NAMES[v] ?? v;
}
const apIsRed = isRedSuit;

// ─── Types ────────────────────────────────────────────────────────────────────

type ApCard = { s: string; v: ApVal; p: number };
type PlayedCard = ApCard & { found: boolean; flipped: boolean };
type ApStep = 'rules' | 'pick' | 'play' | 'special' | 'dealer-win' | 'end';
type RoundPhase = 'g1' | 'hint' | 'g2' | 'result';

// ─── Full 52-card deck ────────────────────────────────────────────────────────

function apDeck(): ApCard[] {
  const cards: ApCard[] = [];
  for (const v of AP_VALS) {
    for (const s of AP_SUITS) {
      cards.push({ s, v, p: AP_PTS[v] });
    }
  }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

// ─── Player colors ────────────────────────────────────────────────────────────

function pBg(idx: number): string {
  return getPlayerBgColor(idx);
}
function pText(idx: number): string {
  return getPlayerTextColor(idx);
}

// ─── Bridge ───────────────────────────────────────────────────────────────────

const CW = 50;
const CH = 68;
const SOFF = 5;

const ROW1: ApVal[] = ['2', '3', '4', '5', '6', '7'];
const ROW2: ApVal[] = ['8', '9', '10', 'V', 'D', 'R', 'A'];

function APBridge({ cards }: { cards: PlayedCard[] }) {
  const groups: Record<string, PlayedCard[]> = {};
  for (const v of AP_VALS) groups[v] = [];
  cards.forEach((c) => groups[c.v].push(c));

  const renderSlot = (val: ApVal) => {
    const pile = groups[val];
    const slotH = CH + (pile.length > 1 ? (pile.length - 1) * SOFF : 0);
    return (
      <View key={val} style={{ width: CW, height: slotH, position: 'relative', flexShrink: 0 }}>
        {pile.length === 0 ? (
          <View style={br.emptySlot}>
            <Text style={br.emptySlotText}>{val}</Text>
          </View>
        ) : (
          pile.map((c, i) => {
            const red = apIsRed(c.s);
            const isFlipped = c.flipped;
            const isFound = c.found && !isFlipped;
            return (
              <View
                key={i}
                style={[
                  br.card,
                  { top: i * SOFF, zIndex: i },
                  isFlipped ? br.cardFlipped : isFound ? br.cardFound : br.cardNormal,
                ]}
              >
                {isFlipped && <CardCrosshatch width={CW} height={CH} />}
                {!isFlipped && (
                  <>
                    <Text style={[br.cardVal, { color: red ? T.tomato : T.ink }]}>{c.v}</Text>
                    <Text style={[br.cardSuit, { color: red ? T.tomato : T.ink }]}>{c.s}</Text>
                  </>
                )}
              </View>
            );
          })
        )}
      </View>
    );
  };

  return (
    <View style={br.wrap}>
      <Text style={br.label}>
        TRAVERSÉE · {cards.length} CARTE{cards.length > 1 ? 'S' : ''}
      </Text>
      <View style={br.row}>{ROW1.map(renderSlot)}</View>
      <View style={[br.row, { marginTop: 4 }]}>{ROW2.map(renderSlot)}</View>
    </View>
  );
}

const br = StyleSheet.create({
  wrap: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: T.bgAlt,
    borderBottomWidth: 1,
    borderBottomColor: `${T.ink}20`,
  },
  label: { color: T.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginBottom: 5 },
  row: { flexDirection: 'row', gap: 3, justifyContent: 'center' },
  emptySlot: {
    width: CW,
    height: CH,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: `${T.muted}50`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotText: { color: T.muted, fontSize: 13, fontWeight: '700', opacity: 0.4 },
  card: {
    position: 'absolute',
    left: 0,
    overflow: 'hidden',
    width: CW,
    height: CH,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  cardNormal: {
    backgroundColor: T.paper,
    borderColor: T.ink,
    shadowColor: T.ink,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
  },
  // Found: solid cream background, mint border — no transparency
  cardFound: { backgroundColor: T.paper, borderColor: T.mint, borderWidth: 2 },
  cardFlipped: { backgroundColor: T.pink, borderColor: T.pink },
  cardVal: { fontSize: 19, fontWeight: '900', lineHeight: 21 },
  cardSuit: { fontSize: 15, lineHeight: 16, marginTop: 1 },
});

// ─── Value picker ─────────────────────────────────────────────────────────────

// Same row split as the bridge so A always sits right of R
const VP_ROW1: ApVal[] = ['2', '3', '4', '5', '6', '7'];
const VP_ROW2: ApVal[] = ['8', '9', '10', 'V', 'D', 'R', 'A'];

function APValuePicker({
  onPick,
  disabled = [],
}: {
  onPick: (v: ApVal) => void;
  disabled?: ApVal[];
}) {
  const renderBtn = (v: ApVal) => {
    const dis = disabled.includes(v);
    return (
      <TouchableOpacity
        key={v}
        onPress={() => !dis && onPick(v)}
        activeOpacity={dis ? 1 : 0.75}
        style={[vp.btn, dis && vp.btnDis]}
      >
        <Text style={[vp.btnText, dis && vp.btnDisText, v === '10' && vp.btnText10]}>{v}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={vp.wrap}>
      <View style={vp.row}>{VP_ROW1.map(renderBtn)}</View>
      <View style={vp.row}>{VP_ROW2.map(renderBtn)}</View>
    </View>
  );
}

const vp = StyleSheet.create({
  wrap: { alignSelf: 'center', gap: 5 },
  row: { flexDirection: 'row', gap: 5, justifyContent: 'center' },
  btn: {
    width: 48,
    height: 58,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: T.ink,
    backgroundColor: T.paper,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  btnDis: { backgroundColor: T.bgAlt, shadowOpacity: 0, elevation: 0, opacity: 0.35 },
  btnText: { color: T.ink, fontSize: 19, fontWeight: '900' },
  btnText10: { fontSize: 15, letterSpacing: -1 },
  btnDisText: { color: T.muted },
});

// ─── Rules ────────────────────────────────────────────────────────────────────

function APRules({
  onStart,
  onExit,
  onSettings,
}: {
  onStart: () => void;
  onExit: () => void;
  onSettings: () => void;
}) {
  const RULES = [
    {
      n: '1',
      t: 'Le donneur pioche une carte',
      d: 'La carte reste cachée. Le joueur actif tente de la deviner.',
    },
    {
      n: '2',
      t: 'Premier essai — plus ou moins ?',
      d: "Le joueur dit un chiffre. L'app répond « c'est plus » ou « c'est moins ».",
    },
    {
      n: '3',
      t: 'Deuxième essai — dernière chance',
      d: 'Si raté, le joueur boit la différence entre sa réponse et la carte.',
    },
    {
      n: '4',
      t: 'Trouvé ? Le donneur trinque',
      d: 'Si un joueur trouve, le donneur boit 2 gorgées et sa série repart à zéro.',
    },
    {
      n: '5',
      t: '3 tours safe = le donneur passe',
      d: 'Si personne ne trouve en 3 tours, le donneur file le tel à un autre.',
    },
    {
      n: '★',
      t: 'Règle spéciale : le quadruplé',
      d: "Quand les 4 cartes d'une même valeur sont sorties, elles se retournent et le donneur boit 2 de plus.",
    },
  ];
  const rulesModal = RULES.map((r) => ({ n: r.n, title: r.t, desc: r.d }));

  return (
    <SafeAreaView style={rls.screen}>
      <DotBackground color={T.ink} opacity={0.1} />
      <View style={rls.header}>
        <TouchableOpacity style={rls.backBtn} onPress={onExit} activeOpacity={0.85}>
          <Text style={rls.backBtnText}>←</Text>
        </TouchableOpacity>
        <GameMenuActions
          showDice={false}
          onPressSettings={onSettings}
          rules={{ rules: rulesModal, title: "L'Apéro", accentColor: T.pink }}
        />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={rls.titleArea}>
          <View style={rls.iconWrap}>
            <AperoIcon size={92} />
          </View>
          <GameChip color={T.paper} textStyle={{ fontSize: 11 }}>
            Jeu n°6
          </GameChip>
          <Text style={rls.title}>L'Apéro</Text>
        </View>

        <View style={rls.cardWrap}>
          <GameCard style={{ borderRadius: 22, padding: 18 }}>
            <Text style={rls.cardLabel}>COMMENT ON JOUE</Text>
            {RULES.map((s, i) => (
              <View key={s.n} style={[rls.ruleRow, i < RULES.length - 1 && rls.divider]}>
                <View style={[rls.ruleNum, { backgroundColor: s.n === '★' ? T.lemon : T.pink }]}>
                  <Text style={[rls.ruleNumText, { color: s.n === '★' ? T.ink : '#fff' }]}>
                    {s.n}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={rls.ruleTitle}>{s.t}</Text>
                  <Text style={rls.ruleDesc}>{s.d}</Text>
                </View>
              </View>
            ))}
          </GameCard>
        </View>

        <View style={rls.footer}>
          <InkButton onPress={onStart}>Distribuer les cartes</InkButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const rls = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.pink },
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
  titleArea: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  iconWrap: { position: 'absolute', right: 16, top: 16, transform: [{ rotate: '-8deg' }] },
  title: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -2.5,
    lineHeight: 60,
    marginTop: 12,
  },
  cardWrap: { paddingHorizontal: 20 },
  cardLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  ruleRow: { flexDirection: 'row', gap: 12, paddingVertical: 9 },
  divider: { borderBottomWidth: 1, borderBottomColor: `${T.muted}40` },
  ruleNum: {
    width: 30,
    height: 30,
    borderRadius: 9,
    flexShrink: 0,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleNumText: { fontSize: 14, fontWeight: '900' },
  ruleTitle: { color: T.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  ruleDesc: { color: T.inkSoft, fontSize: 13, marginTop: 2, lineHeight: 18 },
  footer: { padding: 20, paddingTop: 24 },
});

// ─── Pick dealer ──────────────────────────────────────────────────────────────

function APPickDealer({ players, onPick }: { players: Player[]; onPick: (i: number) => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: T.ink }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={pk.center}>
          <StickerBadge color={T.pink} rotation={-4} textColor="#fff">
            QUI EST LE DONNEUR ?
          </StickerBadge>
          <Text style={pk.title}>Choisis qui{'\n'}tient le tel</Text>
          <Text style={pk.sub}>Le donneur pioche et subit les conséquences.</Text>
        </View>
        <View style={pk.grid}>
          {players.map((p, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => onPick(i)}
              activeOpacity={0.85}
              style={pk.playerBtn}
            >
              <View style={[pk.avatar, { backgroundColor: pBg(i) }]}>
                <Text style={[pk.avatarText, { color: pText(i) }]}>{p.name[0].toUpperCase()}</Text>
              </View>
              <Text style={pk.name} numberOfLines={1}>
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const pk = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 42,
    textAlign: 'center',
  },
  sub: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 20, paddingBottom: 32 },
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
    shadowColor: T.pink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    flexShrink: 0,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '900' },
  name: { flex: 1, fontSize: 16, fontWeight: '800', color: T.ink, letterSpacing: -0.3 },
});

// ─── Main round ───────────────────────────────────────────────────────────────

function APRound({
  card,
  guesser,
  dealer,
  exhaustedVals,
  streak,
  cardNum,
  total,
  onDone,
  onRequestPass,
}: {
  card: ApCard;
  guesser: Player;
  dealer: Player;
  exhaustedVals: ApVal[];
  streak: number;
  cardNum: number;
  total: number;
  onDone: (found: boolean, penalty: number) => void;
  onRequestPass: () => void;
}) {
  const [phase, setPhase] = useState<RoundPhase>('g1');
  const [g1, setG1] = useState<ApVal | null>(null);
  const [g2, setG2] = useState<ApVal | null>(null);

  // ── Animations ──
  // Card scale (apPop on reveal) + shake (apShake on hint)
  const cardScale = useRef(new Animated.Value(1)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  // Content entry: translate+opacity for slide, scale+opacity for pop
  const entryOpacity = useRef(new Animated.Value(0)).current;
  const entryTranslateY = useRef(new Animated.Value(18)).current;
  const entryScale = useRef(new Animated.Value(0.4)).current;
  // Pulse on card back while waiting
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);

  const startSlide = () => {
    entryTranslateY.setValue(18);
    entryOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(entryTranslateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(entryOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  };

  const startPop = (delay = 0) => {
    entryScale.setValue(0.4);
    entryOpacity.setValue(0);
    const anim = Animated.parallel([
      Animated.spring(entryScale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      Animated.timing(entryOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]);
    if (delay) setTimeout(() => anim.start(), delay);
    else anim.start();
  };

  useEffect(() => {
    // Stop pulse when phase changes
    pulseRef.current?.stop();
    pulseScale.setValue(1);

    switch (phase) {
      case 'g1': {
        startSlide();
        // Start pulse loop
        pulseRef.current = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseScale, {
              toValue: 1.06,
              duration: 800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseScale, {
              toValue: 1,
              duration: 800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        );
        pulseRef.current.start();
        break;
      }
      case 'hint': {
        // Shake card
        Animated.sequence([
          Animated.timing(shakeX, { toValue: -8, duration: 70, useNativeDriver: true }),
          Animated.timing(shakeX, { toValue: 8, duration: 70, useNativeDriver: true }),
          Animated.timing(shakeX, { toValue: -6, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeX, { toValue: 6, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeX, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
        // Pop hint badge
        startPop();
        break;
      }
      case 'g2': {
        startSlide();
        // Resume pulse
        pulseRef.current = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseScale, {
              toValue: 1.06,
              duration: 800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseScale, {
              toValue: 1,
              duration: 800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        );
        pulseRef.current.start();
        break;
      }
      case 'result': {
        // Pop the revealed card
        cardScale.setValue(0.4);
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 5,
          tension: 120,
          useNativeDriver: true,
        }).start();
        // Pop the result content with a slight delay
        startPop(80);
        break;
      }
    }
    return () => {
      pulseRef.current?.stop();
    };
  }, [phase]);

  const doG1 = (val: ApVal) => {
    setG1(val);
    if (AP_PTS[val] === card.p) setPhase('result');
    else {
      setPhase('hint');
      setTimeout(() => setPhase('g2'), 1600);
    }
  };
  const doG2 = (val: ApVal) => {
    setG2(val);
    setPhase('result');
  };

  const found = (g1 !== null && AP_PTS[g1] === card.p) || (g2 !== null && AP_PTS[g2] === card.p);
  const hint = g1 ? (card.p > AP_PTS[g1] ? 'plus' : 'moins') : null;
  const finalGuess = g2 ?? g1;
  const penalty = finalGuess && !found ? Math.abs(AP_PTS[finalGuess] - card.p) : 0;
  // Content animation style: slide for g1/g2, pop for hint/result
  const isSlidePhase = phase === 'g1' || phase === 'g2';
  const contentAnimStyle = isSlidePhase
    ? { opacity: entryOpacity, transform: [{ translateY: entryTranslateY }] }
    : { opacity: entryOpacity, transform: [{ scale: entryScale }] };

  return (
    <>
      {/* Centered game area */}
      <View style={rd.gameArea}>
        {/* Card */}
        <Animated.View
          style={{
            transform: [
              { scale: phase === 'result' ? cardScale : pulseScale },
              { translateX: shakeX },
            ],
          }}
        >
          {phase === 'result' ? (
            <PlayingCardFace value={card.v} suit={card.s} shadowColor={found ? T.mint : T.ink} />
          ) : (
            <PlayingCardBack />
          )}
        </Animated.View>

        {/* Phase content */}
        <Animated.View style={[rd.phaseWrap, contentAnimStyle]}>
          {phase === 'g1' && (
            <View style={{ alignItems: 'center', gap: 8, width: '100%' }}>
              <Text style={rd.phaseTitle}>{guesser.name}, devine la carte</Text>
              <Text style={rd.phaseSub}>Premier essai</Text>
              <APValuePicker onPick={doG1} disabled={exhaustedVals} />
            </View>
          )}

          {phase === 'hint' && hint && (
            <View style={{ alignItems: 'center', gap: 10 }}>
              <View
                style={[rd.hintBadge, { backgroundColor: hint === 'plus' ? T.tomato : T.cobalt }]}
              >
                <Text style={rd.hintText}>
                  C'est {hint} {hint === 'plus' ? '↑' : '↓'}
                </Text>
              </View>
              <Text style={rd.phaseSub}>
                Tu as dit {apName(g1!)} ({AP_PTS[g1!]} pts)
              </Text>
            </View>
          )}

          {phase === 'g2' && hint && (
            <View style={{ alignItems: 'center', gap: 8, width: '100%' }}>
              <GameChip
                color={hint === 'plus' ? T.tomato : T.cobalt}
                textColor="#fff"
                style={{ alignSelf: 'center' }}
                textStyle={{ fontSize: 11 }}
              >
                C'est {hint} que {apName(g1!)}
              </GameChip>
              <Text style={rd.phaseTitle}>Deuxième chance !</Text>
              <Text style={rd.phaseSub}>Dernier essai, {guesser.name}</Text>
              <APValuePicker onPick={doG2} disabled={g1 ? [g1, ...exhaustedVals] : exhaustedVals} />
            </View>
          )}

          {phase === 'result' && (
            <View style={{ alignItems: 'center', gap: 8 }}>
              {found ? (
                <>
                  <StickerBadge color={T.mint} rotation={-4}>
                    TROUVÉ !
                  </StickerBadge>
                  <Text style={rd.resultTitle}>{dealer.name} boit 2 gorgées</Text>
                  <Text style={rd.phaseSub}>Série du donneur remise à zéro</Text>
                </>
              ) : (
                <>
                  <StickerBadge color={T.tomato} rotation={4} textColor="#fff">
                    RATÉ !
                  </StickerBadge>
                  <Text style={rd.resultTitle}>
                    {guesser.name} boit {penalty} gorgée{penalty > 1 ? 's' : ''}
                  </Text>
                  {finalGuess && (
                    <Text style={rd.phaseMono}>
                      |{apName(finalGuess)} − {apName(card.v)}| = |{AP_PTS[finalGuess]} − {card.p}|
                      = {penalty}
                    </Text>
                  )}
                </>
              )}
            </View>
          )}
        </Animated.View>
      </View>

      {(phase === 'result' || streak >= 3) && (
        <View style={rd.footer}>
          {phase === 'result' && (
            <InkButton onPress={() => onDone(found, penalty)}>
              {cardNum >= total ? 'Voir le bilan →' : 'Carte suivante →'}
            </InkButton>
          )}
          {streak >= 3 && (
            <InkButton color={T.paper} textColor={T.ink} onPress={onRequestPass}>
              Donner le tas →
            </InkButton>
          )}
        </View>
      )}
    </>
  );
}

const rd = StyleSheet.create({
  // Flex-centered game area — fills remaining space and centers content vertically
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  phaseWrap: { alignItems: 'center', width: '100%' },
  phaseTitle: {
    color: T.ink,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  phaseSub: { color: T.muted, fontSize: 13, textAlign: 'center' },
  phaseMono: { color: T.muted, fontSize: 12, textAlign: 'center', fontVariant: ['tabular-nums'] },
  hintBadge: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: T.ink,
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  hintText: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  resultTitle: {
    color: T.ink,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  footer: { padding: 20, paddingBottom: 32, gap: 10 },
});

// ─── Quadruplé special flip ───────────────────────────────────────────────────

function APSpecialFlip({
  played,
  dealer,
  quadVal,
  onNext,
}: {
  played: PlayedCard[];
  dealer: Player;
  quadVal: ApVal;
  onNext: () => void;
}) {
  const popAnim = useRef(new Animated.Value(0.4)).current;
  const popOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(popAnim, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      Animated.timing(popOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: T.lemon }}>
      <SafeAreaView style={{ flex: 1 }}>
        <DotBackground color={T.ink} opacity={0.08} />
        <ScrollView contentContainerStyle={sf.center}>
          <Animated.View style={{ transform: [{ scale: popAnim }], opacity: popOpacity }}>
            <StickerBadge color={T.tomato} rotation={-6} textColor="#fff">
              ★ QUADRUPLÉ !
            </StickerBadge>
          </Animated.View>
          <Text style={sf.title}>
            Les 4 {apName(quadVal)}
            {'\n'}sont sortis !
          </Text>
          <Text style={sf.sub}>Les 4 cartes se retournent sur la traversée.</Text>
          <GameCard style={{ alignSelf: 'stretch', marginTop: 8, borderRadius: 22, padding: 18 }}>
            <Text style={sf.bonusText}>{dealer.name} boit 2 gorgées</Text>
            <Text style={sf.bonusSub}>Pénalité du quadruplé</Text>
          </GameCard>
          <View style={{ alignSelf: 'stretch', marginTop: 16 }}>
            <APBridge cards={played} />
          </View>
        </ScrollView>
        <View style={sf.footer}>
          <InkButton onPress={onNext}>Continuer →</InkButton>
        </View>
      </SafeAreaView>
    </View>
  );
}

const sf = StyleSheet.create({
  center: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    gap: 12,
  },
  title: {
    color: T.ink,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 44,
    textAlign: 'center',
    marginTop: 16,
  },
  sub: { color: T.inkSoft, fontSize: 16, textAlign: 'center', maxWidth: 280 },
  bonusText: { color: T.tomato, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  bonusSub: { color: T.muted, fontSize: 13, marginTop: 4, textAlign: 'center' },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Dealer pass ──────────────────────────────────────────────────────────────

function APDealerPass({
  dealer,
  players,
  dealerIdx,
  onPass,
}: {
  dealer: Player;
  players: Player[];
  dealerIdx: number;
  onPass: (i: number) => void;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: T.mint }}>
      <SafeAreaView style={{ flex: 1 }}>
        <DotBackground color={T.ink} opacity={0.08} />
        <View style={dp.header}>
          <StickerBadge color={T.paper} rotation={-6}>
            DONNER LE TAS
          </StickerBadge>
          <Text style={dp.title}>
            {dealer.name}
            {'\n'}passe la main
          </Text>
          <Text style={dp.sub}>Choisis à qui passer le tas.</Text>
        </View>
        <View style={dp.grid}>
          {players.map(
            (p, i) =>
              i !== dealerIdx && (
                <TouchableOpacity
                  key={i}
                  onPress={() => onPass(i)}
                  activeOpacity={0.85}
                  style={dp.playerBtn}
                >
                  <View style={[dp.avatar, { backgroundColor: pBg(i) }]}>
                    <Text style={[dp.avatarText, { color: pText(i) }]}>
                      {p.name[0].toUpperCase()}
                    </Text>
                  </View>
                  <Text style={dp.name} numberOfLines={1}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ),
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const dp = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: T.ink,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 42,
    textAlign: 'center',
  },
  sub: { color: T.inkSoft, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 32,
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    flexShrink: 0,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '900' },
  name: { flex: 1, fontSize: 16, fontWeight: '800', color: T.ink, letterSpacing: -0.3 },
});

// ─── End screen ───────────────────────────────────────────────────────────────

function APEnd({
  players,
  sips,
  played,
  foundTotal,
  onExit,
}: {
  players: Player[];
  sips: number[];
  played: PlayedCard[];
  foundTotal: number;
  onExit: () => void;
}) {
  const ranked = players.map((p, i) => ({ ...p, idx: i, s: sips[i] })).sort((a, b) => b.s - a.s);
  const totalSips = sips.reduce((a, b) => a + b, 0);

  return (
    <SafeAreaView style={en.screen}>
      <DotBackground opacity={0.06} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={en.header}>
          <StickerBadge color={T.pink} rotation={-4} textColor="#fff">
            FIN DE PARTIE
          </StickerBadge>
          <Text style={en.title}>Le bilan{'\n'}de l'apéro</Text>
        </View>

        <View style={en.statsRow}>
          {[
            { label: 'CARTES', val: played.length, bg: T.pink },
            { label: 'TROUVÉES', val: foundTotal, bg: T.mint },
            { label: 'GORGÉES', val: totalSips, bg: T.tomato },
          ].map((s) => (
            <View key={s.label} style={[en.statCard, { backgroundColor: s.bg }]}>
              <Text style={en.statLabel}>{s.label}</Text>
              <Text style={en.statVal}>{s.val}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginHorizontal: 6, marginBottom: 14 }}>
          <APBridge cards={played} />
        </View>

        <View style={en.rankWrap}>
          <Text style={en.rankLabel}>CLASSEMENT</Text>
          <View style={{ gap: 8 }}>
            {ranked.map((p, i) => {
              const isTop = i === 0 && p.s > 0;
              return (
                <View
                  key={p.idx}
                  style={[en.rankRow, { backgroundColor: isTop ? T.pink : T.paper }]}
                >
                  <View
                    style={[
                      en.rankNum,
                      {
                        backgroundColor: isTop ? 'rgba(255,255,255,0.25)' : T.bgAlt,
                        borderColor: isTop ? 'rgba(255,255,255,0.3)' : T.ink,
                      },
                    ]}
                  >
                    <Text style={[en.rankNumText, { color: isTop ? '#fff' : T.ink }]}>
                      #{i + 1}
                    </Text>
                  </View>
                  <View
                    style={[
                      en.rankAvatar,
                      {
                        backgroundColor: pBg(p.idx),
                        borderColor: isTop ? 'rgba(255,255,255,0.4)' : T.ink,
                      },
                    ]}
                  >
                    <Text style={[en.rankAvatarText, { color: pText(p.idx) }]}>
                      {p.name[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[en.rankName, { color: isTop ? '#fff' : T.ink }]}>{p.name}</Text>
                    <Text
                      style={[en.rankSips, { color: isTop ? 'rgba(255,255,255,0.7)' : T.muted }]}
                    >
                      {p.s === 0 ? 'SOBRE' : `${p.s} GORGÉE${p.s > 1 ? 'S' : ''}`}
                    </Text>
                  </View>
                  <Text
                    style={[
                      en.rankScore,
                      {
                        color: isTop ? T.lemon : p.s === 0 ? T.mint : T.tomato,
                      },
                    ]}
                  >
                    {p.s}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          <InkButton onPress={onExit}>Rejouer</InkButton>
          <InkButton color={T.paper} textColor={T.ink} onPress={onExit}>
            Retour au hub
          </InkButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const en = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  header: { padding: 20, gap: 16 },
  title: {
    color: T.ink,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 44,
    marginTop: 4,
  },
  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: T.ink,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  statLabel: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 1, opacity: 0.85 },
  statVal: { color: '#fff', fontSize: 28, fontWeight: '900' },
  rankWrap: { paddingHorizontal: 20, marginBottom: 20 },
  rankLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: T.ink,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  rankNum: {
    width: 26,
    height: 26,
    borderRadius: 7,
    flexShrink: 0,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumText: { fontSize: 11, fontWeight: '800' },
  rankAvatar: {
    width: 34,
    height: 34,
    borderRadius: 10,
    flexShrink: 0,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankAvatarText: { fontSize: 15, fontWeight: '900' },
  rankName: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  rankSips: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  rankScore: { fontSize: 26, fontWeight: '900' },
});

const playTopBar = {
  paddingHorizontal: 14,
  paddingVertical: 6,
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  gap: 6,
};

// ─── Main state machine ───────────────────────────────────────────────────────

function AperoGame({ players, onExit }: { players: Player[]; onExit: () => void }) {
  const [step, setStep] = useState<ApStep>('rules');
  const [deck] = useState<ApCard[]>(() => apDeck());
  const [dealerIdx, setDealerIdx] = useState(0);
  const [cardPos, setCardPos] = useState(0);
  const [played, setPlayed] = useState<PlayedCard[]>([]);
  const [foundTotal, setFoundTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [rot, setRot] = useState(0);
  const [sips, setSips] = useState<number[]>(() => players.map(() => 0));
  const [lastQuad, setLastQuad] = useState<ApVal | null>(null);

  const guessers = React.useMemo(
    () => players.map((_, i) => i).filter((i) => i !== dealerIdx),
    [dealerIdx, players.length],
  );
  const curGuesserIdx = guessers.length > 0 ? guessers[rot % guessers.length] : 0;

  const advanceRound = (found: boolean, penalty: number) => {
    const card = deck[cardPos];
    const newPlayed: PlayedCard[] = [...played, { ...card, found, flipped: false }];
    const ns = [...sips];
    let nStreak = streak;
    let nFound = foundTotal;

    if (found) {
      ns[dealerIdx] += 2;
      nFound++;
      nStreak = 0;
    } else {
      ns[curGuesserIdx] += penalty;
      nStreak++;
    }

    const newCardPos = cardPos + 1;
    const newRot = rot + 1;

    // Quadruplé: all 4 cards of this value are now out — dealer drinks 2 extra
    const quadCount = newPlayed.filter((c) => c.v === card.v).length;
    if (quadCount === 4) {
      ns[dealerIdx] += 2;
      const withFlipped = newPlayed.map((c) => (c.v === card.v ? { ...c, flipped: true } : c));
      setSips([...ns]);
      setPlayed(withFlipped);
      setFoundTotal(nFound);
      setStreak(nStreak);
      setCardPos(newCardPos);
      setRot(newRot);
      setLastQuad(card.v);
      setStep('special');
      return;
    }

    setSips(ns);
    setPlayed(newPlayed);
    setFoundTotal(nFound);
    setStreak(nStreak);
    setCardPos(newCardPos);
    setRot(newRot);

    if (newCardPos >= deck.length) setStep('end');
  };

  if (step === 'rules') {
    return <APRules onStart={() => setStep('pick')} onExit={onExit} onSettings={() => { }} />;
  }

  if (step === 'pick') {
    return (
      <APPickDealer
        players={players}
        onPick={(i) => {
          setDealerIdx(i);
          setStep('play');
        }}
      />
    );
  }

  if (step === 'play') {
    if (cardPos >= deck.length) {
      setStep('end');
      return null;
    }

    const exhaustedVals = AP_VALS.filter((v) => {
      let count = 0;
      for (const c of played) {
        if (c.v === v) count++;
      }
      return count >= 4;
    });

    return (
      <View style={{ flex: 1, backgroundColor: T.bg }}>
        <SafeAreaView style={{ flex: 1 }}>
          <DotBackground opacity={0.04} />

          {/* Persistent header — never remounts */}
          <View style={playTopBar}>
            <GameChip color={T.pink} textColor="#fff" textStyle={{ fontSize: 11 }}>
              🃏 {players[dealerIdx].name}
            </GameChip>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <GameChip color={T.paper} textStyle={{ fontSize: 11 }}>
                {cardPos + 1}/{deck.length}
              </GameChip>
              <GameChip color={streak >= 3 ? T.lemon : T.paper} textStyle={{ fontSize: 11 }}>
                Série {streak}
              </GameChip>
            </View>
          </View>

          {/* Persistent bridge — never remounts */}
          <APBridge cards={played} />

          {/* Round content — remounts per card, only game area + footer */}
          <APRound
            key={cardPos}
            card={deck[cardPos]}
            guesser={players[curGuesserIdx]}
            dealer={players[dealerIdx]}
            exhaustedVals={exhaustedVals}
            streak={streak}
            cardNum={cardPos + 1}
            total={deck.length}
            onDone={advanceRound}
            onRequestPass={() => setStep('dealer-win')}
          />
        </SafeAreaView>
      </View>
    );
  }

  if (step === 'special' && lastQuad) {
    return (
      <APSpecialFlip
        played={played}
        dealer={players[dealerIdx]}
        quadVal={lastQuad}
        onNext={() => setStep(cardPos >= deck.length ? 'end' : 'play')}
      />
    );
  }

  if (step === 'dealer-win') {
    return (
      <APDealerPass
        dealer={players[dealerIdx]}
        players={players}
        dealerIdx={dealerIdx}
        onPass={(i) => {
          setDealerIdx(i);
          setStreak(0);
          setRot(0);
          setStep(cardPos >= deck.length ? 'end' : 'play');
        }}
      />
    );
  }

  if (step === 'end') {
    return (
      <APEnd
        players={players}
        sips={sips}
        played={played}
        foundTotal={foundTotal}
        onExit={onExit}
      />
    );
  }

  return null;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function AperoScreen() {
  const navigation = useNavigation();
  const route = useRoute<AperoScreenRouteProp>();
  const { players } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <AperoGame players={players} onExit={() => navigation.goBack()} />
    </View>
  );
}
