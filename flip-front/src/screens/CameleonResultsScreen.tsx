import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ConfettiBurst } from '../components/common';
import { T } from '../constants/flipTokens';
import type { CameleonAssignedPlayer } from '../games/cameleon';
import { RootStackParamList } from '../types';

type CameleonResultsRoute = RouteProp<RootStackParamList, 'CameleonResults'>;

export function CameleonResultsScreen() {
  const { t } = useTranslation();
  const route = useRoute<CameleonResultsRoute>();
  const navigation = useNavigation();
  const { players } = route.params as { players: CameleonAssignedPlayer[] };

  const winner: 'civilians' | 'undercover' = useMemo(() => {
    const alive = players.filter((p) => !p.isEliminated);
    const civiliansAlive = alive.filter((p) => p.role === 'civilian').length;
    return civiliansAlive === 0 ? 'undercover' : 'civilians';
  }, [players]);

  const computeRoundPoints = (p: CameleonAssignedPlayer) => {
    const isImpostor = p.role === 'cameleon' || p.role === 'mrWhite';
    if (winner === 'undercover') return isImpostor ? 6 : 0;
    return !isImpostor ? 2 : 0;
  };

  const withCumulativePoints = useMemo(() => {
    return players.map((p) => {
      const prev = p.score ?? 0;
      const round = computeRoundPoints(p);
      const bonus = p.scoreBonus ?? 0;
      return { ...p, points: prev + round + bonus };
    });
  }, [players, winner]);

  const sorted = useMemo(() => {
    return [...withCumulativePoints].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
  }, [withCumulativePoints]);

  const scale = useSharedValue(0.5);
  const winnerStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8, stiffness: 120 });
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const civilWin = winner === 'civilians';

  const handleReplay = () => {
    const nextPlayers = players.map((p) => {
      const prev = p.score ?? 0;
      const round = computeRoundPoints(p);
      const bonus = p.scoreBonus ?? 0;
      return { ...p, score: prev + round + bonus, scoreBonus: 0 };
    });
    navigation.navigate('Cameleon', { players: nextPlayers });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: civilWin ? T.mint : T.tomato }]}>
      <ConfettiBurst visible={showConfetti} />

      {/* Hero result */}
      <View style={styles.hero}>
        <Animated.View entering={FadeIn} style={[styles.stickerBadge, winnerStyle]}>
          <Text style={styles.stickerText}>{civilWin ? '🎉 BIEN VU' : '😈 RATÉ'}</Text>
        </Animated.View>
        <Text style={[styles.heroTitle, { color: civilWin ? T.ink : '#fff' }]}>
          {civilWin
            ? t('cameleon:outcome.civiliansWin', 'Démasqué !')
            : t('cameleon:outcome.undercoverWin', 'Évadé.')}
        </Text>
        <Text style={[styles.heroSub, { color: civilWin ? T.inkSoft : 'rgba(255,255,255,0.8)' }]}>
          {t('cameleon:results.subtitle', 'Résultats de la manche')}
        </Text>
      </View>

      {/* Scores card */}
      <ScrollView style={styles.scoresWrapper} contentContainerStyle={styles.scoresContent}>
        <View style={styles.scoresCard}>
          <Text style={styles.scoresCardLabel}>SCORES</Text>
          {sorted.map((p, i) => (
            <Animated.View
              key={p.id}
              entering={ZoomIn.delay(i * 60)}
              style={[styles.scoreRow, i < sorted.length - 1 && styles.scoreRowBorder]}
            >
              <View style={styles.scoreRank}>
                <Text style={styles.scoreRankText}>{i + 1}</Text>
              </View>
              <Text style={styles.scoreName} numberOfLines={1}>
                {p.name}
              </Text>
              <Text style={styles.scoreRole}>
                {p.role === 'civilian'
                  ? t('cameleon:roles.civilian')
                  : p.role === 'cameleon'
                    ? t('cameleon:roles.cameleon')
                    : t('cameleon:roles.mrWhite')}
              </Text>
              <View style={styles.scoreWordCell}>
                {p.role === 'mrWhite' ? (
                  <Text
                    style={[styles.scoreWord, p.mrWhiteGuessCorrect && styles.scoreWordCorrect]}
                    numberOfLines={1}
                  >
                    {p.mrWhiteGuess ?? '—'}
                  </Text>
                ) : (
                  <Text style={styles.scoreWord} numberOfLines={1}>
                    {p.secretWord ?? '—'}
                  </Text>
                )}
                {p.mrWhiteGuessCorrect && <Text style={styles.bonusBadge}>+5</Text>}
              </View>
              <Text style={styles.scorePoints}>{p.points}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleReplay} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>{t('common:buttons.playAgain', 'Rejouer')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Home' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>{t('common:buttons.back', 'Retour au hub')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  hero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    alignItems: 'flex-start',
  },
  stickerBadge: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    transform: [{ rotate: '-3deg' }],
  },
  stickerText: {
    color: T.ink,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -3,
    lineHeight: 62,
  },
  heroSub: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },

  scoresWrapper: { flex: 1 },
  scoresContent: { padding: 16, paddingBottom: 40 },

  scoresCard: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    padding: 18,
    marginBottom: 16,
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  scoresCardLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  scoreRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: `${T.muted}30`,
  },
  scoreRank: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: T.ink,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scoreRankText: { color: T.ink, fontSize: 11, fontWeight: '900' },
  scoreName: { flex: 1, color: T.ink, fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },
  scoreRole: { color: T.muted, fontSize: 12, fontWeight: '700', width: 80, textAlign: 'center' },
  scoreWordCell: { width: 80, alignItems: 'flex-end' },
  scoreWord: { color: T.muted, fontSize: 13 },
  scoreWordCorrect: { color: T.mint, fontWeight: '800' },
  bonusBadge: { color: T.mint, fontSize: 11, fontWeight: '900', marginTop: 2 },
  scorePoints: { color: T.ink, fontSize: 18, fontWeight: '900', width: 36, textAlign: 'right' },

  primaryBtn: {
    backgroundColor: T.ink,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: T.paper,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  primaryBtnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },

  secondaryBtn: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  secondaryBtnText: { color: T.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
});
