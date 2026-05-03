import { TFunction } from 'i18next';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../../../components/common/Avatar';
import { T } from '../../../constants/flipTokens';
import type { CameleonAssignedPlayer } from '../types';

interface PlayerGridProps {
  players: CameleonAssignedPlayer[];
  isVote: boolean;
  clueOrder?: string[];
  selectedForElimination?: string | null;
  onSelect?: (id: string) => void;
  t: TFunction;
}

export function PlayerGrid({
  players,
  isVote,
  clueOrder = [],
  selectedForElimination,
  onSelect,
  t,
}: PlayerGridProps) {
  const ordered =
    clueOrder.length > 0
      ? (clueOrder
        .map((id) => players.find((p) => p.id === id)!)
        .filter(Boolean) as CameleonAssignedPlayer[])
      : players;

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={ordered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item, index }) => {
          const selected = selectedForElimination === item.id && isVote;
          const canSelect = isVote && !item.isEliminated && onSelect;

          const card = (
            <View
              style={[
                styles.playerCard,
                selected && styles.playerCardSelected,
                item.isEliminated && styles.playerCardEliminated,
              ]}
            >
              {/* Order badge */}
              {item.isEliminated ? (
                <View style={styles.eliminatedBadge}>
                  <Text style={styles.eliminatedBadgeText}>
                    {t('cameleon:badges.eliminated', 'Éliminé')}
                  </Text>
                </View>
              ) : (
                <View style={[styles.orderBadge, selected && styles.orderBadgeSelected]}>
                  <Text style={[styles.orderBadgeText, selected && styles.orderBadgeTextSelected]}>
                    {index + 1}
                  </Text>
                </View>
              )}

              <Avatar name={item.name} avatar={item.avatar} size={60} />
              <Text
                style={[styles.playerName, selected && styles.playerNameSelected]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </View>
          );

          if (canSelect) {
            return (
              <TouchableOpacity
                style={styles.playerCardWrapper}
                onPress={() => onSelect(item.id)}
                activeOpacity={0.85}
              >
                {card}
              </TouchableOpacity>
            );
          }
          return <View style={styles.playerCardWrapper}>{card}</View>;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  row: { gap: 10, marginBottom: 10 },

  playerCardWrapper: { flex: 1 },

  playerCard: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 8,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    minHeight: 120,
    justifyContent: 'center',
  },

  playerCardSelected: {
    backgroundColor: T.tomato,
    transform: [{ translateX: 4 }, { translateY: 4 }],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    elevation: 0,
  },

  playerCardEliminated: { opacity: 0.4 },

  orderBadge: {
    position: 'absolute',
    top: 8,
    left: 10,
    width: 22,
    height: 22,
    borderRadius: 8,
    backgroundColor: T.bg,
    borderWidth: 1.5,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBadgeSelected: { backgroundColor: T.ink },
  orderBadgeText: { color: T.ink, fontSize: 11, fontWeight: '900' },
  orderBadgeTextSelected: { color: '#fff' },

  eliminatedBadge: {
    position: 'absolute',
    top: 8,
    left: 10,
    backgroundColor: T.inkSoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  eliminatedBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  playerName: {
    color: T.ink,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
    maxWidth: 100,
    textAlign: 'center',
  },
  playerNameSelected: { color: '#fff' },
});
