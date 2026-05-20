import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ChunkyButton, DotBackground } from '../components';
import { GAMES } from '../config';
import { T } from '../constants/flipTokens';
import { navigateToGame } from '../constants/games';
import { RootStackParamList } from '../types';

type GameSelectRouteProp = RouteProp<RootStackParamList, 'GameSelect'>;

export function GameSelectScreen() {
  const route = useRoute<GameSelectRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { players } = route.params;

  const games = GAMES.filter((g) => g.enabled && (!g.developmentOnly || __DEV__));

  const handleSelect = (gameId: string) => {
    navigateToGame(navigation, gameId, players);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <DotBackground opacity={0.06} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Choisis un jeu</Text>
          <Text style={styles.headerSub}>
            {players.length} joueur{players.length > 1 ? 's' : ''} · prêts à se ridiculiser
          </Text>
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
                  <Icon size={64} />
                </View>

                <View style={styles.gameContent}>
                  <Text style={styles.gameName}>{game.title}</Text>
                  <Text style={styles.gameTagline}>{game.tagline}</Text>
                  <View style={styles.chipRow}>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>👥 {game.playersLabel}</Text>
                    </View>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>⏱ {game.durationLabel}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.arrow}>→</Text>

                {game.isNew && (
                  <View style={styles.favBadge}>
                    <Text style={styles.favBadgeText}>Nouveau</Text>
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
          {'🎲  Surprends-moi'}
        </ChunkyButton>
      </ScrollView>
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
});
