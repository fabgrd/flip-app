import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { T } from '../../constants/flipTokens';
import type { Player } from '../../types';
import { Avatar } from './Avatar';

interface PlayerPickerGridProps {
  players: Player[];
  onSelect: (player: Player, index: number) => void;
  selectedId?: string | null;
  shadowColor?: string;
}

export function PlayerPickerGrid({
  players,
  onSelect,
  selectedId,
  shadowColor = T.ink,
}: PlayerPickerGridProps) {
  return (
    <FlatList
      data={players}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={({ item, index }) => {
        const selected = selectedId === item.id;
        return (
          <TouchableOpacity
            style={styles.wrapper}
            onPress={() => onSelect(item, index)}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.card,
                { shadowColor },
                selected && styles.cardSelected,
              ]}
            >
              <Avatar name={item.name} avatar={item.avatar} size={52} />
              <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 },
  row: { gap: 10, marginBottom: 10 },
  wrapper: { flex: 1 },
  card: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 8,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    minHeight: 110,
    justifyContent: 'center',
  },
  cardSelected: {
    backgroundColor: T.pink,
    transform: [{ translateX: 4 }, { translateY: 4 }],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    elevation: 0,
  },
  name: {
    color: T.ink,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
    textAlign: 'center',
    maxWidth: 100,
  },
  nameSelected: { color: T.ink },
});
