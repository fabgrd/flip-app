import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  AperoIcon,
  CastingIcon,
  ChameleonIcon,
  ChunkyButton,
  DotBackground,
  GaucheDroiteIcon,
  MedusaIcon,
  ParanoiaIcon,
  PureteIcon,
  RedFlagIcon,
} from '../components';
import { T } from '../constants/flipTokens';
import { navigateToGame } from '../constants/games';
import { RootStackParamList } from '../types';

type GameSelectRouteProp = RouteProp<RootStackParamList, 'GameSelect'>;

type GameMeta = {
  color: keyof typeof T;
  tagline: string;
  Icon: React.ComponentType<{ size?: number }>;
  players: string;
  time: string;
};

const GAME_META: Record<string, GameMeta> = {
  'red-flag': {
    color: 'tomato',
    tagline: 'Tes exs auraient aimé te faire passer ce test',
    Icon: RedFlagIcon,
    players: '1+',
    time: '5 min',
  },
  cameleon: {
    color: 'mint',
    tagline: "Démasque l'imposteur",
    Icon: ChameleonIcon,
    players: '4–10',
    time: '15 min',
  },
  'left-right': {
    color: 'lemon',
    tagline: "Place la phrase sur l'échiquier politique",
    Icon: GaucheDroiteIcon,
    players: '2+',
    time: '10 min',
  },
  'purity-test': {
    color: 'violet',
    tagline: 'Combien de péchés à ton actif ?',
    Icon: PureteIcon,
    players: '1+',
    time: '5 min',
  },
  paranoia: {
    color: 'teal',
    tagline: 'Qui a dit ton prénom… et pourquoi ?',
    Icon: ParanoiaIcon,
    players: '4+',
    time: '15 min',
  },
  medusa: {
    color: 'cobalt',
    tagline: 'Lève les yeux… et croise le regard',
    Icon: MedusaIcon,
    players: '5+',
    time: '10 min',
  },
  apero: {
    color: 'pink',
    tagline: 'Devine la carte du donneur ou tu bois',
    Icon: AperoIcon,
    players: '2+',
    time: '20 min',
  },
  casting: {
    color: 'castingOrange',
    tagline: 'Joue la scène selon ton chiffre secret',
    Icon: CastingIcon,
    players: '3–11',
    time: '20 min',
  },
};

export function GameSelectScreen() {
  const route = useRoute<GameSelectRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { players } = route.params;

  const games = [
    { id: 'red-flag', name: 'Es-tu un Red Flag ?', minPlayers: 1, maxPlayers: 99, description: '' },
    { id: 'casting', name: 'Le Casting', minPlayers: 3, maxPlayers: 11, description: '' },
    { id: 'apero', name: "L'Apéro", minPlayers: 2, maxPlayers: 99, description: '' },
    { id: 'medusa', name: 'Médusa', minPlayers: 5, maxPlayers: 20, description: '' },
    { id: 'paranoia', name: 'Paranoïa', minPlayers: 4, maxPlayers: 10, description: '' },
    { id: 'cameleon', name: 'Caméléon', minPlayers: 4, maxPlayers: 10, description: '' },
    { id: 'left-right', name: 'Gauche ou Droite', minPlayers: 2, maxPlayers: 99, description: '' },
    { id: 'purity-test', name: 'Test de Pureté', minPlayers: 1, maxPlayers: 99, description: '' },
  ];

  const handleSelect = (gameId: string) => {
    try {
      navigateToGame(navigation, gameId, players);
    } catch {
      if (gameId === 'purity-test') navigation.navigate('PurityTest', { players });
      else if (gameId === 'cameleon') navigation.navigate('Cameleon', { players });
      else if (gameId === 'paranoia') navigation.navigate('Paranoia', { players });
      else if (gameId === 'medusa') navigation.navigate('Medusa', { players });
      else if (gameId === 'apero') navigation.navigate('Apero', { players });
      else if (gameId === 'casting') navigation.navigate('Casting', { players });
      else if (gameId === 'red-flag') navigation.navigate('RedFlag', { players });
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <DotBackground opacity={0.06} />
      {/* Header */}
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
          const meta = GAME_META[game.id] ?? {
            color: 'tomato',
            tagline: '',
            Icon: ChameleonIcon,
            players: '2+',
            time: '–',
          };
          const bgColor = T[meta.color as keyof typeof T] as string;
          const isFavorite = i === 0;
          const Icon = meta.Icon;

          return (
            <Animated.View key={game.id} entering={FadeInDown.delay(i * 120)}>
              <TouchableOpacity
                style={[styles.gameCard, { backgroundColor: bgColor }]}
                onPress={() => handleSelect(game.id)}
                activeOpacity={0.85}
              >
                {/* Icon panel */}
                <View style={styles.gameIconPanel}>
                  <Icon size={64} />
                </View>

                {/* Content */}
                <View style={styles.gameContent}>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <Text style={styles.gameTagline}>{meta.tagline}</Text>
                  <View style={styles.chipRow}>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>👥 {meta.players}</Text>
                    </View>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>⏱ {meta.time}</Text>
                    </View>
                  </View>
                </View>

                {/* Arrow */}
                <Text style={styles.arrow}>→</Text>

                {isFavorite && (
                  <View style={styles.favBadge}>
                    <Text style={styles.favBadgeText}>Nouveau</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Surprise CTA */}
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

  surpriseBtn: {
    backgroundColor: T.ink,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: T.tomato,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  surpriseBtnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },
});
