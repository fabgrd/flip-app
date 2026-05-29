import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChunkyButton, DotBackground, FlatChunkyButton, PlayersModal } from '../components';
import { GAMES } from '../config';
import { T } from '../constants/flipTokens';
import { navigateToGame } from '../constants/games';
import { usePlayers } from '../contexts/PlayersContext';
import { gameRegistry } from '../games/gameRegistry';
import { RootStackParamList } from '../types';

export function GameSelectScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { players } = usePlayers();

  const [pendingGameId, setPendingGameId] = useState<string | null>(null);
  const [playersModalVisible, setPlayersModalVisible] = useState(false);

  const games = GAMES.filter((g) => g.enabled && (!g.developmentOnly || __DEV__));

  const handleSelect = (gameId: string) => {
    const game = gameRegistry.getGame(gameId);
    if (game && (players.length < game.minPlayers || players.length > game.maxPlayers)) {
      setPendingGameId(gameId);
      setPlayersModalVisible(true);
      return;
    }
    navigateToGame(navigation, gameId, players);
  };

  const handlePlayersModalClose = () => {
    setPlayersModalVisible(false);
    if (!pendingGameId) return;
    const game = gameRegistry.getGame(pendingGameId);
    if (game && players.length >= game.minPlayers && players.length <= game.maxPlayers) {
      navigateToGame(navigation, pendingGameId, players);
      setPendingGameId(null);
    }
  };

  const pendingGame = pendingGameId ? gameRegistry.getGame(pendingGameId) : null;
  const pendingGamePlayersLabel = pendingGame ? t(pendingGame.playersLabelKey) : '';
  const playersModalHint = pendingGame
    ? players.length < pendingGame.minPlayers
      ? t('games:selection.minPlayersHint', {
        min: pendingGame.minPlayers,
        label: pendingGamePlayersLabel,
      })
      : t('games:selection.maxPlayersHint', {
        max: pendingGame.maxPlayers,
        label: pendingGamePlayersLabel,
      })
    : undefined;

  return (
    <SafeAreaView style={styles.screen}>
      <DotBackground opacity={0.06} />
      <View style={styles.header}>
        <ChunkyButton square size="sm" color={T.paper} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={T.ink} />
        </ChunkyButton>
        <View style={{ flex: 1, flexShrink: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{t('games:selection.title')}</Text>
          <Text style={styles.headerSub}>
            {t('games:selection.subtitle', { count: players.length })}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <FlatChunkyButton
            size="xs"
            square
            color={T.paper}
            textColor={T.ink}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPlayersModalVisible(true);
            }}
          >
            <AntDesign name="usergroup-add" size={18} color={T.ink} />
          </FlatChunkyButton>
          <FlatChunkyButton
            size="xs"
            square
            color={T.paper}
            textColor={T.ink}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialCommunityIcons name="cog-outline" size={18} color={T.ink} />
          </FlatChunkyButton>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {games.map((game, i) => {
          const bgColor = T[game.color] as string;
          const Icon = game.icon;

          return (
            <Animated.View key={game.id} entering={FadeInDown.delay(i * 120)}>
              <TouchableOpacity
                style={[styles.gameCard, { backgroundColor: bgColor }]}
                onPress={() => handleSelect(game.id)}
                activeOpacity={0.85}
              >
                <View style={styles.gameIconPanel}>
                  {Icon ? (
                    <Icon size={64} />
                  ) : (
                    <MaterialCommunityIcons name="alert-circle" size={36} color={T.ink} />
                  )}
                </View>

                <View style={styles.gameContent}>
                  <Text style={styles.gameName}>{t(game.titleKey)}</Text>
                  <Text style={styles.gameTagline}>{t(game.taglineKey)}</Text>
                  <View style={styles.chipRow}>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>👥 {t(game.playersLabelKey)}</Text>
                    </View>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>⏱ {t(game.durationLabelKey)}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.arrow}>→</Text>

                {game.isNew && (
                  <View style={styles.favBadge}>
                    <Text style={styles.favBadgeText}>{t('common:new')}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <ChunkyButton
          color={T.tomato}
          textColor="#fff"
          size="lg"
          full
          onPress={() => handleSelect(games[Math.floor(Math.random() * games.length)].id)}
          style={{ marginTop: 4 }}
        >
          <View style={styles.surpriseRow}>
            <Text style={styles.surpriseText}>{t('games:selection.surprise')}</Text>
            <Text style={styles.surpriseQuestion}>?</Text>
          </View>
        </ChunkyButton>
      </ScrollView>

      <PlayersModal
        visible={playersModalVisible}
        onClose={handlePlayersModalClose}
        onPlayersChange={() => { }}
        hint={playersModalHint}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtnText: { fontSize: 20, color: T.ink, fontWeight: '900' },
  headerTitle: {
    color: T.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 30,
  },
  headerSub: { color: T.inkSoft, fontSize: 13, marginTop: 2 },

  list: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },

  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    overflow: 'hidden',
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    minHeight: 120,
    position: 'relative',
  },

  gameIconPanel: {
    width: 96,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 2,
    borderRightColor: T.ink,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  gameContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  gameName: {
    color: T.ink,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 24,
    marginBottom: 4,
  },
  gameTagline: {
    color: T.inkSoft,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },

  chipRow: { flexDirection: 'row', gap: 6 },
  chip: {
    backgroundColor: T.paper,
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  chipText: { color: T.ink, fontSize: 11, fontWeight: '700' },

  arrow: {
    color: T.ink,
    fontSize: 22,
    fontWeight: '900',
    paddingRight: 16,
  },

  favBadge: {
    position: 'absolute',
    top: 8,
    right: 14,
    backgroundColor: T.tomato,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: T.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    transform: [{ rotate: '6deg' }],
  },
  favBadgeText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  surpriseRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  surpriseText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: -0.3 },
  surpriseQuestion: { color: '#fff', fontSize: 18, fontWeight: '900' },
  headerActions: { flexDirection: 'row', gap: 8, alignItems: 'center', flexShrink: 0 },
});
