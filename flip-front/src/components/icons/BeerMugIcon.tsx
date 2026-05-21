import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & { size?: number };

export function BeerMugIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Rect
        x="10"
        y="18"
        width="32"
        height="38"
        rx="4"
        fill="#FFD23F"
        stroke="#181613"
        strokeWidth="3"
      />
      <Path
        d="M42 26 Q54 26 54 36 Q54 46 42 46"
        fill="none"
        stroke="#181613"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Ellipse cx="18" cy="18" rx="7" ry="6" fill="#FBF7EC" stroke="#181613" strokeWidth="2.5" />
      <Ellipse cx="30" cy="17" rx="8" ry="7" fill="#FBF7EC" stroke="#181613" strokeWidth="2.5" />
      <Ellipse cx="40" cy="19" rx="5" ry="5" fill="#FBF7EC" stroke="#181613" strokeWidth="2.5" />
      <Circle
        cx="22"
        cy="38"
        r="2"
        fill="none"
        stroke="#181613"
        strokeWidth="1.5"
        opacity={0.3}
      />
      <Circle
        cx="30"
        cy="44"
        r="1.5"
        fill="none"
        stroke="#181613"
        strokeWidth="1.5"
        opacity={0.3}
      />
    </Svg>
  );
}
