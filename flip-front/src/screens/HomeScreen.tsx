import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { setDevTier } from '../../src/entitlements';
import {
  ChunkyButton,
  DotBackground,
  FlatChunkyButton,
  PaywallModal,
  PlayerInput,
  PlayersList,
} from '../components';
import { MAX_PLAYERS_GLOBAL, MIN_PLAYERS_GLOBAL } from '../constants';
import { T } from '../constants/flipTokens';
import { usePlayers } from '../contexts/PlayersContext';
import { RootStackParamList } from '../types';

type HomeNav = StackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  setDevTier('premium');
  const navigation = useNavigation<HomeNav>();
  const { t } = useTranslation();
  const { players, addPlayer, removePlayer, updatePlayerAvatar } = usePlayers();

  const handleAddPlayer = (name: string): boolean => {
    const success = addPlayer(name);
    if (success) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    return success;
  };

  const handleRemovePlayer = (id: string) => {
    removePlayer(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStart = () => {
    if (players.length >= MIN_PLAYERS_GLOBAL) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      navigation.navigate('GameSelect', { players });
    }
  };

  const canStart = players.length >= MIN_PLAYERS_GLOBAL;
  const [paywallVisible, setPaywallVisible] = useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <DotBackground opacity={0.06} />
      {/* Header row */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>
            Fl<Text style={styles.logoAccent}>!</Text>p
          </Text>
        </View>
        <View style={styles.headerActions}>
          <FlatChunkyButton
            size="sm"
            square
            color={T.lemon}
            onPress={() => setPaywallVisible(true)}
          >
            <Svg width={18} height={18} viewBox="0 0 48 48" fill="none">
              <Path d="M6 36h36V20l-9 6-9-12-9 12-9-6v16z" fill={T.lemon} stroke={T.ink} strokeWidth="2.5" strokeLinejoin="round" />
              <Rect x="6" y="34" width="36" height="6" rx="1" fill={T.lemon} stroke={T.ink} strokeWidth="2.5" />
              <Circle cx="15" cy="14" r="3" fill={T.lemon} stroke={T.ink} strokeWidth="2" />
              <Circle cx="33" cy="14" r="3" fill={T.lemon} stroke={T.ink} strokeWidth="2" />
              <Circle cx="24" cy="8" r="3" fill={T.tomato} stroke={T.ink} strokeWidth="2" />
            </Svg>
          </FlatChunkyButton>
          <FlatChunkyButton
            size="sm"
            square
            color={T.paper}
            textColor={T.ink}
            onPress={() => navigation.navigate('Settings')}
          >
            <Feather name="settings" size={18} color={T.ink} />
          </FlatChunkyButton>
        </View>
      </View>

      {/* Hero text */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Qui est{'\n'}
          <Text style={styles.heroHighlight}>de la partie</Text> ?
        </Text>
        <Text style={styles.heroSub}>
          {players.length > 0
            ? `${players.length} joueur${players.length > 1 ? 's' : ''} prêt${players.length > 1 ? 's' : ''} à se ridiculiser.`
            : `Ajoute au moins ${MIN_PLAYERS_GLOBAL} joueur pour démarrer.`}
        </Text>
      </View>

      {/* Input */}
      <View style={styles.inputWrapper}>
        <PlayerInput
          onAddPlayer={handleAddPlayer}
          maxPlayers={MAX_PLAYERS_GLOBAL}
          currentPlayerCount={players.length}
        />
      </View>

      {/* Players list */}
      <View style={styles.listWrapper}>
        <PlayersList
          players={players}
          onRemovePlayer={handleRemovePlayer}
          onUpdateAvatar={updatePlayerAvatar}
        />
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <ChunkyButton
          color={T.tomato}
          textColor="#fff"
          size="lg"
          full
          onPress={handleStart}
          disabled={!canStart}
        >
          {"C'est parti →"}
        </ChunkyButton>
        {!canStart && (
          <Text style={styles.ctaHint}>
            {t('home:addPlayers.minPlayers', `Minimum ${MIN_PLAYERS_GLOBAL} joueur`)}
          </Text>
        )}
      </View>
      <PaywallModal visible={paywallVisible} onClose={() => setPaywallVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: T.bg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },

  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  logo: {
    fontFamily: 'System',
    fontSize: 40,
    fontWeight: '900',
    color: T.ink,
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  logoAccent: { color: T.tomato },

  hero: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  heroTitle: {
    color: T.ink,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 42,
    marginBottom: 8,
  },
  heroHighlight: {
    color: T.tomato,
  },
  heroSub: {
    color: T.inkSoft,
    fontSize: 15,
    lineHeight: 20,
  },

  inputWrapper: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  listWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
  ctaBtn: {
    backgroundColor: T.tomato,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  ctaBtnDisabled: { opacity: 0.4 },
  ctaBtnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },
  ctaHint: {
    color: T.muted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
