import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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
  const { players, addPlayer, removePlayer, updatePlayerAvatar } = usePlayers();

  const handleAddPlayer = (name: string): boolean => {
    const success = addPlayer(name);
    if (success) {
      // Feedback haptique
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

  const canStartGame = players.length >= MIN_PLAYERS;

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>FL!P</Text>
          <Text style={styles.appSubtitle}>Jeu d'alcool entre amis</Text>
        </View>

        {/* Ajout de joueurs */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Ajouter des joueurs</Text>
          <PlayerInput
            onAddPlayer={handleAddPlayer}
            maxPlayers={MAX_PLAYERS}
            currentPlayerCount={players.length}
          />
        </View>

        {/* Liste des joueurs */}
        <View style={styles.playersSection}>
          <PlayersList
            players={players}
            onRemovePlayer={handleRemovePlayer}
            onUpdateAvatar={updatePlayerAvatar}
          />
        </View>

        {/* Bouton Jouer */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              GlobalStyles.buttonPrimary,
              styles.playButton,
              !canStartGame && styles.playButtonDisabled
            ]}
            onPress={handleStartGame}
            disabled={!canStartGame}
          >
            <Text style={[
              GlobalStyles.buttonText,
              !canStartGame && styles.disabledButtonText
            ]}>
              {canStartGame ? 'Jouer !' : `Il faut au moins ${MIN_PLAYERS} joueurs`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },

  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },

  appSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  inputSection: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 15,
  },

  playersSection: {
    flex: 1,
  },

  actionSection: {
    paddingTop: 20,
  },

  playButton: {
    marginBottom: 20,
  },

  playButtonDisabled: {
    backgroundColor: Colors.button.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },

  disabledButtonText: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
}); 