import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';

type IconProps = SvgProps & { size?: number };

export function ChameleonIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Ellipse cx={28} cy={32} rx={22} ry={5} fill="#1A1A1A" />
      <Path d="M12 32 Q14 14 28 16 Q42 14 44 32" fill="#1A1A1A" />
      <Rect x={14} y={26} width={28} height={4} rx={2} fill="#FFD23F" />
      <Circle cx={48} cy={44} r={10} fill="none" stroke="#1A1A1A" strokeWidth={3.5} />
      <Circle cx={48} cy={44} r={6} fill="#F5F0E8" opacity={0.3} />
      <Line x1={41} y1={51} x2={32} y2={60} stroke="#1A1A1A" strokeWidth={3.5} strokeLinecap="round" />
    </Svg>
  );
}
