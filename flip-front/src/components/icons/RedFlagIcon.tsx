import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const REDFLAG_BG = '#E63946';

export function RedFlagIcon({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Vertical pole */}
      <Rect x={18} y={8} width={4} height={48} rx={2} fill="#181613" />
      {/* Flag triangle */}
      <Path d="M22 10 L50 20 L22 30 Z" fill={REDFLAG_BG} stroke="#181613" strokeWidth={2} strokeLinejoin="round" />
      {/* Small circle at top of pole */}
      <Circle cx={20} cy={8} r={4} fill="#FFD23F" stroke="#181613" strokeWidth={1.5} />
    </Svg>
  );
}
