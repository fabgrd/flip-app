import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Avatar, Confetti } from '../components';
import { createGlobalStyles } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { POLITICAL_COLORS } from '../games/left-right';
import { PoliticalResults } from '../games/left-right/types';
import { RootStackParamList } from '../types';

type LeftRightResultsScreenRouteProp = RouteProp<RootStackParamList, 'LeftRightResults'>;

export function LeftRightResultsScreen() {
  const route = useRoute<LeftRightResultsScreenRouteProp>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { results } = route.params as { results: PoliticalResults };
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);

  const getPoliticalLevel = (leftPercentage: number): string => {
    if (leftPercentage >= 80) return t('leftRight:orientations.veryLeft');
    if (leftPercentage >= 65) return t('leftRight:orientations.left');
    if (leftPercentage >= 55) return t('leftRight:orientations.centerLeft');
    if (leftPercentage >= 45) return t('leftRight:orientations.center');
    if (leftPercentage >= 35) return t('leftRight:orientations.centerRight');
    if (leftPercentage >= 20) return t('leftRight:orientations.right');
    return t('leftRight:orientations.veryRight');
  };

  const getPoliticalColor = (leftPercentage: number): string => {
    const intensity = Math.abs(leftPercentage - 50) / 50;
    if (leftPercentage > 50) {
      // Left-leaning: blend from center to full left color
      return (
        POLITICAL_COLORS.left +
        Math.round(intensity * 255)
          .toString(16)
          .padStart(2, '0')
      );
    } else {
      // Right-leaning: blend from center to full right color
      return (
        POLITICAL_COLORS.right +
        Math.round(intensity * 255)
          .toString(16)
          .padStart(2, '0')
      );
    }
  };

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const handlePlayAgain = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.colors.surface }]}>
      <Confetti />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {t('leftRight:results.title')}
        </Text>
        <TouchableOpacity onPress={handlePlayAgain} style={styles.replayButton}>
          <Ionicons name="refresh" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Winner podium */}
        {results.players.length > 0 && (
          <View style={[styles.winnerContainer, { backgroundColor: theme.colors.background }]}>
            <View style={styles.crownContainer}>
              <Text style={styles.crown}>👑</Text>
            </View>
            <Avatar
              name={results.players[0].player.name}
              avatar={results.players[0].player.avatar}
              size={80}
            />
            <Text style={[styles.winnerName, { color: theme.colors.text.primary }]}>
              {results.players[0].player.name}
            </Text>
            <Text style={[styles.winnerTitle, { color: theme.colors.primary }]}>
              {t('leftRight:results.dominantOrientation')}
            </Text>
            <View
              style={[
                styles.orientationBadge,
                { backgroundColor: getPoliticalColor(results.players[0].leftPercentage) },
              ]}
            >
              <Text style={styles.orientationText}>
                {getPoliticalLevel(results.players[0].leftPercentage)}
              </Text>
            </View>
          </View>
        )}

        {/* Results list */}
        <View style={styles.resultsContainer}>
          {results.players.map((result, index) => (
            <View
              key={result.player.id}
              style={[
                styles.playerResult,
                { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
              ]}
            >
              <View style={styles.rankContainer}>
                <Text style={[styles.rank, { color: theme.colors.text.secondary }]}>
                  #{result.rank}
                </Text>
              </View>

              <Avatar name={result.player.name} avatar={result.player.avatar} size={50} />

              <View style={styles.playerInfo}>
                <Text style={[styles.playerName, { color: theme.colors.text.primary }]}>
                  {result.player.name}
                </Text>
                <Text style={[styles.politicalLevel, { color: theme.colors.text.secondary }]}>
                  {getPoliticalLevel(result.leftPercentage)}
                </Text>
              </View>

              <View style={styles.scoreContainer}>
                {/* Political spectrum bar */}
                <View style={[styles.spectrumBar, { backgroundColor: theme.colors.border }]}>
                  <View
                    style={[
                      styles.spectrumFill,
                      {
                        width: `${result.leftPercentage}%`,
                        backgroundColor: POLITICAL_COLORS.left,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.spectrumFillRight,
                      {
                        width: `${result.rightPercentage}%`,
                        backgroundColor: POLITICAL_COLORS.right,
                      },
                    ]}
                  />
                </View>

                <View style={styles.percentageContainer}>
                  <Text style={[styles.percentage, { color: POLITICAL_COLORS.left }]}>
                    {result.leftPercentage}%
                  </Text>
                  <Text style={[styles.percentage, { color: POLITICAL_COLORS.right }]}>
                    {result.rightPercentage}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={handlePlayAgain}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.actionButtonText}>{t('common:actions.playAgain')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.secondaryButton,
              { borderColor: theme.colors.border },
            ]}
            onPress={handleBackToHome}
          >
            <Ionicons name="home" size={20} color={theme.colors.text.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.text.primary }]}>
              {t('common:actions.backToHome')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 14,
    width: '48%',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
  },
  crown: {
    fontSize: 24,
  },
  crownContainer: {
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  orientationBadge: {
    borderRadius: 20,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  orientationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerResult: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 16,
  },
  politicalLevel: {
    fontSize: 12,
    marginTop: 2,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rankContainer: {
    marginRight: 12,
    minWidth: 30,
  },
  replayButton: {
    padding: 8,
  },
  resultsContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  scoreContainer: {
    minWidth: 100,
  },
  scrollContainer: {
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  spectrumBar: {
    borderRadius: 6,
    flexDirection: 'row',
    height: 12,
    overflow: 'hidden',
  },
  spectrumFill: {
    height: '100%',
  },
  spectrumFillRight: {
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  winnerContainer: {
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 32,
  },
  winnerName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },
  winnerTitle: {
    fontSize: 14,
    marginTop: 4,
  },
});
