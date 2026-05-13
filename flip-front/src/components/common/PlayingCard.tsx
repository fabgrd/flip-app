import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { T } from '../../constants/flipTokens';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isRedSuit(suit: string): boolean {
  return suit === '♥' || suit === '♦';
}

// ─── Crosshatch SVG pattern (card back texture) ───────────────────────────────

export function CardCrosshatch({
  width,
  height,
  opacity = 0.22,
}: {
  width: number;
  height: number;
  opacity?: number;
}) {
  const spacing = 5;
  const color = `rgba(255,255,255,${opacity})`;
  let dFwd = '';
  let dBwd = '';
  for (let x = -height; x < width + height; x += spacing) {
    dFwd += `M${x},${height} L${x + height},0 `;
    dBwd += `M${x},0 L${x + height},${height} `;
  }
  return (
    <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
      <Path d={dFwd} stroke={color} strokeWidth={1} fill="none" />
      <Path d={dBwd} stroke={color} strokeWidth={1} fill="none" />
    </Svg>
  );
}

// ─── PlayingCardFace ──────────────────────────────────────────────────────────
// Renders a face-up playing card. Font sizes scale with height.

export function PlayingCardFace({
  value,
  suit,
  width = 100,
  height = 140,
  borderWidth,
  shadowColor = T.ink,
  shadow = true,
  style,
}: {
  value: string;
  suit: string;
  width?: number;
  height?: number;
  /** Defaults to 3 at h=140, scales with height if omitted */
  borderWidth?: number;
  shadowColor?: string;
  shadow?: boolean;
  style?: ViewStyle;
}) {
  const scale = height / 140;
  const bw = borderWidth ?? Math.max(1.5, Math.round(3 * scale));
  const color = isRedSuit(suit) ? T.tomato : T.ink;

  return (
    <View
      style={[
        styles.face,
        {
          width,
          height,
          borderRadius: Math.round(12 * scale),
          borderWidth: bw,
          shadowColor,
          shadowOffset: { width: shadow ? 6 * scale : 0, height: shadow ? 6 * scale : 0 },
          shadowOpacity: shadow ? 1 : 0,
          elevation: shadow ? 6 : 0,
        },
        style,
      ]}
    >
      <Text style={[styles.value, { color, fontSize: Math.round(40 * scale) }]}>{value}</Text>
      <Text style={[styles.suit, { color, fontSize: Math.round(28 * scale) }]}>{suit}</Text>
    </View>
  );
}

// ─── PlayingCardBack ──────────────────────────────────────────────────────────
// Renders the back of a playing card (pink + crosshatch + "?").

export function PlayingCardBack({
  width = 100,
  height = 140,
  borderWidth,
  shadow = true,
  style,
}: {
  width?: number;
  height?: number;
  borderWidth?: number;
  shadow?: boolean;
  style?: ViewStyle;
}) {
  const scale = height / 140;
  const bw = borderWidth ?? Math.max(1.5, Math.round(3 * scale));

  return (
    <View
      style={[
        styles.back,
        {
          width,
          height,
          borderRadius: Math.round(12 * scale),
          borderWidth: bw,
          shadowOffset: { width: shadow ? 6 * scale : 0, height: shadow ? 6 * scale : 0 },
          shadowOpacity: shadow ? 1 : 0,
          elevation: shadow ? 6 : 0,
        },
        style,
      ]}
    >
      <CardCrosshatch width={width} height={height} />
      <Text style={[styles.backMark, { fontSize: Math.round(40 * scale) }]}>?</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  face: {
    backgroundColor: T.paper,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 0,
  },
  value: {
    fontWeight: '900',
    lineHeight: undefined, // let font size drive line height
  },
  suit: {
    marginTop: 2,
  },
  back: {
    overflow: 'hidden',
    backgroundColor: T.pink,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.ink,
    shadowRadius: 0,
  },
  backMark: {
    color: '#fff',
    fontWeight: '900',
    opacity: 0.5,
  },
});
