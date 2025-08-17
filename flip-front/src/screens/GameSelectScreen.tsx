import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTranslation } from 'react-i18next';
import { createGlobalStyles } from '../constants';
import { AVAILABLE_GAMES, navigateToGame } from '../constants/games';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';

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
  const { theme } = useTheme();
  const GlobalStyles = createGlobalStyles(theme);
  const handleSelectGame = (game: GameMetadata) => {
    try {
      navigateToGame(navigation, game.id, players);
    } catch (error) {
      // Fallback pour les jeux non encore migrés
      if (game.id === 'purity-test') {
        navigation.navigate('PurityTest', { players });
      } else if (game.id === 'cameleon') {
        navigation.navigate('Cameleon', { players });
      } else {
        alert(
          `Game "${game.name}" selected with ${players.length} players!\nFeature under development.`,
        );
      }
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderGame = ({ item, index }: { item: GameMetadata; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 200)}>
      <TouchableOpacity
        style={[
          styles.gameCard,
          { backgroundColor: theme.colors.surface, shadowColor: theme.colors.primary },
        ]}
        onPress={() => handleSelectGame(item)}
      >
        <View style={[styles.gameIcon, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="game-controller" size={32} color={theme.colors.text.white} />
        </View>

        <View style={styles.gameContent}>
          <Text style={[styles.gameTitle, { color: theme.colors.text.primary }]}>{item.name}</Text>
          <Text style={[styles.gameInfo, { color: theme.colors.text.secondary }]}>
            {item.minPlayers}-{item.maxPlayers} {t('common:labels.players')}
          </Text>
          <Text style={[styles.gameDescription, { color: theme.colors.text.secondary }]}>
            {item.description}
          </Text>
        </View>

        <View style={styles.playButton}>
          <Ionicons name="play" size={20} color={theme.colors.primary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView
      style={[
        GlobalStyles.container,
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            {t('navigation:screens.gameSelect')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
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
  backButton: {
    marginRight: 12,
    padding: 8,
  },

  container: {
    flex: 1,
  },

  gameCard: {
    alignItems: 'center',
    borderRadius: 16,
    elevation: 4,
    flexDirection: 'row',
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  gameContent: {
    flex: 1,
  },

  gameDescription: {
    fontSize: 14,
    lineHeight: 18,
  },

  gameIcon: {
    alignItems: 'center',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginRight: 16,
    width: 60,
  },

  gameInfo: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },

  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  gamesList: {
    gap: 16,
  },

  gamesSection: {
    flex: 1,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },

  headerContent: {
    flex: 1,
  },

  headerSubtitle: {
    fontSize: 14,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  infoSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  infoText: {
    fontSize: 14,
    fontStyle: 'italic',
  },

  playButton: {
    marginLeft: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
});
