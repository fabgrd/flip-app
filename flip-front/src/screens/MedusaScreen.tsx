// Médusa — eye contact game
// Flow: rules → caller → countdown 3,2,1 MÉDUSA → report pairs → round results → next caller → end
import { Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
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
  GameRulesScreen,
  InitialAvatar,
  MedusaIcon,
  PlayersModal,
  StickerBadge,
} from '../components';
import { getPlayerBgColor, getPlayerTextColor } from '../constants';
import { T } from '../constants/flipTokens';
import { MedusaPair, MedusaRoundHistory, MedusaStep } from '../games/medusa';
import { useDrinksMode } from '../hooks';
import { Player, RootStackParamList } from '../types';
import { drinkUnit, drinkUnitLower } from '../utils/drinks';

type MedusaScreenRouteProp = RouteProp<RootStackParamList, 'Medusa'>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pBg(idx: number): string {
  return getPlayerBgColor(idx);
}
function pText(idx: number): string {
  return getPlayerTextColor(idx);
}

// ─── Rules ────────────────────────────────────────────────────────────────────

function MDRules({
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
  const { enabled: drinksEnabled } = useDrinksMode();
  const rulesSteps = [
    {
      n: '1',
      title: 'Tout le monde regarde en bas',
      desc: 'Le joueur actif dit « Regardez en bas ! » et le groupe obéit les yeux fermés.',
    },
    {
      n: '2',
      title: '3… 2… 1… MÉDUSA !',
      desc: 'Au signal, tout le monde lève la tête et fixe un autre joueur.',
    },
    {
      n: '3',
      title: 'Eye contact = pénalité',
      desc: drinksEnabled
        ? 'Si deux joueurs se regardent dans les yeux : 1 gorgée chacun.'
        : 'Si deux joueurs se regardent dans les yeux : 1 point chacun.',
    },
    {
      n: '4',
      title: 'Pas de contact = safe',
      desc: 'Si personne ne te fixe en retour, tu survis. Joueur suivant, à toi.',
    },
  ];

  return (
    <GameRulesScreen
      accentColor={T.cobalt}
      title="Médusa"
      tagline="Lève les yeux… et évite le regard"
      icon={<MedusaIcon size={86} />}
      rulesModal={{ rules: rulesSteps, title: 'Médusa' }}
      players={players}
      onPlayersChange={onPlayersChange}
      onExit={onExit}
      onSettings={onSettings}
      minPlayers={5}
      onStart={onStart}
      startLabel="Lancer la partie 🐍"
    >
      <View style={{ paddingHorizontal: 20, paddingBottom: 12, marginTop: 'auto' }}>
        <DrinkModeToggle accentColor={T.cobalt} />
      </View>
    </GameRulesScreen>
  );
}

// ─── Caller ───────────────────────────────────────────────────────────────────

function MDCaller({
  playerIdx,
  playerName,
  roundNum,
  totalRounds,
  onStart,
}: {
  playerIdx: number;
  playerName: string;
  roundNum: number;
  totalRounds: number;
  onStart: () => void;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: T.ink }}>
      <SafeAreaView style={cal.screen}>
        <View style={cal.center}>
          <View style={[cal.roundBadge]}>
            <Text style={cal.roundBadgeText}>
              TOUR {roundNum} / {totalRounds}
            </Text>
          </View>

          <InitialAvatar
            index={playerIdx}
            label={playerName[0].toUpperCase()}
            size={120}
            radius={32}
            borderColor={T.paper}
            shadowColor={T.cobalt}
            style={{ borderWidth: 3, shadowOffset: { width: 8, height: 8 }, elevation: 8 }}
          />

          <Text style={cal.name}>
            {playerName},{'\n'}c'est toi
          </Text>
          <Text style={cal.sub}>
            Dis à tout le monde :{'\n'}
            <Text style={cal.subAccent}>« Regardez en bas ! »</Text>
          </Text>
        </View>

        <View style={cal.footer}>
          <ChunkyButton
            full
            color={T.paper}
            shadowColor={T.cobalt}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onStart();
            }}
          >
            Tout le monde est prêt → Lancer
          </ChunkyButton>
        </View>
      </SafeAreaView>
    </View>
  );
}

