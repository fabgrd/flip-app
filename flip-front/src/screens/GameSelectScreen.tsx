import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { RootStackParamList, Game } from '../types';
import { Colors, GlobalStyles, AVAILABLE_GAMES } from '../constants';

type GameSelectScreenRouteProp = RouteProp<RootStackParamList, 'GameSelect'>;

export function GameSelectScreen() {
  const route = useRoute<GameSelectScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { players } = route.params;

  const handleSelectGame = (game: Game) => {
    if (game.id === '6-qui-prend') {
      // Naviguer vers l'écran du jeu "6 qui prend!"
      navigation.navigate('TakeSixGame', { players });
    } else {
      // Pour les autres jeux
      alert(`Jeu "${game.name}" sélectionné avec ${players.length} joueurs!\nFonctionnalité en cours de développement.`);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderGame = ({ item, index }: { item: Game; index: number }) => (
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
            {item.minPlayers}-{item.maxPlayers} joueurs
          </Text>
          <Text style={styles.gameDescription}>{item.description}</Text>
        </View>

        <View style={styles.gameArrow}>
          <Ionicons name="chevron-forward" size={24} color={Colors.text.secondary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.screenTitle}>Choisir un jeu</Text>
            <Text style={styles.playersInfo}>
              {players.length} joueur{players.length > 1 ? 's' : ''} : {players.map(p => p.name).join(', ')}
            </Text>
          </View>
        </View>

        {/* Liste des jeux */}
        <View style={styles.gamesSection}>
          <Text style={styles.sectionTitle}>Jeux disponibles</Text>

          <FlatList
            data={AVAILABLE_GAMES}
            renderItem={renderGame}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gamesList}
          />
        </View>

        {/* Info section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Plus de jeux seront bientôt disponibles !
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },

  playersInfo: {
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

  gameArrow: {
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