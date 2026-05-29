import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setDevTier } from '../../src/entitlements';
import {
  ChunkyButton,
  DotBackground,
  FlatChunkyButton,
  FlippingWord,
  PlayerInput,
  PlayersList,
} from '../components';
import { MAX_PLAYERS_GLOBAL, MIN_PLAYERS_GLOBAL } from '../constants';
import { T } from '../constants/flipTokens';
import { usePlayers } from '../contexts/PlayersContext';
import { RootStackParamList } from '../types';

type HomeNav = StackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  useEffect(() => { setDevTier('premium'); }, []);
  const navigation = useNavigation<HomeNav>();
  const { t } = useTranslation();
  const { players, addPlayer, removePlayer } = usePlayers();

  const handleAddPlayer = useCallback(
    (name: string): boolean => {
      const success = addPlayer(name);
      if (success) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return success;
    },
    [addPlayer],
  );

  const handleRemovePlayer = useCallback(
    (id: string) => {
      removePlayer(id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [removePlayer],
  );

  const handleStart = useCallback(() => {
    if (players.length >= MIN_PLAYERS_GLOBAL) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      navigation.navigate('GameSelect', { players });
    }
  }, [navigation, players]);

  const canStart = players.length >= MIN_PLAYERS_GLOBAL;

  return (
    <SafeAreaView style={styles.screen}>
      <DotBackground opacity={0.06} />
      {/* Header row */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo_banniere.webp')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Fl!p"
        />
        <View style={styles.headerActions}>
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
        <View style={styles.heroTitleRow}>
          <Text style={styles.heroTitle}>{t('home:hero.titlePrefix')} </Text>
          <FlippingWord
            text={t('home:hero.titleHighlight')}
            style={[styles.heroTitle, styles.heroHighlight]}
          />
          <Text style={styles.heroTitle}>{t('home:hero.titleSuffix')}</Text>
        </View>
        <Text style={styles.heroSub}>
          {players.length > 0
            ? t('home:hero.ready', { count: players.length })
            : t('home:hero.addAtLeast', { count: MIN_PLAYERS_GLOBAL, min: MIN_PLAYERS_GLOBAL })}
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
        <PlayersList players={players} onRemovePlayer={handleRemovePlayer} />
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
          {t('home:actions.startCta')}
        </ChunkyButton>
        {!canStart && (
          <Text style={styles.ctaHint}>
            {t('home:addPlayers.minPlayers')}
          </Text>
        )}
      </View>
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
    width: 160,
    height: 80,
  },

  hero: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  heroTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  heroTitle: {
    color: T.ink,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 42,
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
