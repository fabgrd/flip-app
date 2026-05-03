import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { T } from '../../constants/flipTokens';

export interface AvatarProps {
  name: string;
  avatar?: string;
  size?: number;
  onPress?: () => void;
  showEditIcon?: boolean;
  badgeText?: string;
  badgeColor?: string;
}

const ACCENT_COLORS = [T.tomato, T.cobalt, T.mint, T.violet, T.lemon, T.pink];

function getAccentColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENT_COLORS[Math.abs(hash) % ACCENT_COLORS.length];
}

function getTextColor(bg: string): string {
  return bg === T.lemon || bg === T.pink ? T.ink : '#fff';
}

export function Avatar({
  name,
  avatar,
  size = 50,
  onPress,
  showEditIcon = false,
  badgeText,
  badgeColor,
}: AvatarProps) {
  const bg = getAccentColor(name);
  const radius = Math.round(size * 0.28);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    borderWidth: 2,
    borderColor: T.ink,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  };

  const renderBadge = () =>
    badgeText ? (
      <View style={[styles.badge, { backgroundColor: badgeColor ?? T.tomato, top: -6, right: -6 }]}>
        <Text style={styles.badgeText}>{badgeText}</Text>
      </View>
    ) : null;

  if (avatar) {
    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <View style={[styles.container, containerStyle]}>
          <Image
            source={{ uri: avatar }}
            style={[styles.image, { width: size, height: size, borderRadius: radius }]}
            contentFit="cover"
          />
          {renderBadge()}
          {showEditIcon && (
            <View style={styles.editIcon}>
              <Text style={styles.editIconText}>📷</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View
        style={[styles.container, styles.defaultAvatar, containerStyle, { backgroundColor: bg }]}
      >
        <Text style={[styles.initials, { fontSize: size * 0.38, color: getTextColor(bg) }]}>
          {name.charAt(0).toUpperCase()}
        </Text>
        {renderBadge()}
        {showEditIcon && (
          <View style={styles.editIcon}>
            <Text style={styles.editIconText}>📷</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

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
  editIcon: {
    alignItems: 'center',
    backgroundColor: T.tomato,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: T.ink,
    bottom: -4,
    height: 22,
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    width: 22,
  },
  editIconText: { fontSize: 10 },
  image: {},
  initials: { fontWeight: '900' },
});
