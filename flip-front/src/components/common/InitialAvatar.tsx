import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { T } from '../../constants/flipTokens';
import { getPlayerBgColor, getPlayerTextColor } from '../../constants/playerColors';

export function InitialAvatar({
  index,
  label,
  size = 40,
  radius = 12,
  borderColor = T.ink,
  bgColor,
  textColor,
  shadowColor,
  style,
}: {
  index: number;
  label?: string;
  size?: number;
  radius?: number;
  borderColor?: string;
  bgColor?: string;
  textColor?: string;
  shadowColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const displayLabel = label ?? String.fromCharCode(65 + (index % 26));
  const resolvedTextColor = textColor ?? getPlayerTextColor(index);
  const resolvedBgColor = bgColor ?? getPlayerBgColor(index);

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: resolvedBgColor,
          borderColor,
          shadowColor: shadowColor ?? undefined,
          shadowOffset: shadowColor ? { width: 6, height: 6 } : undefined,
          shadowOpacity: shadowColor ? 1 : 0,
          shadowRadius: shadowColor ? 0 : undefined,
          elevation: shadowColor ? 6 : 0,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: resolvedTextColor, fontSize: size * 0.4 }]}>
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  label: { fontWeight: '900' },
});
