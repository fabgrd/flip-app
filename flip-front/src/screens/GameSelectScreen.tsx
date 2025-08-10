import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { RootStackParamList } from '../types';
import { Colors, GlobalStyles } from '../constants';
import { navigateToGame, AVAILABLE_GAMES } from '../constants/games';
import { useTranslation } from 'react-i18next';


type GameSelectScreenRouteProp = RouteProp<RootStackParamList, 'GameSelect'>;

interface GameMetadata {
  id: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  description: string;
}

export function GameSelectScreen() {
  const route = useRoute<GameSelectScreenRouteProp>();
  const navigation = useNavigation();
  const { players } = route.params;
  const { t } = useTranslation();

  const handleSelectGame = (game: GameMetadata) => {
    try {
      navigateToGame(navigation, game.id, players);
    } catch (error) {
      // Fallback pour les jeux non encore migrés
      if (game.id === 'purity-test') {
        (navigation as any).navigate('PurityTest', { players });
      } else {
        alert(`Jeu "${game.name}" sélectionné avec ${players.length} joueurs!\nFonctionnalité en cours de développement.`);
      }
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderGame = ({ item, index }: { item: GameMetadata; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 200)}
    >
      <TouchableOpacity
        style={styles.gameCard}
        onPress={() => handleSelectGame(item)}
      >
        <View style={styles.gameIcon}>
          <Ionicons name="game-controller" size={32} color={Colors.text.white} />
        </View>

        <View style={styles.gameContent}>
          <Text style={styles.gameTitle}>{item.name}</Text>
          <Text style={styles.gameInfo}>
            {item.minPlayers}-{item.maxPlayers} {t('common:labels.players')}
          </Text>
          <Text style={styles.gameDescription}>{item.description}</Text>
        </View>

        <View style={styles.playButton}>
          <Ionicons name="play" size={20} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[GlobalStyles.container, styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('navigation:screens.gameSelect')}</Text>
          <Text style={styles.headerSubtitle}>
            {players.length} {t('common:labels.players')} · {t('common:labels.readyToPlay')}
          </Text>
        </View>
      </View>

      <FlatList
        data={AVAILABLE_GAMES}
        renderItem={renderGame}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gamesList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  backButton: {
    padding: 8,
    marginRight: 12,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },

  gamesSection: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 20,
  },

  gamesList: {
    gap: 16,
  },

  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  gameIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  gameContent: {
    flex: 1,
  },

  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },

  gameInfo: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 8,
    fontWeight: '500',
  },

  gameDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 18,
  },

  playButton: {
    marginLeft: 12,
  },

  infoSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  infoText: {
    fontSize: 14,
    color: Colors.text.light,
    fontStyle: 'italic',
  },
}); 