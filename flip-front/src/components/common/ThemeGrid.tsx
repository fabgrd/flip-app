import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { T } from '../../constants/flipTokens';

export interface ThemeGridOption<V extends string = string> {
  value: V;
  label: string;
  emoji: string;
  color?: string;
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
      {options.map((opt) => (
        <ThemeCard
          key={opt.value}
          option={opt}
          active={isActive(opt.value)}
          allowed={isAllowed ? isAllowed(opt.value) : true}
          widthPct={widthPct}
          onPress={() => onSelect(opt.value)}
          onLockedPress={() => onLockedPress?.(opt.value)}
        />
      ))}
    </View>
  );
}

interface ThemeCardProps<V extends string> {
  option: ThemeGridOption<V>;
  active: boolean;
  allowed: boolean;
  widthPct: `${number}%`;
  onPress: () => void;
  onLockedPress: () => void;
}

function ThemeCard<V extends string>({
  option,
  active,
  allowed,
  widthPct,
  onPress,
  onLockedPress,
}: ThemeCardProps<V>) {
  const scale = useRef(new Animated.Value(1)).current;
  const accent = option.color ?? T.lemon;

  const animatePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 40, bounciness: 0 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 14 }),
    ]).start();
  };

  const handlePress = () => {
    if (!allowed) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      onLockedPress();
      return;
    }
    Haptics.selectionAsync();
    animatePress();
    onPress();
  };

  return (
    <Animated.View
      style={[
        { width: widthPct },
        { transform: [{ scale }] },
      ]}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          s.card,
          { borderColor: allowed ? accent : '#DCD3C5', shadowColor: allowed ? accent : T.ink },
          active && allowed && [s.cardActive, { backgroundColor: accent }],
          !allowed && s.cardLocked,
          pressed && allowed && s.cardPressed,
        ]}
      >
        <View
          style={[
            s.emojiCircle,
            { backgroundColor: allowed ? `${accent}26` : '#EFEAE3' },
            active && allowed && { backgroundColor: 'rgba(255,255,255,0.25)' },
          ]}
        >
          <Text style={s.emoji}>{option.emoji}</Text>
        </View>
        <Text
          style={[s.name, active && allowed && s.nameActive, !allowed && s.nameLocked]}
          numberOfLines={1}
        >
          {option.label}
        </Text>
        {!allowed && <Feather name="lock" size={11} color={T.ink} style={s.lockIcon} />}
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    position: 'relative',
  },
  cardActive: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    elevation: 0,
    transform: [{ translateX: 3 }, { translateY: 3 }],
  },
  cardPressed: {
    shadowOffset: { width: 1, height: 1 },
  },
  cardLocked: {
    backgroundColor: '#EFEAE3',
    borderColor: '#DCD3C5',
    opacity: 0.78,
    shadowOpacity: 0,
    elevation: 0,
  },
  emojiCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 18, lineHeight: 22 },
  lockIcon: { marginLeft: 'auto' },
  name: {
    flex: 1,
    color: T.ink,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  nameActive: { color: '#fff' },
  nameLocked: { color: T.muted },
});
