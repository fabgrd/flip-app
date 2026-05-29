import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { T } from '../../constants/flipTokens';

export interface AvatarProps {
  name: string;
  color: string;
  size?: number;
  onPress?: () => void;
  badgeText?: string;
  badgeColor?: string;
}

const LIGHT_BG = new Set<string>([T.lemon, T.pink, T.lime, T.sky]);

function getTextColor(bg: string): string {
  return LIGHT_BG.has(bg) ? T.ink : '#fff';
}

function AvatarBase({ name, color, size = 50, onPress, badgeText, badgeColor }: AvatarProps) {
  const radius = Math.round(size * 0.28);
  const borderWidth = 2;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    borderWidth,
    borderColor: T.ink,
    overflow: 'hidden' as const,
  };

  const renderBadge = () =>
    badgeText ? (
      <View style={[styles.badge, { backgroundColor: badgeColor ?? T.tomato, top: -6, right: -6 }]}>
        <Text style={styles.badgeText}>{badgeText}</Text>
      </View>
    ) : null;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View
        style={[styles.container, styles.defaultAvatar, containerStyle, { backgroundColor: color }]}
      >
        <Text style={[styles.initials, { fontSize: size * 0.38, color: getTextColor(color) }]}>
          {name.charAt(0).toUpperCase()}
        </Text>
        {renderBadge()}
      </View>
    </TouchableOpacity>
  );
}

export const Avatar = memo(AvatarBase);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: T.ink,
    height: 22,
    justifyContent: 'center',
    minWidth: 22,
    paddingHorizontal: 6,
    position: 'absolute',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  container: {
    position: 'relative',
  },
  defaultAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontWeight: '900' },
});
