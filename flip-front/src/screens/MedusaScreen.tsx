// Médusa — eye contact game
// Flow: rules → caller → countdown 3,2,1 MÉDUSA → report pairs → round results → next caller → end
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

import { DotBackground, GameMenuActions, MedusaIcon } from '../components';
import { T } from '../constants/flipTokens';
import { MedusaPair, MedusaRoundHistory, MedusaStep } from '../games/medusa';
import { Player, RootStackParamList } from '../types';

type MedusaScreenRouteProp = RouteProp<RootStackParamList, 'Medusa'>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PLAYER_COLORS = ['tomato', 'cobalt', 'lemon', 'mint', 'violet', 'pink'] as const;
const LIGHT_COLORS = ['lemon', 'pink'];

function pColor(idx: number) { return PLAYER_COLORS[idx % PLAYER_COLORS.length]; }
function pBg(idx: number): string { return (T as unknown as Record<string, string>)[pColor(idx)] ?? T.tomato; }
function pText(idx: number): string { return LIGHT_COLORS.includes(pColor(idx)) ? T.ink : '#fff'; }

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Chip({ color, textColor = T.ink, children }: { color: string; textColor?: string; children: React.ReactNode }) {
  return (
    <View style={[u.chip, { backgroundColor: color }]}>
      <Text style={[u.chipText, { color: textColor }]}>{children}</Text>
    </View>
  );
}

function Card({ color = T.paper, style, children }: { color?: string; style?: object; children: React.ReactNode }) {
  return <View style={[u.card, { backgroundColor: color }, style]}>{children}</View>;
}

