import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { T } from '../../constants/flipTokens';

interface FlatChunkyButtonProps {
  onPress?: () => void;
  color?: string;
  textColor?: string;
  children: React.ReactNode;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  full?: boolean;
  style?: ViewStyle;
  square?: boolean;
  metrics?: Partial<{ height: number; fontSize: number; paddingH: number; radius: number }>;
  buttonStyle?: ViewStyle;
}

const SIZES = {
  xs: { height: 36, fontSize: 13, paddingH: 12, radius: T.rSm },
  sm: { height: 44, fontSize: 14, paddingH: 16, radius: T.rSm },
  md: { height: 56, fontSize: 16, paddingH: 22, radius: T.rMd },
  lg: { height: 62, fontSize: 18, paddingH: 26, radius: T.rMd },
};

const LIGHT_BUTTON_COLORS: string[] = [T.lemon, T.pink, T.paper, T.bg, T.bgAlt, T.mint, T.lime, T.sky];

export function FlatChunkyButton({
  onPress,
  color = T.ink,
  textColor,
  children,
  disabled = false,
  size = 'md',
  full = false,
  style,
  square = false,
  metrics,
  buttonStyle,
}: FlatChunkyButtonProps) {
  const fg = textColor ?? (LIGHT_BUTTON_COLORS.includes(color) ? T.ink : '#fff');
  const s = { ...SIZES[size], ...(metrics ?? {}) };
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scale, { toValue: 0.95, duration: 55, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }).start();
  };

  const containerStyle: ViewStyle = {
    alignSelf: full ? 'stretch' : 'flex-start',
    ...(style as ViewStyle),
  };

  const buttonSizing: ViewStyle = {
    height: s.height,
    borderRadius: s.radius,
    paddingHorizontal: square ? 0 : s.paddingH,
    width: square ? s.height : undefined,
  };

  return (
    <View style={containerStyle}>
      <Animated.View
        style={[
          styles.btn,
          { backgroundColor: color, transform: [{ scale }], opacity: disabled ? 0.4 : 1 },
          buttonSizing,
          buttonStyle,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled}
          activeOpacity={1}
          style={styles.inner}
        >
          {typeof children === 'string' ? (
            <Text style={[styles.text, { color: fg, fontSize: s.fontSize }]}>{children}</Text>
          ) : (
            children
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '900',
    letterSpacing: -0.3,
  },
});
