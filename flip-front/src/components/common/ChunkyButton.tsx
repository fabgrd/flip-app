import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { T } from '../../constants/flipTokens';

interface ChunkyButtonProps {
  onPress?: () => void;
  color?: string;
  textColor?: string;
  children: React.ReactNode;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  full?: boolean;
  style?: ViewStyle;
  shadowColor?: string;
  square?: boolean;
  metrics?: Partial<{ height: number; fontSize: number; paddingH: number; radius: number }>;
  buttonStyle?: ViewStyle;
  shadowStyle?: ViewStyle;
}

const SIZES = {
  xs: { height: 36, fontSize: 13, paddingH: 12, radius: T.rSm },
  sm: { height: 44, fontSize: 14, paddingH: 16, radius: T.rSm },
  md: { height: 56, fontSize: 16, paddingH: 22, radius: T.rMd },
  lg: { height: 62, fontSize: 18, paddingH: 26, radius: T.rMd },
};

export function ChunkyButton({
  onPress,
  color = T.tomato,
  textColor,
  children,
  disabled = false,
  size = 'md',
  full = false,
  style,
  shadowColor = T.ink,
  square = false,
  metrics,
  buttonStyle,
  shadowStyle,
}: ChunkyButtonProps) {
  const fg = textColor ?? (color === T.lemon || color === T.pink ? T.ink : '#fff');
  const s = { ...SIZES[size], ...(metrics ?? {}) };
  const anim = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.timing(anim, { toValue: 1, duration: 55, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.timing(anim, { toValue: 0, duration: 80, useNativeDriver: true }).start();
  };

  const translateStyle = {
    transform: [
      { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) },
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) },
    ],
  };

  const containerStyle: ViewStyle = {
    width: full ? '100%' : undefined,
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
    <View style={[styles.wrapper, containerStyle]}>
      {/* Static shadow layer */}
      <View
        style={[
          styles.shadow,
          {
            height: s.height,
            borderRadius: s.radius,
            backgroundColor: shadowColor,
          },
          shadowStyle,
        ]}
      />
      {/* Animated button layer */}
      <Animated.View
        style={[
          styles.btn,
          {
            backgroundColor: disabled ? `${color}88` : color,
          },
          buttonSizing,
          buttonStyle,
          translateStyle,
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
  wrapper: {
    // Extra space for the shadow offset
    marginBottom: 4,
    marginRight: 4,
  },
  shadow: {
    borderWidth: 2,
    borderColor: T.ink,
    position: 'absolute',
    bottom: -4,
    right: -4,
    left: 0,
    top: 4,
  },
  btn: {
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
