import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { usePlayers } from '../contexts/PlayersContext';
import { PlayerInput, PlayersList } from '../components';
import { RootStackParamList } from '../types';
import { GlobalStyles, MIN_PLAYERS_GLOBAL, MAX_PLAYERS_GLOBAL } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const MAX_PLAYERS = MAX_PLAYERS_GLOBAL;
const MIN_PLAYERS = MIN_PLAYERS_GLOBAL;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();
  const { players, addPlayer, removePlayer, updatePlayerAvatar } = usePlayers();
  const { theme } = useTheme();

  const handleAddPlayer = (name: string): boolean => {
    const success = addPlayer(name);
    if (success) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    return success;
  };

  const handleRemovePlayer = (id: string) => {
    removePlayer(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStartGame = () => {
    if (players.length >= MIN_PLAYERS) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      navigation.navigate('GameSelect', { players });
    }
  };

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings');
  };

  const canStartGame = players.length >= MIN_PLAYERS;

  return (
    <SafeAreaView style={[GlobalStyles.container, { backgroundColor: theme.colors.background }]}>
      <View style={GlobalStyles.screen}>
        {/* Settings Button Top Right */}
        <View style={styles.settingsTopRightWrapper}>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: `${theme.colors.primary}10` }]}
            onPress={handleSettingsPress}
          >
            <Ionicons name="settings" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.headerContent}>
          <Text style={[styles.appTitle, { color: theme.colors.primary }]}>{t('home:title')}</Text>
          <Text style={[styles.appSubtitle, { color: theme.colors.text.secondary }]}>
            {t('home:subtitle')}
          </Text>
        </View>

        {/* Add Player Section */}
        <View style={styles.inputSection}>
          <PlayerInput
            onAddPlayer={handleAddPlayer}
            maxPlayers={MAX_PLAYERS}
            currentPlayerCount={players.length}
          />
        </View>

        {/* Players List */}
        <View style={styles.playersSection}>
          <PlayersList
            players={players}
            onRemovePlayer={handleRemovePlayer}
            onUpdateAvatar={updatePlayerAvatar}
          />
        </View>
      </View>

      {/* Start Game Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.startButton,
            { backgroundColor: canStartGame ? theme.colors.primary : theme.colors.button.disabled },
          ]}
          onPress={handleStartGame}
          disabled={!canStartGame}
        >
          <Text style={[styles.startButtonText, { color: theme.colors.text.white }]}>
            {t('home:actions.start')}
          </Text>
        </TouchableOpacity>

        {!canStartGame && (
          <Text style={[styles.minPlayersText, { color: theme.colors.text.secondary }]}>
            {t('home:addPlayers.minPlayers')}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appSubtitle: {
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingTop: 0,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 64,
  },
  inputSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  minPlayersText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  playersSection: {
    flex: 1,
  },
  settingsButton: {
    borderRadius: 20,
    padding: 8,
  },
  settingsTopRightWrapper: {
    position: 'absolute',
    right: 20,
    top: 10,
    zIndex: 1,
  },
  startButton: {
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 16,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
