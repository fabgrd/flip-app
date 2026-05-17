import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { T } from '../../constants/flipTokens';

export function GameChip({
  color,
  textColor = T.ink,
  style,
  textStyle,
  children,
}: {
  color: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.chip, { backgroundColor: color }, style]}>
      <Text style={[styles.chipText, { color: textColor }, textStyle]}>{children}</Text>
    </View>
  );
}

export function GameCard({
  color = T.paper,
  style,
  children,
}: {
  color?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  return <View style={[styles.card, { backgroundColor: color }, style]}>{children}</View>;
}

export function InkButton({
  children,
  onPress,
  disabled,
  color = T.ink,
  textColor = '#fff',
  borderColor,
  shadowColor = T.ink,
  style,
  textStyle,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  textColor?: string;
  borderColor?: string;
  shadowColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.inkBtn,
        {
          backgroundColor: color,
          borderColor: borderColor ?? color,
          shadowColor,
        },
        disabled && styles.inkBtnDisabled,
        style,
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.inkBtnText, { color: textColor }, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

export function StickerBadge({
  color,
  rotation,
  textColor = T.ink,
  style,
  textStyle,
  children,
}: {
  color: string;
  rotation: number;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.sticker,
        { backgroundColor: color, transform: [{ rotate: `${rotation}deg` }] },
        style,
      ]}
    >
      <Text style={[styles.stickerText, { color: textColor }, textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    shadowColor: T.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  chipText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  card: {
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 24,
    padding: 20,
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  inkBtn: {
    borderWidth: 2,
    borderRadius: T.rMd,
    paddingVertical: 18,
    alignItems: 'center',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  inkBtnDisabled: { opacity: 0.4 },
  inkBtnText: { fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
  sticker: {
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  stickerText: { fontSize: 13, fontWeight: '900', letterSpacing: 1 },
});
