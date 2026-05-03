import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { T } from '../../constants/flipTokens';
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
  if (!visible) return null;
  return (
    <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} />
      <View style={styles.card} pointerEvents="auto">
        {name && (
          <View style={styles.avatarWrapper}>
            <Avatar name={name} avatar={avatar} size={80} />
            {!!badgeEmoji && (
              <Animated.Text
                entering={ZoomIn}
                style={[styles.badge, { color: badgeColor ?? T.tomato }]}
              >
                {badgeEmoji}
              </Animated.Text>
            )}
          </View>
        )}
        {!!title && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(24,22,19,0.55)',
    zIndex: 100,
  },
  card: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    alignItems: 'center',
    maxWidth: '86%',
    paddingHorizontal: 24,
    paddingVertical: 22,
    shadowColor: T.ink,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  avatarWrapper: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { bottom: -8, fontSize: 24, position: 'absolute', right: -8 },
  title: {
    color: T.ink,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 12,
    textAlign: 'center',
  },
});
