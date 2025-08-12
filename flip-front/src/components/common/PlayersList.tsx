import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Player } from '../../types';
import { Avatar } from './Avatar';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useTheme } from '../../contexts/ThemeContext';

interface PlayersListProps {
  players: Player[];
  onRemovePlayer: (id: string) => void;
  onUpdateAvatar: (id: string, avatar: string) => void;
}

export function PlayersList({ players, onRemovePlayer, onUpdateAvatar }: PlayersListProps) {
  const { showImagePicker } = useImagePicker();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const handleAvatarPress = async (player: Player) => {
    const imageUri = await showImagePicker();
    if (imageUri) {
      onUpdateAvatar(player.id, imageUri);
    }
  };

  if (players.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          {t('messages.noPlayersAdded')}
        </Text>
        <Text style={[styles.emptySubText, { color: theme.colors.text.light }]}>
          {t('messages.addAtLeastOnePlayerToStart')}
        </Text>
      </View>
    );
  }

  const renderPlayer = ({ item, index }: { item: Player; index: number }) => (
    <Animated.View
      entering={FadeInRight.delay(index * 100)}
      exiting={FadeOutLeft}
      style={[styles.playerItem, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.playerInfo}>
        <Avatar
          name={item.name}
          avatar={item.avatar}
          size={50}
          onPress={() => handleAvatarPress(item)}
          showEditIcon
        />
        <Text style={[styles.playerName, { color: theme.colors.text.primary }]}>{item.name}</Text>
      </View>

      <TouchableOpacity style={styles.removeButton} onPress={() => onRemovePlayer(item.id)}>
        <Ionicons name="close" size={20} color={theme.colors.danger} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.listTitle, { color: theme.colors.text.primary }]}>
        {t('labels.players')} ({players.length})
      </Text>
      <FlatList
        data={players}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        // @ts-ignore
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },

  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },

  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 16,
    marginBottom: 5,
  },

  listContent: {
    gap: 12,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },

  playerInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },

  playerItem: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  playerName: {
    fontSize: 16,
    fontWeight: '500',
  },

  removeButton: {
    padding: 8,
  },
});
