import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { T } from '../../constants/flipTokens';

export interface ThemeGridOption<V extends string = string> {
  value: V;
  label: string;
  emoji: string;
}

interface ThemeGridProps<V extends string = string> {
  options: ThemeGridOption<V>[];
  isActive: (value: V) => boolean;
  isAllowed?: (value: V) => boolean;
  onSelect: (value: V) => void;
  onLockedPress?: (value: V) => void;
  columns?: number;
}

export function ThemeGrid<V extends string = string>({
  options,
  isActive,
  isAllowed,
  onSelect,
  onLockedPress,
  columns = 2,
}: ThemeGridProps<V>) {
  const widthPct = `${(100 - (columns - 1) * 2.5) / columns}%` as const;

  return (
    <View style={s.grid}>
      {options.map((opt) => {
        const active = isActive(opt.value);
        const allowed = isAllowed ? isAllowed(opt.value) : true;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              s.card,
              { width: widthPct },
              active && allowed && s.cardActive,
              !allowed && s.cardLocked,
            ]}
            onPress={() => (allowed ? onSelect(opt.value) : onLockedPress?.(opt.value))}
            activeOpacity={0.85}
          >
            <Text style={s.emoji}>{opt.emoji}</Text>
            <Text
              style={[s.name, active && allowed && s.nameActive, !allowed && s.nameLocked]}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
            {!allowed && <Feather name="lock" size={11} color={T.ink} style={s.lockIcon} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    position: 'relative',
  },
  cardActive: {
    backgroundColor: T.ink,
    transform: [{ translateX: 3 }, { translateY: 3 }],
    shadowOpacity: 0,
    elevation: 0,
  },
  cardLocked: {
    backgroundColor: '#EFEAE3',
    borderColor: '#DCD3C5',
    opacity: 0.78,
    shadowOpacity: 0,
    elevation: 0,
  },
  lockIcon: { marginLeft: 'auto' },
  emoji: { fontSize: 18 },
  name: {
    flex: 1,
    color: T.ink,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  nameActive: { color: '#fff' },
  nameLocked: { color: T.muted },
});
