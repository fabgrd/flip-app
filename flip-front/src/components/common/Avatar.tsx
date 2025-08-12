import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../contexts/ThemeContext';

export interface AvatarProps {
  name: string;
  avatar?: string;
  size?: number;
  onPress?: () => void;
  showEditIcon?: boolean;
  badgeText?: string;
  badgeColor?: string;
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
  const { theme } = useTheme();
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBackgroundColor = (fullName: string) => {
    const colors = [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.accent,
      theme.colors.success,
      theme.colors.warning,
      theme.colors.danger,
    ];
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  } as const;

  const renderBadge = () =>
    badgeText ? (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: badgeColor ?? theme.colors.danger,
            top: -4,
            right: -4,
            borderColor: theme.colors.background,
          },
        ]}
      >
        <Text style={[styles.badgeText, { color: theme.colors.text.white }]}>{badgeText}</Text>
      </View>
    ) : null;

  if (avatar) {
    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <View style={[styles.container, containerStyle]}>
          <Image
            source={{ uri: avatar }}
            style={[styles.image, containerStyle, { borderColor: theme.colors.background }]}
            contentFit="cover"
          />
          {renderBadge()}
          {showEditIcon && (
            <View
              style={[
                styles.editIcon,
                { backgroundColor: theme.colors.primary, borderColor: theme.colors.background },
              ]}
            >
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
        style={[
          styles.container,
          styles.defaultAvatar,
          containerStyle,
          { backgroundColor: getBackgroundColor(name), borderColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.initials, { fontSize: size * 0.4, color: theme.colors.text.white }]}>
          {getInitials(name)}
        </Text>
        {renderBadge()}
        {showEditIcon && (
          <View
            style={[
              styles.editIcon,
              { backgroundColor: theme.colors.primary, borderColor: theme.colors.background },
            ]}
          >
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
    borderRadius: 11,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    minWidth: 22,
    paddingHorizontal: 6,
    position: 'absolute',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  container: {
    elevation: 3,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  defaultAvatar: {
    alignItems: 'center',
    borderWidth: 2,
    justifyContent: 'center',
  },
  editIcon: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    bottom: -2,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: -2,
    width: 24,
  },
  editIconText: {
    fontSize: 10,
  },
  image: {
    borderWidth: 2,
  },
  initials: {
    fontWeight: 'bold',
  },
});
