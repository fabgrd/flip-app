import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Player } from '../types';
import { Colors } from '../constants';

interface PlayersListProps {
  players: Player[];
  onRemovePlayer: (id: string) => void;
}

export function PlayersList({ players, onRemovePlayer }: PlayersListProps) {
  if (players.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucun joueur ajouté</Text>
        <Text style={styles.emptySubText}>Ajoutez au moins 2 joueurs pour commencer</Text>
      </View>
    );
  }

  const renderPlayer = ({ item, index }: { item: Player; index: number }) => (
    <Animated.View
      entering={FadeInRight.delay(index * 100)}
      exiting={FadeOutLeft}
      style={styles.playerItem}
    >
      <View style={styles.playerInfo}>
        <View style={[styles.playerAvatar, { backgroundColor: getPlayerColor(index) }]}>
          <Text style={styles.playerAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.playerName}>{item.name}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemovePlayer(item.id)}
      >
        <Ionicons name="close" size={20} color={Colors.danger} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.listTitle}>Joueurs ({players.length})</Text>
      <FlatList
        data={players}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const getPlayerColor = (index: number): string => {
  const colors = [
    Colors.primary,
    Colors.secondary,
    Colors.accent,
    Colors.success,
    Colors.warning,
    Colors.danger,
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 15,
  },
  
  listContent: {
    gap: 12,
  },
  
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  playerAvatarText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  playerName: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  
  removeButton: {
    padding: 8,
  },
  
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 5,
  },
  
  emptySubText: {
    fontSize: 14,
    color: Colors.text.light,
    textAlign: 'center',
  },
}); 