import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { T } from '../../constants/flipTokens';
import type { Player } from '../../types';
import { Avatar } from './Avatar';

interface PlayerPickerGridProps<P extends Player = Player> {
  players: P[];
  onSelect?: (player: P, index: number) => void;
  selectedId?: string | null;
  shadowColor?: string;
  selectedColor?: string;
  avatarSize?: number;
  minCardHeight?: number;
  isDisabled?: (player: P) => boolean;
  renderBadge?: (player: P, index: number, selected: boolean) => React.ReactNode;
  nameColor?: string;
  selectedNameColor?: string;
}

export function PlayerPickerGrid<P extends Player = Player>({
  players,
  onSelect,
  selectedId,
  shadowColor = T.ink,
  selectedColor = T.pink,
  avatarSize = 52,
  minCardHeight = 110,
  isDisabled,
  renderBadge,
  nameColor = T.ink,
  selectedNameColor,
}: PlayerPickerGridProps<P>) {
  return (
    <ScrollView
      style={styles.grid}
      contentContainerStyle={styles.gridContent}
      showsVerticalScrollIndicator={false}
    >
      {players.map((item, index) => {
        const selected = selectedId === item.id;
        const disabled = isDisabled?.(item) ?? false;
        const canSelect = !!onSelect && !disabled;

        const cardStyle = [
          styles.card,
          { shadowColor, minHeight: minCardHeight },
          selected && [styles.cardSelected, { backgroundColor: selectedColor }],
          disabled && styles.cardDisabled,
        ];

        const nameStyle = [
          styles.name,
          { color: selected && selectedNameColor ? selectedNameColor : nameColor },
        ];

        const inner = (
          <>
            {renderBadge?.(item, index, selected)}
            <Avatar name={item.name} avatar={item.avatar} size={avatarSize} />
            <Text style={nameStyle} numberOfLines={1}>
              {item.name}
            </Text>
          </>
        );

        if (canSelect) {
          return (
            <TouchableOpacity
              key={item.id}
              style={cardStyle}
              onPress={() => onSelect(item, index)}
              activeOpacity={0.85}
            >
              {inner}
            </TouchableOpacity>
          );
        }
        return (
          <View key={item.id} style={cardStyle}>
            {inner}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: { flex: 1 },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  card: {
    width: '47%',
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
    justifyContent: 'center',
  },
  cardSelected: {
    transform: [{ translateX: 4 }, { translateY: 4 }],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    elevation: 0,
  },
  cardDisabled: { opacity: 0.4 },
  name: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
    textAlign: 'center',
    maxWidth: 100,
  },
});
