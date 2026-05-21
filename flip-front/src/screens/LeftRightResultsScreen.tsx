import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfettiBurst } from '../components';
import { T } from '../constants/flipTokens';
import { POLITICAL_COLORS } from '../games/left-right';
import { PoliticalResults } from '../games/left-right/types';
import { RootStackParamList } from '../types';

type LeftRightResultsRoute = RouteProp<RootStackParamList, 'LeftRightResults'>;

export function LeftRightResultsScreen() {
  const route = useRoute<LeftRightResultsRoute>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const results = route.params?.results as PoliticalResults;

  const getOrientationLabel = (leftPct: number): string => {
    if (leftPct >= 80) return t('leftRight:orientations.veryLeft');
    if (leftPct >= 65) return t('leftRight:orientations.left');
    if (leftPct >= 55) return t('leftRight:orientations.centerLeft');
    if (leftPct >= 45) return t('leftRight:orientations.center');
    if (leftPct >= 35) return t('leftRight:orientations.centerRight');
    if (leftPct >= 20) return t('leftRight:orientations.right');
    return t('leftRight:orientations.veryRight');
  };

  if (!results?.players?.length) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>{t('common:labels.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ConfettiBurst visible />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.stickerBadge}>
          <Text style={styles.stickerText}>📊 RÉSULTATS</Text>
        </View>
        <Text style={styles.heroTitle}>{t('leftRight:results.title', 'Analyse politique')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Podium winner */}
        <View style={styles.winnerCard}>
          <Text style={styles.crown}>👑</Text>
          <Text style={styles.winnerName}>{results.players[0].player.name}</Text>
          <Text style={styles.winnerLabel}>{t('leftRight:results.dominantOrientation')}</Text>
          <View
            style={[
              styles.orientationBadge,
              {
                backgroundColor:
                  results.players[0].leftPercentage > 50
                    ? POLITICAL_COLORS.left
                    : POLITICAL_COLORS.right,
              },
            ]}
          >
            <Text style={styles.orientationBadgeText}>
              {getOrientationLabel(results.players[0].leftPercentage)}
            </Text>
          </View>
        </View>

        {/* All players */}
        <Text style={styles.sectionLabel}>CLASSEMENT</Text>
        {results.players.map((result, i) => (
          <View key={result.player.id} style={styles.playerRow}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{i + 1}</Text>
            </View>

            <View style={styles.playerInfo}>
              <Text style={styles.playerName} numberOfLines={1}>
                {result.player.name}
              </Text>
              <Text style={styles.orientationLabel}>
                {getOrientationLabel(result.leftPercentage)}
              </Text>
            </View>

            <View style={styles.spectrum}>
              <View style={styles.spectrumBar}>
                <View style={[styles.spectrumLeft, { flex: result.leftPercentage }]} />
                <View style={[styles.spectrumRight, { flex: result.rightPercentage }]} />
              </View>
              <View style={styles.spectrumLabels}>
                <Text style={[styles.spectrumPct, { color: POLITICAL_COLORS.left }]}>
                  {result.leftPercentage}%
                </Text>
                <Text style={[styles.spectrumPct, { color: POLITICAL_COLORS.right }]}>
                  {result.rightPercentage}%
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* Actions */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>{t('common:actions.playAgain', 'Rejouer')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Home' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>
            {t('common:actions.backToHome', 'Retour au hub')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.lemon },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: T.ink, fontSize: 16 },

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
    transform: [{ rotate: '-2deg' }],
  },
  stickerText: {
    color: T.ink,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: { color: T.ink, fontSize: 42, fontWeight: '900', letterSpacing: -1.5, lineHeight: 42 },

  content: { padding: 20, paddingBottom: 40, gap: 12 },

  winnerCard: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    padding: 24,
    alignItems: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  crown: { fontSize: 32, marginBottom: 8 },
  winnerName: { color: T.ink, fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  winnerLabel: {
    color: T.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  orientationBadge: {
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 12,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  orientationBadgeText: { color: '#fff', fontSize: 14, fontWeight: '900' },

  sectionLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },

  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    padding: 14,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: T.bg,
    borderWidth: 1.5,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { color: T.ink, fontSize: 13, fontWeight: '900' },

  playerInfo: { flex: 1 },
  playerName: { color: T.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  orientationLabel: { color: T.muted, fontSize: 12, marginTop: 2 },

  spectrum: { width: 90 },
  spectrumBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: T.ink,
  },
  spectrumLeft: { backgroundColor: POLITICAL_COLORS.left },
  spectrumRight: { backgroundColor: POLITICAL_COLORS.right },
  spectrumLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  spectrumPct: { fontSize: 11, fontWeight: '800' },

  primaryBtn: {
    backgroundColor: T.ink,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: T.paper,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },

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
