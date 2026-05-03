import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { T } from '../../constants/flipTokens';

const { width: W, height: H } = Dimensions.get('window');

interface DotBackgroundProps {
  color?: string;
  opacity?: number;
  gap?: number;
}

export function DotBackground({ color = T.ink, opacity = 0.07, gap = 22 }: DotBackgroundProps) {
  const dots = useMemo(() => {
    const cols = Math.ceil(W / gap) + 2;
    const rows = Math.ceil(H / gap) + 2;
    const result: { key: string; x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        result.push({ key: `${r}-${c}`, x: c * gap, y: r * gap });
      }
    }
    return result;
  }, [gap]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {dots.map((d) => (
        <View
          key={d.key}
          style={[styles.dot, { left: d.x, top: d.y, backgroundColor: color, opacity }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: 999,
    height: 2.5,
    position: 'absolute',
    width: 2.5,
  },
});
