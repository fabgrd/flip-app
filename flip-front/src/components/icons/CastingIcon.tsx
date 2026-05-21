import React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Ellipse, Path, Rect } from 'react-native-svg';

type IconProps = SvgProps & { size?: number };

export function CastingIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      {/* Spotlight beam */}
      <Path d="M27 12 L12 56 H52 L37 12Z" fill="#FF8C42" opacity={1} />
      {/* Fixture */}
      <Rect x="22" y="2" width="20" height="13" rx="4" fill="#181613" />
      <Ellipse cx="32" cy="15" rx="7" ry="2.5" fill="#FF8C42" />
      {/* Star */}
      <Path
        d="M32 28 L34.8 36.2 H43 L36.4 41.2 L38.8 49.5 L32 44.3 L25.2 49.5 L27.6 41.2 L21 36.2 H29.2Z"
        fill="#FFD23F"
        stroke="#181613"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
