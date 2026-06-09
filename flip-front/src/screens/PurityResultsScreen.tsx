import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ConfettiBurst, DotBackground } from '../components';
import { T } from '../constants/flipTokens';
import { THEME_COLORS, THEME_LABELS } from '../games/purity-test';
import { RootStackParamList, Theme } from '../types';

type PurityResultsScreenRouteProp = RouteProp<RootStackParamList, 'PurityResults'>;

// Animated fill so bars sweep in on mount — reads as "more impure = fuller bar".
function ProgressBar({
  pct,
  color,
  thick = false,
  delay = 0,
}: {
  pct: number;
  color: string;
  thick?: boolean;
  delay?: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: pct,
      duration: 900,
      delay,
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [pct, delay, progress]);

  const width = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.barTrack, thick && styles.barTrackThick]}>
      <Animated.View style={[styles.barFill, { width, backgroundColor: color }]} />
    </View>
  );
}

export function PurityResultsScreen() {
  const route = useRoute<PurityResultsScreenRouteProp>();
  const navigation = useNavigation();
  const results = route.params?.results;
  const { t } = useTranslation();

  const getRankEmoji = (rank: number) => ['👑', '🥈', '🥉'][rank - 1] ?? '🏅';

  const getImpurityLevel = (percentage: number) => {
    if (percentage <= 8)
      return { label: t('purityTest:results.impurityLevels.saint'), color: T.mint, emoji: '😇' };
    if (percentage <= 16)
      return { label: t('purityTest:results.impurityLevels.pure'), color: T.mint, emoji: '😊' };
    if (percentage <= 25)
      return {
        label: t('purityTest:results.impurityLevels.mostlyPure'),
        color: T.cobalt,
        emoji: '🙂',
      };
    if (percentage <= 33)
      return {
        label: t('purityTest:results.impurityLevels.corrupted'),
        color: T.cobalt,
        emoji: '😬',
      };
    if (percentage <= 41)
      return { label: t('purityTest:results.impurityLevels.mixed'), color: T.lemon, emoji: '😐' };
    if (percentage <= 50)
      return { label: t('purityTest:results.impurityLevels.naughty'), color: T.lemon, emoji: '😏' };
    if (percentage <= 58)
      return {
        label: t('purityTest:results.impurityLevels.sinner'),
        color: '#FF8A3D',
        emoji: '🫦',
      };
    if (percentage <= 66)
      return {
        label: t('purityTest:results.impurityLevels.veryImpure'),
        color: T.tomato,
        emoji: '😈',
      };
    if (percentage <= 74)
      return {
        label: t('purityTest:results.impurityLevels.demon'),
        color: '#E0341A',
        emoji: '👺',
      };
    if (percentage <= 82)
      return {
        label: t('purityTest:results.impurityLevels.diabolical'),
        color: '#B11226',
        emoji: '👹',
      };
    if (percentage <= 90)
      return {
        label: t('purityTest:results.impurityLevels.hellspawn'),
        color: '#6B0F1A',
        emoji: '🔥',
      };
    return { label: t('purityTest:results.impurityLevels.beyondEvil'), color: T.ink, emoji: '💀' };
  };

  // Dark badge backgrounds (Satan, hellspawn…) need light text to stay readable.
  const getScoreTextColor = (hex: string) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5 ? '#fff' : T.ink;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <DotBackground color="#fff" opacity={0.05} />
      <ConfettiBurst visible />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.stickerBadge}>
          <Text style={styles.stickerText}>😈 RÉSULTATS</Text>
        </View>
        <Text style={styles.heroTitle}>{t('purityTest:results.title', 'Test de Pureté')}</Text>
        <Text style={styles.heroSub}>
          {t('purityTest:results.subtitle', 'Qui est le plus corrompu ?')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {results?.players?.map((result) => {
          const lvl = getImpurityLevel(result.impurityPercentage);
          const isWinner = result.rank === 1;
          return (
            <View
              key={result.player.id}
              style={[styles.playerCard, isWinner && styles.winnerCard]}
            >
              {isWinner && (
                <View style={styles.crownRibbon}>
                  <Text style={styles.crownRibbonText}>{t('purityTest:results.crowned')}</Text>
                </View>
              )}

              {/* Player header */}
              <View style={styles.playerHeader}>
                <Text style={styles.rankEmoji}>{getRankEmoji(result.rank)}</Text>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName} numberOfLines={1}>
                    {result.player.name}
                  </Text>
                  <Text style={[styles.purityLabel, { color: lvl.color }]}>
                    {lvl.emoji} {lvl.label}
                  </Text>
                </View>
                <View style={[styles.scoreBadge, { backgroundColor: lvl.color }]}>
                  <Text
                    style={[styles.scoreText, { color: getScoreTextColor(lvl.color) }]}
                    numberOfLines={1}
                  >
                    {result.impurityPercentage}%
                  </Text>
                </View>
              </View>

              {/* Overall impurity bar */}
              <View style={styles.overallRow}>
                <Text style={styles.overallLabel}>
                  {t('purityTest:results.overallImpurity', 'Impureté globale')}
                </Text>
              </View>
              <ProgressBar pct={result.impurityPercentage} color={lvl.color} thick />

              {/* Theme breakdown */}
              <View style={styles.themesDivider} />
              <Text style={styles.themesLabel}>
                {t('purityTest:results.themeDetails', 'Par thème')}
              </Text>
              <View style={styles.themeBars}>
                {Object.entries(result.themePercentages).map(([key, pct], i) => {
                  const themeColor = THEME_COLORS[key as Theme] ?? T.violet;
                  const flair = pct >= 80 ? t(`purityTest:results.themeFlair.${key}`, '') : '';
                  return (
                    <View key={key} style={styles.themeBlock}>
                      <View style={styles.themeRow}>
                        <Text style={styles.themeName} numberOfLines={1}>
                          {THEME_LABELS[key as Theme]}
                        </Text>
                        <ProgressBar pct={pct} color={themeColor} delay={200 + i * 90} />
                        <Text style={styles.themePct} numberOfLines={1}>{pct}%</Text>
                      </View>
                      {flair ? (
                        <Text style={[styles.themeFlair, { color: themeColor }]}>
                          {flair}
                        </Text>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Home' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {t('purityTest:results.backToHome', 'Retour au hub')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.violet },

  hero: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  stickerBadge: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    transform: [{ rotate: '-3deg' }],
  },
  stickerText: {
    color: T.ink,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  heroSub: { color: 'rgba(255,255,255,0.75)', fontSize: 15, marginTop: 6 },

  content: { padding: 20, paddingBottom: 40, gap: 16 },

  playerCard: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    padding: 18,
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  winnerCard: {
    borderColor: T.lemon,
    borderWidth: 3,
    shadowColor: T.lemon,
    shadowOffset: { width: 6, height: 6 },
  },
  crownRibbon: {
    alignSelf: 'flex-start',
    backgroundColor: T.lemon,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
    transform: [{ rotate: '-2deg' }],
    shadowColor: T.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  crownRibbonText: {
    color: T.ink,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  playerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  rankEmoji: { fontSize: 32, width: 40, textAlign: 'center' },
  playerInfo: { flex: 1 },
  playerName: { color: T.ink, fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  purityLabel: { fontSize: 13, fontWeight: '800', marginTop: 2 },
  scoreBadge: {
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rSm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  scoreText: { fontSize: 20, fontWeight: '900' },

  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  overallLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  overallPct: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },

  themesDivider: { height: 1, backgroundColor: `${T.muted}30`, marginTop: 16, marginBottom: 12 },
  themesLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  themeBars: { gap: 10 },
  themeBlock: { gap: 4 },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  themeName: { width: 74, color: T.inkSoft, fontSize: 12, fontWeight: '800' },
  themePct: {
    minWidth: 44,
    textAlign: 'right',
    color: T.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  themeFlair: {
    marginLeft: 84,
    fontSize: 12,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: -0.2,
  },

  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: `${T.ink}12`,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: T.ink,
  },
  barTrackThick: { height: 18, borderRadius: 999 },
  barFill: { height: '100%', borderRadius: 999, minWidth: 4 },

  primaryBtn: {
    backgroundColor: T.ink,
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
    marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
});
