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
import { Colors, GlobalStyles, MIN_PLAYERS_GLOBAL, MAX_PLAYERS_GLOBAL } from '../constants';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const MAX_PLAYERS = MAX_PLAYERS_GLOBAL;
const MIN_PLAYERS = MIN_PLAYERS_GLOBAL;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();
  const { players, addPlayer, removePlayer, updatePlayerAvatar } = usePlayers();

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
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.screen}>
        {/* Settings Button Top Right */}
        <View style={styles.settingsTopRightWrapper}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettingsPress}
          >
            <Ionicons name="settings" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>{t('home:title')}</Text>
          <Text style={styles.appSubtitle}>{t('home:subtitle')}</Text>
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
          style={[styles.startButton, !canStartGame && styles.startButtonDisabled]}
          onPress={handleStartGame}
          disabled={!canStartGame}
        >
          <Text style={[styles.startButtonText, !canStartGame && styles.startButtonTextDisabled]}>
            {t('home:actions.start')}
          </Text>
        </TouchableOpacity>

        {!canStartGame && (
          <Text style={styles.minPlayersText}>
            {t('home:addPlayers.minPlayers')}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  settingsTopRightWrapper: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 1,
  },
  headerContent: {
    paddingTop: 64,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}10`,
  },
  inputSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  playersSection: {
    flex: 1,
  },
  footer: {
    padding: 20,
    paddingTop: 0,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonDisabled: {
    backgroundColor: Colors.text.secondary,
    opacity: 0.5,
  },
  startButtonText: {
    color: Colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButtonTextDisabled: {
    color: Colors.text.white,
  },
  minPlayersText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});