import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';

import { T } from '../../constants/flipTokens';

interface ToggleSwitchProps {
  on: boolean;
  onToggle: () => void;
  activeColor?: string;
  inactiveColor?: string;
  disabled?: boolean;
}

const TRACK_W = 52;
const TRACK_H = 30;
const THUMB = 22;
const PADDING = 2;
const BORDER = 2;
const TRAVEL = TRACK_W - THUMB - PADDING * 2 - BORDER * 2;

export function ToggleSwitch({
  on,
  onToggle,
  activeColor = T.mint,
  inactiveColor = T.bgAlt,
  disabled = false,
}: ToggleSwitchProps) {
  const anim = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: on ? 1 : 0,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [on, anim]);

  const left = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [PADDING, PADDING + TRAVEL],
  });

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      style={[s.track, { backgroundColor: on ? activeColor : inactiveColor }]}
    >
      <Animated.View style={[s.thumb, { left }]} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    borderWidth: 2,
    borderColor: T.ink,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: T.paper,
    borderWidth: 1.5,
    borderColor: T.ink,
    elevation: 2,
  },
});
