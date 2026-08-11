import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { offsetShadow, T } from '../../constants/flipTokens';
import { Avatar } from './Avatar';
import { KeyboardAvoider } from './KeyboardAvoider';

export interface PopModalProps {
  visible: boolean;
  title?: string;
  name?: string;
  color?: string;
  children?: React.ReactNode;
  badgeEmoji?: string;
  badgeColor?: string;
}

export function PopModal({
  visible,
  title,
  name,
  color,
  children,
  badgeEmoji,
  badgeColor,
}: PopModalProps) {
  if (!visible) return null;
  return (
    <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} />
      <KeyboardAvoider style={styles.avoider}>
        <View style={styles.card} pointerEvents="auto">
          {name && (
            <View style={styles.avatarWrapper}>
              <Avatar name={name} color={color ?? T.tomato} size={80} />
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
      </KeyboardAvoider>
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
  avoider: { alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    alignItems: 'center',
    maxWidth: '86%',
    paddingHorizontal: 24,
    paddingVertical: 22,
    ...offsetShadow(6),
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
