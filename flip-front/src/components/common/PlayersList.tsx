import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { T } from '../../constants/flipTokens';
import { useImagePicker } from '../../hooks/useImagePicker';
import { Player } from '../../types';

const ACCENT_COLORS = [T.tomato, T.cobalt, T.lemon, T.mint, T.violet, T.pink];

interface PlayersListProps {
  players: Player[];
  onRemovePlayer: (id: string) => void;
  onUpdateAvatar: (id: string, avatar: string) => void;
}

export function PlayersList({ players, onRemovePlayer, onUpdateAvatar }: PlayersListProps) {
  const { showImagePicker } = useImagePicker();
  const { t } = useTranslation();

  const handleAvatarPress = async (player: Player) => {
    const imageUri = await showImagePicker();
    if (imageUri) onUpdateAvatar(player.id, imageUri);
  };

  if (players.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Personne encore… solitude triste 😔</Text>
        <Text style={styles.emptyHint}>{t('messages.addAtLeastOnePlayerToStart')}</Text>
      </View>
    );
  }

  const renderPlayer = ({ item, index }: { item: Player; index: number }) => {
    const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
    const isLight = accent === T.lemon || accent === T.pink;
    return (
      <Animated.View entering={FadeInRight.delay(index * 80)} exiting={FadeOutLeft}>
        <View style={styles.playerRow}>
          {/* Color accent initial badge */}
          <TouchableOpacity onPress={() => handleAvatarPress(item)} activeOpacity={0.85}>
            <View style={[styles.playerBadge, { backgroundColor: accent }]}>
              <Text style={[styles.playerBadgeText, { color: isLight ? T.ink : '#fff' }]}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.playerName} numberOfLines={1}>
            {item.name}
          </Text>

          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => onRemovePlayer(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.removeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.listHeader}>
        <Text style={styles.listLabel}>JOUEURS</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{players.length}</Text>
        </View>
      </View>
      <FlatList
        data={players}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  listLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  countBadge: {
    backgroundColor: T.tomato,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: T.ink,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: '#fff', fontSize: 11, fontWeight: '900' },

  list: { gap: 10, paddingRight: 4, paddingBottom: 4 },

  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rSm,
    paddingLeft: 8,
    paddingRight: 14,
    paddingVertical: 8,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },

  playerBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerBadgeText: { fontSize: 18, fontWeight: '900' },

  playerName: {
    flex: 1,
    color: T.ink,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { color: T.muted, fontSize: 16 },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    borderWidth: 2,
    borderColor: `${T.muted}60`,
    borderStyle: 'dashed',
    borderRadius: T.rMd,
    marginTop: 4,
  },
  emptyText: { color: T.muted, fontSize: 15, textAlign: 'center' },
  emptyHint: { color: `${T.muted}99`, fontSize: 13, marginTop: 4, textAlign: 'center' },
});
