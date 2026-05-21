import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & { size?: number };

export function PureteIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Ellipse cx={32} cy={14} rx={14} ry={4} fill="none" stroke="#FFD23F" strokeWidth={3} />
      <Path d="M14 30 L18 20 L22 30 Z" fill="#FF5B3A" stroke="#181613" strokeWidth={2} />
      <Path d="M42 30 L46 20 L50 30 Z" fill="#FF5B3A" stroke="#181613" strokeWidth={2} />
      <Circle cx={32} cy={40} r={18} fill="#FBF7EC" stroke="#181613" strokeWidth={2.5} />
      <Circle cx={26} cy={38} r={2.5} fill="#181613" />
      <Circle cx={38} cy={38} r={2.5} fill="#181613" />
      <Path
        d="M26 47 Q32 52 38 47"
        stroke="#181613"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