const cal = StyleSheet.create({
  screen: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 22,
  },
  roundBadge: {
    backgroundColor: T.cobalt,
    borderWidth: 2,
    borderColor: T.cobalt,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    transform: [{ rotate: '-4deg' }],
  },
  roundBadgeText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: T.paper,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  avatarText: { fontSize: 56, fontWeight: '900' },
  name: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 44,
    textAlign: 'center',
  },
  sub: { color: 'rgba(255,255,255,0.7)', fontSize: 16, textAlign: 'center', lineHeight: 26 },
  subAccent: { color: T.lemon, fontSize: 18, fontWeight: '900' },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Countdown ────────────────────────────────────────────────────────────────

function MDCountdown({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<-1 | 0 | 1 | 2 | 3>(-1);
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => setPhase(0), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase >= 0 && phase < 3) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scaleAnim.setValue(0.3);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }).start();
      const t = setTimeout(() => setPhase((p) => (p + 1) as 0 | 1 | 2 | 3), 1100);
      return () => clearTimeout(t);
    }
    if (phase === 3) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scaleAnim.setValue(0.3);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();
      // Flash
      flashOpacity.setValue(0.65);
      Animated.timing(flashOpacity, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      const t = setTimeout(onDone, 2800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const NUM_COLORS = [T.paper, T.lemon, T.tomato];
  const bgColor = phase === 3 ? T.cobalt : T.ink;

  return (
    <View style={[cd.screen, { backgroundColor: bgColor }]}>
      <DotBackground color="#fff" opacity={phase === 3 ? 0.08 : 0.03} />

      {phase === -1 && <Text style={cd.intro}>Préparez-vous…</Text>}

      {phase >= 0 && phase < 3 && (
        <Animated.Text
          style={[cd.number, { color: NUM_COLORS[phase], transform: [{ scale: scaleAnim }] }]}
        >
          {['3', '2', '1'][phase]}
        </Animated.Text>
      )}

      {phase === 3 && (
        <Animated.View style={[cd.medusaWrap, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={cd.medusaText}>MÉDUSA !</Text>
          <Text style={cd.medusaSub}>Levez les yeux !</Text>
        </Animated.View>
      )}

      {/* White flash overlay */}
      <Animated.View style={[cd.flash, { opacity: flashOpacity }]} pointerEvents="none" />
    </View>
  );
}

const cd = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  intro: { color: '#fff', fontSize: 26, fontWeight: '800', opacity: 0.45, letterSpacing: -0.5 },
  number: { fontSize: 200, fontWeight: '900', lineHeight: 200, letterSpacing: -8 },
  medusaWrap: { alignItems: 'center' },
  medusaText: { color: '#fff', fontSize: 72, fontWeight: '900', letterSpacing: -3, lineHeight: 70 },
  medusaSub: { color: '#fff', fontSize: 20, fontWeight: '600', marginTop: 20, opacity: 0.85 },
  flash: { ...StyleSheet.absoluteFillObject, backgroundColor: '#fff' },
});

// ─── Report ───────────────────────────────────────────────────────────────────

function MDReport({
  players,
  callerName: _callerName,
  pairs,
  setPairs,
  onConfirm,
}: {
  players: Player[];
  callerName: string;
  pairs: MedusaPair[];
  setPairs: (p: MedusaPair[]) => void;
  onConfirm: () => void;
}) {
  const [selecting, setSelecting] = useState<number | null>(null);

  const toggle = (idx: number) => {
    if (selecting === null) {
      Haptics.selectionAsync();
      setSelecting(idx);
    } else if (selecting === idx) {
      Haptics.selectionAsync();
      setSelecting(null);
    } else {
      const exists = pairs.some(
        (p) => (p.a === selecting && p.b === idx) || (p.a === idx && p.b === selecting),
      );
      if (!exists) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setPairs([...pairs, { a: selecting, b: idx }]);
      }
      setSelecting(null);
    }
  };

  const removePair = (i: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPairs(pairs.filter((_, j) => j !== i));
  };

  return (
    <SafeAreaView style={rep.screen}>
      <DotBackground opacity={0.06} />

      <View style={rep.header}>
        <GameChip color={T.cobalt} textColor="#fff">
          Médusa · résolution
        </GameChip>
        <Text style={rep.title}>Qui s'est{'\n'}regardé ?</Text>
        <Text style={rep.sub}>Tapez deux joueurs qui ont croisé le regard.</Text>
      </View>

      {/* Player grid */}
      <View style={rep.grid}>
        {players.map((p, i) => {
          const isSel = selecting === i;
          return (
            <TouchableOpacity
              key={p.id}
              style={[rep.playerBtn, isSel && rep.playerBtnSel]}
              onPress={() => toggle(i)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  rep.playerAvatar,
                  { backgroundColor: isSel ? 'rgba(255,255,255,0.2)' : pBg(i) },
                ]}
              >
                <Text style={[rep.playerAvatarText, { color: isSel ? '#fff' : pText(i) }]}>
                  {p.name[0].toUpperCase()}
                </Text>
              </View>
              <Text style={[rep.playerName, { color: isSel ? '#fff' : T.ink }]}>{p.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selection hint */}
      {selecting !== null && (
        <View style={rep.hint}>
          <Text style={rep.hintText}>
            Tape le joueur qui a croisé le regard de{' '}
            <Text style={{ fontWeight: '900' }}>{players[selecting].name}</Text>
          </Text>
        </View>
      )}

      {/* Pairs list */}
      {pairs.length > 0 && (
        <View style={rep.pairsSection}>
          <Text style={rep.pairsLabel}>EYE CONTACTS · {pairs.length}</Text>
          {pairs.map((pair, i) => (
            <View key={i} style={rep.pairRow}>
              <View style={[rep.pairDot, { backgroundColor: pBg(pair.a) }]} />
              <Text style={rep.pairName}>{players[pair.a].name}</Text>
              <Text style={rep.pairArrow}>↔</Text>
              <Text style={rep.pairName}>{players[pair.b].name}</Text>
              <View style={[rep.pairDot, { backgroundColor: pBg(pair.b) }]} />
              <TouchableOpacity
                onPress={() => removePair(i)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={rep.pairRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={rep.footer}>
        {pairs.length > 0 ? (
          <ChunkyButton
            full
            color={T.tomato}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              onConfirm();
            }}
          >
            {`Confirmer · ${pairs.length} paire${pairs.length > 1 ? 's' : ''}`}
          </ChunkyButton>
        ) : (
          <ChunkyButton
            full
            color={T.ink}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              onConfirm();
            }}
          >
            Personne ne s'est regardé
          </ChunkyButton>
        )}
      </View>
    </SafeAreaView>
  );
}

const rep = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  header: { paddingHorizontal: 20, paddingTop: 14 },
  title: {
    color: T.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 36,
    marginTop: 14,
  },
  sub: { color: T.inkSoft, fontSize: 14, marginTop: 6, lineHeight: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20, paddingTop: 18 },
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
  playerBtnSel: {
    backgroundColor: T.cobalt,
    shadowOffset: { width: 0, height: 0 },
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  playerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  playerAvatarText: { fontSize: 14, fontWeight: '900' },
  playerName: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3, flex: 1 },
  hint: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: `${T.cobalt}18`,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: `${T.cobalt}40`,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  hintText: { color: T.cobalt, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  pairsSection: { paddingHorizontal: 20, paddingTop: 16 },
  pairsLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: `${T.tomato}12`,
    borderWidth: 1.5,
    borderColor: `${T.tomato}30`,
    borderRadius: 12,
    marginBottom: 6,
  },
  pairDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: T.ink,
    flexShrink: 0,
  },
  pairName: { color: T.ink, fontSize: 14, fontWeight: '800' },
  pairArrow: { color: T.tomato, fontSize: 13, fontWeight: '900' },
  pairRemove: { color: T.muted, fontSize: 14, marginLeft: 'auto' },
  footer: { padding: 20, paddingBottom: 32, marginTop: 'auto' },
});

// ─── Round Results ────────────────────────────────────────────────────────────

function MDResults({
  players,
  pairs,
  roundNum,
  totalRounds,
  onNext,
}: {
  players: Player[];
  pairs: MedusaPair[];
  roundNum: number;
  totalRounds: number;
  onNext: () => void;
}) {
  const hasCatches = pairs.length > 0;
  const caughtSet = new Set(pairs.flatMap(({ a, b }) => [a, b]));
  const { enabled: drinksEnabled } = useDrinksMode();
  const safePlayers = players.filter((_, i) => !caughtSet.has(i));
  const isLast = roundNum >= totalRounds;

  return (
    <SafeAreaView style={[res.screen, { backgroundColor: hasCatches ? T.tomato : T.mint }]}>
      <DotBackground color={T.ink} opacity={0.1} />

      <View style={res.top}>
        <StickerBadge color={T.paper} rotation={-6} textColor={T.ink}>
          {hasCatches ? 'CONTACT !' : 'TOUT LE MONDE EST SAFE'}
        </StickerBadge>
        <Text style={[res.verdict, { color: hasCatches ? '#fff' : T.ink }]}>
          {hasCatches ? 'Attrapés !' : 'Bien joué !'}
        </Text>
        <Text
          style={[res.verdictSub, { color: hasCatches ? 'rgba(255,255,255,0.85)' : T.inkSoft }]}
        >
          {hasCatches
            ? `${pairs.length} eye contact${pairs.length > 1 ? 's' : ''} ce tour`
            : 'Aucun eye contact. Impressionnant.'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={res.content} showsVerticalScrollIndicator={false}>
        {/* Caught pairs */}
        {pairs.map((pair, i) => (
          <GameCard key={i} style={{ padding: 14, borderRadius: 22 }}>
            <View style={res.pairRow}>
              <InitialAvatar index={pair.a} size={40} radius={12} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={res.pairNames}>
                  {players[pair.a].name} <Text style={{ color: T.tomato }}>↔</Text>{' '}
                  {players[pair.b].name}
                </Text>
                <Text style={res.pairPenalty}>
                  {drinkUnitLower(1, drinksEnabled).toUpperCase()} CHACUN
                </Text>
              </View>
              <InitialAvatar index={pair.b} size={40} radius={12} />
            </View>
          </GameCard>
        ))}

        {/* Safe players */}
        {safePlayers.length > 0 && (
          <View>
            <Text
              style={[res.safeLabel, { color: hasCatches ? 'rgba(255,255,255,0.7)' : T.muted }]}
            >
              SAFE CE TOUR
            </Text>
            <View style={res.safeRow}>
              {safePlayers.map((p, i) => (
                <GameChip key={i} color={T.paper}>
                  ✓ {p.name}
                </GameChip>
              ))}
            </View>
          </View>
        )}

        <ChunkyButton
          full
          color={T.paper}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onNext();
          }}
        >
          {isLast ? 'Voir le bilan final' : 'Tour suivant →'}
        </ChunkyButton>
      </ScrollView>
    </SafeAreaView>
  );
}

const res = StyleSheet.create({
  screen: { flex: 1 },
  top: { padding: 20, paddingTop: 32, alignItems: 'center', gap: 16 },
  verdict: { fontSize: 56, fontWeight: '900', letterSpacing: -2, lineHeight: 52 },
  verdictSub: { fontSize: 16 },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40, gap: 12 },
  pairRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pairNames: { color: T.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  pairPenalty: {
    color: T.tomato,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 3,
  },
  safeLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  safeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
});

// ─── End ──────────────────────────────────────────────────────────────────────

function MDEnd({
  players,
  penalties,
  history,
  onExit,
  onRestart,
}: {
  players: Player[];
  penalties: number[];
  history: MedusaRoundHistory[];
  onExit: () => void;
  onRestart: () => void;
}) {
  const totalContacts = history.reduce((s, r) => s + r.pairs.length, 0);
  const { enabled: drinksEnabled } = useDrinksMode();
  const ranked = players
    .map((p, i) => ({ p, idx: i, pen: penalties[i] }))
    .sort((a, b) => b.pen - a.pen);

  return (
    <SafeAreaView style={en.screen}>
      <DotBackground opacity={0.06} />

      <View style={en.hero}>
        <StickerBadge color={T.cobalt} rotation={-4} textColor="#fff">
          FIN DE PARTIE
        </StickerBadge>
        <Text style={en.title}>Le bilan{'\n'}des regards</Text>
      </View>

      <ScrollView contentContainerStyle={en.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={en.statsRow}>
          <GameCard color={T.cobalt} style={{ flex: 1, padding: 14, borderRadius: 22 }}>
            <Text style={en.statLabel}>TOURS JOUÉS</Text>
            <Text style={en.statValue}>{history.length}</Text>
          </GameCard>
          <GameCard color={T.tomato} style={{ flex: 1, padding: 14, borderRadius: 22 }}>
            <Text style={en.statLabel}>EYE CONTACTS</Text>
            <Text style={en.statValue}>{totalContacts}</Text>
          </GameCard>
        </View>

        {/* Ranking */}
        <Text style={en.sectionLabel}>CLASSEMENT</Text>
        {ranked.map(({ p, idx, pen }, i) => {
          const isTop = i === 0 && pen > 0;
          const isSafe = pen === 0;
          return (
            <View key={idx} style={[en.rankCard, { backgroundColor: isTop ? T.cobalt : T.paper }]}>
              <View
                style={[en.rankNum, { backgroundColor: isTop ? 'rgba(255,255,255,0.2)' : T.bgAlt }]}
              >
                <Text style={[en.rankNumText, { color: isTop ? '#fff' : T.ink }]}>#{i + 1}</Text>
              </View>
              <InitialAvatar index={idx} size={36} radius={10} />
              <View style={{ flex: 1 }}>
                <Text style={[en.rankName, { color: isTop ? '#fff' : T.ink }]}>{p.name}</Text>
                <Text style={[en.rankSub, { color: isTop ? 'rgba(255,255,255,0.7)' : T.muted }]}>
                  {isSafe ? 'INTOUCHABLE' : isTop ? 'LA MÉDUSE' : drinkUnit(pen, drinksEnabled)}
                </Text>
              </View>
              <Text style={[en.rankScore, { color: isTop ? T.lemon : isSafe ? T.mint : T.tomato }]}>
                {pen}
              </Text>
            </View>
          );
        })}

        {/* History */}
        <Text style={en.sectionLabel}>RÉCAP PAR TOUR</Text>
        {history.map((r, i) => (
          <View key={i} style={en.historyRow}>
            <View
              style={[en.historyBadge, { backgroundColor: r.pairs.length > 0 ? T.tomato : T.mint }]}
            >
              <Text style={en.historyBadgeText}>T{i + 1}</Text>
            </View>
            <Text style={en.historyText}>
              <Text style={{ fontWeight: '900', color: T.ink }}>{players[r.callerIdx].name}</Text>{' '}
              mène
              {r.pairs.length === 0
                ? ' · aucun contact'
                : ` · ${r.pairs.length} paire${r.pairs.length > 1 ? 's' : ''}`}
            </Text>
          </View>
        ))}

        <View style={{ gap: 10, marginTop: 8 }}>
          <ChunkyButton
            full
            color={T.cobalt}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              onRestart();
            }}
          >
            Rejouer
          </ChunkyButton>
          <ChunkyButton
            full
            color={T.paper}
            textColor={T.ink}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onExit();
            }}
          >
            Retour au hub
          </ChunkyButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const en = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  hero: { padding: 20, paddingBottom: 0, gap: 16, alignItems: 'flex-start' },
  title: { color: T.ink, fontSize: 44, fontWeight: '900', letterSpacing: -1.5, lineHeight: 46 },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40, gap: 10 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statLabel: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, opacity: 0.85 },
  statValue: { color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  sectionLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 18,
    padding: 12,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  rankNum: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumText: { fontSize: 12, fontWeight: '700' },
  rankName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  rankSub: { fontSize: 11, letterSpacing: 0.5, marginTop: 1 },
  rankScore: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 14,
    padding: 10,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  historyBadge: {
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  historyBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  historyText: { color: T.inkSoft, fontSize: 13, flex: 1 },
});

