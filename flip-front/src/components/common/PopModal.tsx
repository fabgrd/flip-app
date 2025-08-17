import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { Avatar } from './Avatar';

export interface PopModalProps {
  visible: boolean;
  title?: string;
  name?: string;
  avatar?: string;
  children?: React.ReactNode;
  badgeEmoji?: string;
  badgeColor?: string;
}

export function PopModal({
  visible,
  title,
  name,
  avatar,
  children,
  badgeEmoji,
  badgeColor,
}: PopModalProps) {
  const { theme } = useTheme();
  if (!visible) return null;
  return (
    <Animated.View
      entering={ZoomIn}
      exiting={ZoomOut}
      style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}
    >
      <Pressable style={StyleSheet.absoluteFill} />
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.secondary,
            shadowColor: theme.colors.secondary,
          },
        ]}
        pointerEvents="auto"
      >
        {name && (
          <View style={styles.avatarWrapper}>
            <Avatar name={name} avatar={avatar} size={84} />
            {!!badgeEmoji && (
              <Animated.Text
                entering={ZoomIn}
                style={[styles.badge, { color: badgeColor ?? '#C62828' }]}
              >
                {badgeEmoji}
              </Animated.Text>
            )}
          </View>
        )}
        {!!title && (
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>{title}</Text>
        )}
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { bottom: -6, fontSize: 24, position: 'absolute', right: -6 },
  card: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 3,
    elevation: 8,
    maxWidth: '86%',
    paddingHorizontal: 22,
    paddingVertical: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
  },
  overlay: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  title: { fontSize: 20, fontWeight: '900', marginTop: 10, textAlign: 'center' },
});