function InkBtn({ label, onPress, disabled, color = T.ink, textColor = '#fff' }: {
  label: string; onPress?: () => void; disabled?: boolean; color?: string; textColor?: string;
}) {
  return (
    <TouchableOpacity
      style={[u.inkBtn, { backgroundColor: color, borderColor: color }, disabled && u.inkBtnDisabled]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.85}
    >
      <Text style={[u.inkBtnText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Sticker({ color, rotation, textColor = T.ink, children }: {
  color: string; rotation: number; textColor?: string; children: string;
}) {
  return (
    <View style={[u.sticker, { backgroundColor: color, transform: [{ rotate: `${rotation}deg` }] }]}>
      <Text style={[u.stickerText, { color: textColor }]}>{children}</Text>
    </View>
  );
}

function Avatar({ idx, size = 40, radius = 12 }: { idx: number; size?: number; radius?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: radius, backgroundColor: pBg(idx), borderWidth: 2, borderColor: T.ink, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: pText(idx), fontSize: size * 0.4, fontWeight: '900' }}>
        {String.fromCharCode(65 + idx)}
      </Text>
    </View>
  );
}

const u = StyleSheet.create({
  chip: {
    borderWidth: 1.5, borderColor: T.ink, borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 5, alignSelf: 'flex-start',
    shadowColor: T.ink, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0, elevation: 2,
  },
  chipText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  card: {
    borderWidth: 2, borderColor: T.ink, borderRadius: 22, padding: 18,
    shadowColor: T.ink, shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  inkBtn: {
    borderWidth: 2, borderRadius: T.rMd, paddingVertical: 18, alignItems: 'center',
    shadowColor: T.ink, shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  inkBtnDisabled: { opacity: 0.4 },
  inkBtnText: { fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
  sticker: {
    borderWidth: 2, borderColor: T.ink, borderRadius: 999,
    paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'center',
    shadowColor: T.ink, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  stickerText: { fontSize: 13, fontWeight: '900', letterSpacing: 1 },
});

// ─── Rules ────────────────────────────────────────────────────────────────────

function MDRules({
  onStart,
  onExit,
  onSettings,
}: {
  onStart: () => void;
  onExit: () => void;
  onSettings: () => void;
}) {
  const RULES = [
    { n: '1', t: 'Tout le monde regarde en bas', d: 'Le joueur actif dit « Regardez en bas ! » et le groupe obéit les yeux fermés.' },
    { n: '2', t: '3… 2… 1… MÉDUSA !', d: 'Au signal, tout le monde lève la tête et fixe un autre joueur.' },
    { n: '3', t: 'Eye contact = pénalité', d: 'Si deux joueurs se regardent dans les yeux : 1 gorgée chacun.' },
    { n: '4', t: 'Pas de contact = safe', d: 'Si personne ne te fixe en retour, tu survis. Joueur suivant, à toi.' },
  ];
  const rulesModal = RULES.map((rule) => ({ n: rule.n, title: rule.t, desc: rule.d }));

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
          rules={{ rules: rulesModal, title: 'Médusa', accentColor: T.cobalt }}
        />
      </View>

      <View style={rls.titleArea}>
        {/* Medusa icon top-right */}
        <View style={rls.iconWrap}>
          <MedusaIcon size={86} />
        </View>

        <Chip color={T.paper}>Jeu n°5</Chip>
        <Text style={rls.title}>Médusa</Text>
      </View>

      <View style={rls.cardWrap}>
        <Card>
          <Text style={rls.cardLabel}>COMMENT ON JOUE</Text>
          {RULES.map((s, i) => (
            <View key={s.n} style={[rls.ruleRow, i < RULES.length - 1 && rls.divider]}>
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
      </View>

      <View style={rls.footer}>
        <InkBtn label="Que la chasse commence" onPress={onStart} />
      </View>
    </SafeAreaView>
  );
}

const rls = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.cobalt },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: T.paper, borderWidth: 2, borderColor: T.ink,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: T.ink, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  backBtnText: { fontSize: 20, color: T.ink, fontWeight: '900' },
  titleArea: { paddingHorizontal: 20, paddingTop: 16 },
  iconWrap: { position: 'absolute', right: 16, top: 18 },
  title: {
    color: '#fff', fontSize: 68, fontWeight: '900',
    letterSpacing: -2.5, lineHeight: 64, marginTop: 12,
  },
  cardWrap: { paddingHorizontal: 20, paddingTop: 24, flex: 1 },
  cardLabel: { color: T.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  ruleRow: { flexDirection: 'row', gap: 14, paddingVertical: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: `${T.muted}55` },
  ruleNum: {
    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
    backgroundColor: T.cobalt, borderWidth: 2, borderColor: T.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  ruleNumText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  ruleTitle: { color: T.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  ruleDesc: { color: T.inkSoft, fontSize: 13, marginTop: 2, lineHeight: 18 },
  footer: { padding: 20, paddingBottom: 32 },
});

// ─── Caller ───────────────────────────────────────────────────────────────────

function MDCaller({ playerIdx, playerName, roundNum, totalRounds, onStart }: {
  playerIdx: number; playerName: string; roundNum: number; totalRounds: number; onStart: () => void;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: T.ink }}>
      <SafeAreaView style={cal.screen}>
        <View style={cal.center}>
          <View style={[cal.roundBadge]}>
            <Text style={cal.roundBadgeText}>TOUR {roundNum} / {totalRounds}</Text>
          </View>

          <View style={[cal.avatar, { backgroundColor: pBg(playerIdx), shadowColor: T.cobalt }]}>
            <Text style={[cal.avatarText, { color: pText(playerIdx) }]}>
              {playerName[0].toUpperCase()}
            </Text>
          </View>

          <Text style={cal.name}>{playerName},{'\n'}c'est toi</Text>
          <Text style={cal.sub}>
            Dis à tout le monde :{'\n'}
            <Text style={cal.subAccent}>« Regardez en bas ! »</Text>
          </Text>
        </View>

        <View style={cal.footer}>
          <InkBtn label="Tout le monde est prêt → Lancer" onPress={onStart} color={T.cobalt} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const cal = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, gap: 22 },
  roundBadge: {
    backgroundColor: T.cobalt, borderWidth: 2, borderColor: T.cobalt,
    borderRadius: 999, paddingHorizontal: 18, paddingVertical: 8,
    transform: [{ rotate: '-4deg' }],
  },
  roundBadgeText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  avatar: {
    width: 120, height: 120, borderRadius: 32,
    borderWidth: 3, borderColor: T.paper,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 8, height: 8 }, shadowOpacity: 1, shadowRadius: 0, elevation: 8,
  },
  avatarText: { fontSize: 56, fontWeight: '900' },
  name: {
    color: '#fff', fontSize: 42, fontWeight: '900',
    letterSpacing: -1.5, lineHeight: 44, textAlign: 'center',
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
      scaleAnim.setValue(0.3);
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }).start();
      const t = setTimeout(() => setPhase((p) => (p + 1) as 0 | 1 | 2 | 3), 1100);
      return () => clearTimeout(t);
    }
    if (phase === 3) {
      scaleAnim.setValue(0.3);
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }).start();
      // Flash
      flashOpacity.setValue(0.65);
      Animated.timing(flashOpacity, { toValue: 0, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
      const t = setTimeout(onDone, 2800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const NUM_COLORS = [T.paper, T.lemon, T.tomato];
  const bgColor = phase === 3 ? T.cobalt : T.ink;

  return (
    <View style={[cd.screen, { backgroundColor: bgColor }]}>
      <DotBackground color="#fff" opacity={phase === 3 ? 0.08 : 0.03} />

      {phase === -1 && (
        <Text style={cd.intro}>Préparez-vous…</Text>
      )}

      {phase >= 0 && phase < 3 && (
        <Animated.Text style={[cd.number, { color: NUM_COLORS[phase], transform: [{ scale: scaleAnim }] }]}>
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

function MDReport({ players, callerName, pairs, setPairs, onConfirm }: {
  players: Player[]; callerName: string;
  pairs: MedusaPair[]; setPairs: (p: MedusaPair[]) => void;
  onConfirm: () => void;
}) {
  const [selecting, setSelecting] = useState<number | null>(null);

  const toggle = (idx: number) => {
    if (selecting === null) {
      setSelecting(idx);
    } else if (selecting === idx) {
      setSelecting(null);
    } else {
      const exists = pairs.some(
        (p) => (p.a === selecting && p.b === idx) || (p.a === idx && p.b === selecting),
      );
      if (!exists) setPairs([...pairs, { a: selecting, b: idx }]);
      setSelecting(null);
    }
  };

  const removePair = (i: number) => setPairs(pairs.filter((_, j) => j !== i));

  return (
    <SafeAreaView style={rep.screen}>
      <DotBackground opacity={0.06} />

      <View style={rep.header}>
        <Chip color={T.cobalt} textColor="#fff">Médusa · résolution</Chip>
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
              <View style={[rep.playerAvatar, { backgroundColor: isSel ? 'rgba(255,255,255,0.2)' : pBg(i) }]}>
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
            Tape le joueur qui a croisé le regard de <Text style={{ fontWeight: '900' }}>{players[selecting].name}</Text>
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
              <TouchableOpacity onPress={() => removePair(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={rep.pairRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={rep.footer}>
        {pairs.length > 0 ? (
          <InkBtn
            label={`Confirmer · ${pairs.length} paire${pairs.length > 1 ? 's' : ''}`}
            onPress={onConfirm}
            color={T.tomato}
          />
        ) : (
          <InkBtn label="Personne ne s'est regardé" onPress={onConfirm} />
        )}
      </View>
    </SafeAreaView>
  );
}

const rep = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  header: { paddingHorizontal: 20, paddingTop: 14 },
  title: {
    color: T.ink, fontSize: 34, fontWeight: '900',
    letterSpacing: -1, lineHeight: 36, marginTop: 14,
  },
  sub: { color: T.inkSoft, fontSize: 14, marginTop: 6, lineHeight: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20, paddingTop: 18 },
  playerBtn: {
    width: '47%',
    backgroundColor: T.paper, borderWidth: 2, borderColor: T.ink,
    borderRadius: 18, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: T.ink, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  playerBtnSel: {
    backgroundColor: T.cobalt,
    shadowOffset: { width: 0, height: 0 },
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  playerAvatar: {
    width: 36, height: 36, borderRadius: 10,
    borderWidth: 2, borderColor: T.ink,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  playerAvatarText: { fontSize: 14, fontWeight: '900' },
  playerName: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3, flex: 1 },
  hint: {
    marginHorizontal: 20, marginTop: 12,
    backgroundColor: `${T.cobalt}18`, borderRadius: 12,
    borderWidth: 1.5, borderColor: `${T.cobalt}40`,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  hintText: { color: T.cobalt, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  pairsSection: { paddingHorizontal: 20, paddingTop: 16 },
  pairsLabel: { color: T.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  pairRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: `${T.tomato}12`,
    borderWidth: 1.5, borderColor: `${T.tomato}30`,
    borderRadius: 12, marginBottom: 6,
  },
  pairDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: T.ink, flexShrink: 0 },
  pairName: { color: T.ink, fontSize: 14, fontWeight: '800' },
  pairArrow: { color: T.tomato, fontSize: 13, fontWeight: '900' },
  pairRemove: { color: T.muted, fontSize: 14, marginLeft: 'auto' },
  footer: { padding: 20, paddingBottom: 32, marginTop: 'auto' },
});

// ─── Round Results ────────────────────────────────────────────────────────────

function MDResults({ players, pairs, roundNum, totalRounds, onNext }: {
  players: Player[]; pairs: MedusaPair[];
  roundNum: number; totalRounds: number; onNext: () => void;
}) {
  const hasCatches = pairs.length > 0;
  const caughtSet = new Set(pairs.flatMap(({ a, b }) => [a, b]));
  const safePlayers = players.filter((_, i) => !caughtSet.has(i));
  const isLast = roundNum >= totalRounds;

  return (
    <SafeAreaView style={[res.screen, { backgroundColor: hasCatches ? T.tomato : T.mint }]}>
      <DotBackground color={T.ink} opacity={0.1} />

      <View style={res.top}>
        <Sticker color={T.paper} rotation={-6} textColor={T.ink}>
          {hasCatches ? 'CONTACT !' : 'TOUT LE MONDE EST SAFE'}
        </Sticker>
        <Text style={[res.verdict, { color: hasCatches ? '#fff' : T.ink }]}>
          {hasCatches ? 'Attrapés !' : 'Bien joué !'}
        </Text>
        <Text style={[res.verdictSub, { color: hasCatches ? 'rgba(255,255,255,0.85)' : T.inkSoft }]}>
          {hasCatches
            ? `${pairs.length} eye contact${pairs.length > 1 ? 's' : ''} ce tour`
            : 'Aucun eye contact. Impressionnant.'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={res.content} showsVerticalScrollIndicator={false}>
        {/* Caught pairs */}
        {pairs.map((pair, i) => (
          <Card key={i} style={{ padding: 14 }}>
            <View style={res.pairRow}>
              <Avatar idx={pair.a} size={40} radius={12} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={res.pairNames}>
                  {players[pair.a].name} <Text style={{ color: T.tomato }}>↔</Text> {players[pair.b].name}
                </Text>
                <Text style={res.pairPenalty}>1 GORGÉE CHACUN</Text>
              </View>
              <Avatar idx={pair.b} size={40} radius={12} />
            </View>
          </Card>
        ))}

        {/* Safe players */}
        {safePlayers.length > 0 && (
          <View>
            <Text style={[res.safeLabel, { color: hasCatches ? 'rgba(255,255,255,0.7)' : T.muted }]}>
              SAFE CE TOUR
            </Text>
            <View style={res.safeRow}>
              {safePlayers.map((p, i) => (
                <Chip key={i} color={T.paper}>✓ {p.name}</Chip>
              ))}
            </View>
          </View>
        )}

        <InkBtn
          label={isLast ? 'Voir le bilan final' : 'Tour suivant →'}
          onPress={onNext}
        />
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
  pairPenalty: { color: T.tomato, fontSize: 11, fontWeight: '900', letterSpacing: 0.5, marginTop: 3 },
  safeLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  safeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
});

// ─── End ──────────────────────────────────────────────────────────────────────

function MDEnd({ players, penalties, history, onExit, onRestart }: {
  players: Player[]; penalties: number[];
  history: MedusaRoundHistory[]; onExit: () => void; onRestart: () => void;
}) {
  const totalContacts = history.reduce((s, r) => s + r.pairs.length, 0);
  const ranked = players
    .map((p, i) => ({ p, idx: i, pen: penalties[i] }))
    .sort((a, b) => b.pen - a.pen);

  return (
    <SafeAreaView style={en.screen}>
      <DotBackground opacity={0.06} />

      <View style={en.hero}>
        <Sticker color={T.cobalt} rotation={-4} textColor="#fff">FIN DE PARTIE</Sticker>
        <Text style={en.title}>Le bilan{'\n'}des regards</Text>
      </View>

      <ScrollView contentContainerStyle={en.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={en.statsRow}>
          <Card color={T.cobalt} style={{ flex: 1, padding: 14 }}>
            <Text style={en.statLabel}>TOURS JOUÉS</Text>
            <Text style={en.statValue}>{history.length}</Text>
          </Card>
          <Card color={T.tomato} style={{ flex: 1, padding: 14 }}>
            <Text style={en.statLabel}>EYE CONTACTS</Text>
            <Text style={en.statValue}>{totalContacts}</Text>
          </Card>
        </View>

        {/* Ranking */}
        <Text style={en.sectionLabel}>CLASSEMENT</Text>
        {ranked.map(({ p, idx, pen }, i) => {
          const isTop = i === 0 && pen > 0;
          const isSafe = pen === 0;
          return (
            <View key={idx} style={[en.rankCard, { backgroundColor: isTop ? T.cobalt : T.paper }]}>
              <View style={[en.rankNum, { backgroundColor: isTop ? 'rgba(255,255,255,0.2)' : T.bgAlt }]}>
                <Text style={[en.rankNumText, { color: isTop ? '#fff' : T.ink }]}>#{i + 1}</Text>
              </View>
              <Avatar idx={idx} size={36} radius={10} />
              <View style={{ flex: 1 }}>
                <Text style={[en.rankName, { color: isTop ? '#fff' : T.ink }]}>{p.name}</Text>
                <Text style={[en.rankSub, { color: isTop ? 'rgba(255,255,255,0.7)' : T.muted }]}>
                  {isSafe ? 'INTOUCHABLE' : isTop ? 'LA MÉDUSE' : `${pen} GORGÉE${pen > 1 ? 'S' : ''}`}
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
            <View style={[en.historyBadge, { backgroundColor: r.pairs.length > 0 ? T.tomato : T.mint }]}>
              <Text style={en.historyBadgeText}>T{i + 1}</Text>
            </View>
            <Text style={en.historyText}>
              <Text style={{ fontWeight: '900', color: T.ink }}>{players[r.callerIdx].name}</Text> mène
              {r.pairs.length === 0 ? ' · aucun contact' : ` · ${r.pairs.length} paire${r.pairs.length > 1 ? 's' : ''}`}
            </Text>
          </View>
        ))}

        <View style={{ gap: 10, marginTop: 8 }}>
          <InkBtn label="Rejouer" onPress={onRestart} />
          <TouchableOpacity style={en.secondaryBtn} onPress={onExit} activeOpacity={0.85}>
            <Text style={en.secondaryBtnText}>Retour au hub</Text>
          </TouchableOpacity>
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
  sectionLabel: { color: T.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 },
  rankCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 2, borderColor: T.ink, borderRadius: 18, padding: 12,
    shadowColor: T.ink, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  rankNum: {
    width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, borderColor: T.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  rankNumText: { fontSize: 12, fontWeight: '700' },
  rankName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  rankSub: { fontSize: 11, letterSpacing: 0.5, marginTop: 1 },
  rankScore: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  historyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: T.paper, borderWidth: 2, borderColor: T.ink,
    borderRadius: 14, padding: 10,
    shadowColor: T.ink, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  historyBadge: {
    borderWidth: 1.5, borderColor: T.ink, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3, flexShrink: 0,
  },
  historyBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  historyText: { color: T.inkSoft, fontSize: 13, flex: 1 },
  secondaryBtn: {
    backgroundColor: T.paper, borderWidth: 2, borderColor: T.ink,
    borderRadius: T.rMd, paddingVertical: 15, alignItems: 'center',
    shadowColor: T.ink, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  secondaryBtnText: { color: T.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
});

// ─── Main ─────────────────────────────────────────────────────────────────────

export function MedusaScreen() {
  const route = useRoute<MedusaScreenRouteProp>();
  const navigation = useNavigation();
  const { players } = route.params as { players: Player[] };

  const [step, setStep] = useState<MedusaStep>('rules');
  const [callerIdx, setCallerIdx] = useState(0);
  const [roundPairs, setRoundPairs] = useState<MedusaPair[]>([]);
  const [history, setHistory] = useState<MedusaRoundHistory[]>([]);
  const [penalties, setPenalties] = useState<number[]>(() => players.map(() => 0));

  const confirmRound = () => {
    const np = [...penalties];
    roundPairs.forEach(({ a, b }) => { np[a]++; np[b]++; });
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
        onStart={() => setStep('caller')}
        onExit={() => (navigation as any).goBack()}
        onSettings={() => (navigation as any).navigate('Settings')}
      />
    );
  }
  if (step === 'caller') {
    return (
      <MDCaller
        playerIdx={callerIdx} playerName={players[callerIdx].name}
        roundNum={callerIdx + 1} totalRounds={players.length}
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
        players={players} callerName={players[callerIdx].name}
        pairs={roundPairs} setPairs={setRoundPairs}
        onConfirm={() => setStep('results')}
      />
    );
  }
  if (step === 'results') {
    return (
      <MDResults
        players={players} pairs={roundPairs}
        roundNum={callerIdx + 1} totalRounds={players.length}
        onNext={confirmRound}
      />
    );
  }
  if (step === 'end') {
    return (
      <MDEnd
        players={players} penalties={penalties} history={history}
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