// ─── Main ─────────────────────────────────────────────────────────────────────

export function MedusaScreen() {
  const route = useRoute<MedusaScreenRouteProp>();
  const navigation = useNavigation();
  const [players, setPlayers] = useState<Player[]>(route.params.players as Player[]);

  const [step, setStep] = useState<MedusaStep>('rules');
  const [callerIdx, setCallerIdx] = useState(0);
  const [roundPairs, setRoundPairs] = useState<MedusaPair[]>([]);
  const [history, setHistory] = useState<MedusaRoundHistory[]>([]);
  const [penalties, setPenalties] = useState<number[]>(() => players.map(() => 0));

  const confirmRound = () => {
    const np = [...penalties];
    roundPairs.forEach(({ a, b }) => {
      np[a]++;
      np[b]++;
    });
    setPenalties(np);
    setHistory((h) => [...h, { callerIdx, pairs: [...roundPairs] }]);
    setRoundPairs([]);

    if (callerIdx + 1 >= players.length) {
      setStep('end');
    } else {
      setCallerIdx((c) => c + 1);
      setStep('caller');
    }
  };

  if (step === 'rules') {
    return (
      <MDRules
        players={players}
        onPlayersChange={setPlayers}
        onStart={() => setStep('caller')}
        onExit={() => (navigation as any).goBack()}
        onSettings={() => (navigation as any).navigate('Settings')}
      />
    );
  }
  if (step === 'caller') {
    return (
      <MDCaller
        playerIdx={callerIdx}
        playerName={players[callerIdx].name}
        roundNum={callerIdx + 1}
        totalRounds={players.length}
        onStart={() => setStep('countdown')}
      />
    );
  }
  if (step === 'countdown') {
    return <MDCountdown onDone={() => setStep('report')} />;
  }
  if (step === 'report') {
    return (
      <MDReport
        players={players}
        callerName={players[callerIdx].name}
        pairs={roundPairs}
        setPairs={setRoundPairs}
        onConfirm={() => setStep('results')}
      />
    );
  }
  if (step === 'results') {
    return (
      <MDResults
        players={players}
        pairs={roundPairs}
        roundNum={callerIdx + 1}
        totalRounds={players.length}
        onNext={confirmRound}
      />
    );
  }
  if (step === 'end') {
    return (
      <MDEnd
        players={players}
        penalties={penalties}
        history={history}
        onExit={() => (navigation as any).navigate('Home')}
        onRestart={() => {
          setStep('rules');
          setCallerIdx(0);
          setRoundPairs([]);
          setHistory([]);
          setPenalties(players.map(() => 0));
        }}
      />
    );
  }
  return null;
}
