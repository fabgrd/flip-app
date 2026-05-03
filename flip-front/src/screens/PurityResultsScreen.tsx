import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ConfettiBurst } from '../components';
import { T } from '../constants/flipTokens';
import { THEME_COLORS, THEME_LABELS } from '../games/purity-test';
import { RootStackParamList, Theme } from '../types';

type PurityResultsScreenRouteProp = RouteProp<RootStackParamList, 'PurityResults'>;

export function PurityResultsScreen() {
  const route = useRoute<PurityResultsScreenRouteProp>();
  const navigation = useNavigation();
  const results = route.params?.results;
  const { t } = useTranslation();

  const getRankEmoji = (rank: number) => ['👑', '🥈', '🥉'][rank - 1] ?? '🏅';

  const getImpurityLevel = (percentage: number) => {
    if (percentage <= 10)
      return { label: t('purityTest:results.impurityLevels.saint'), color: T.mint, emoji: '😇' };
    if (percentage <= 25)
      return { label: t('purityTest:results.impurityLevels.pure'), color: T.mint, emoji: '😊' };
    if (percentage <= 35)
      return {
        label: t('purityTest:results.impurityLevels.mostlyPure'),
        color: T.cobalt,
        emoji: '🙂',
      };
    if (percentage <= 45)
      return { label: t('purityTest:results.impurityLevels.mixed'), color: T.lemon, emoji: '😐' };
    if (percentage <= 55)
      return { label: t('purityTest:results.impurityLevels.naughty'), color: T.lemon, emoji: '😏' };
    if (percentage <= 65)
      return {
        label: t('purityTest:results.impurityLevels.veryImpure'),
        color: T.tomato,
        emoji: '😈',
      };
    if (percentage <= 75)
      return {
        label: t('purityTest:results.impurityLevels.diabolical'),
        color: T.tomato,
        emoji: '👹',
      };
    return { label: t('purityTest:results.impurityLevels.beyondEvil'), color: T.ink, emoji: '💀' };
  };

  return (
    <SafeAreaView style={styles.screen}>
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
          return (
            <View key={result.player.id} style={styles.playerCard}>
              {/* Player header */}
              <View style={styles.playerHeader}>
                <View style={styles.rankCol}>
                  <Text style={styles.rankEmoji}>{getRankEmoji(result.rank)}</Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName} numberOfLines={1}>
                    {result.player.name}
                  </Text>
                  <Text style={[styles.purityLabel, { color: lvl.color }]}>
                    {lvl.emoji} {lvl.label}
                  </Text>
                </View>
                <View style={[styles.scoreBadge, { backgroundColor: lvl.color }]}>
                  <Text style={styles.scoreText}>{result.impurityPercentage}%</Text>
                </View>
              </View>

              {/* Theme breakdown */}
              <View style={styles.themesDivider} />
              <Text style={styles.themesLabel}>
                {t('purityTest:results.themeDetails', 'Par thème')}
              </Text>
              <View style={styles.themesGrid}>
                {Object.entries(result.themePercentages).map(([key, pct]) => (
                  <View key={key} style={styles.themeItem}>
                    <View
                      style={[
                        styles.themeDot,
                        { backgroundColor: THEME_COLORS[key as Theme] ?? T.violet },
                      ]}
                    />
                    <Text style={styles.themeName} numberOfLines={1}>
                      {THEME_LABELS[key as Theme]}
                    </Text>
                    <Text style={styles.themePct}>{pct}%</Text>
                  </View>
                ))}
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

  content: { padding: 20, paddingBottom: 40, gap: 14 },

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
  playerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  rankCol: { alignItems: 'center', width: 36 },
  rankEmoji: { fontSize: 26 },
  playerInfo: { flex: 1 },
  playerName: { color: T.ink, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  purityLabel: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  scoreBadge: {
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rSm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  scoreText: { color: T.ink, fontSize: 18, fontWeight: '900' },

  themesDivider: { height: 1, backgroundColor: `${T.muted}30`, marginBottom: 12 },
  themesLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  themesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    gap: 6,
  },
  themeDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: T.ink,
    flexShrink: 0,
  },
  themeName: { flex: 1, color: T.inkSoft, fontSize: 12 },
  themePct: { color: T.ink, fontSize: 12, fontWeight: '800', minWidth: 32, textAlign: 'right' },

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
