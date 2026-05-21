import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & { size?: number };

export function GaucheDroiteIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Path
        d="M4 32 L20 18 V26 H30 V38 H20 V46 Z"
        fill="#2447FF"
        stroke="#181613"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Path
        d="M60 32 L44 18 V26 H34 V38 H44 V46 Z"
        fill="#FF5B3A"
        stroke="#181613"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
