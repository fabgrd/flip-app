import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import { T } from '../../constants/flipTokens';

type IconProps = SvgProps & { size?: number };

export function PaywallThemesIcon({ size = 28, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Path
        d="M32 2L40 22L60 32L40 42L32 62L24 42L4 32L24 22Z"
        fill={T.violet}
        stroke={T.ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Path
        d="M52 6L54 14L62 16L54 18L52 26L50 18L42 16L50 14Z"
        fill={T.lemon}
        stroke={T.ink}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Circle cx="32" cy="32" r="5" fill={T.paper} stroke={T.ink} strokeWidth="2" />
    </Svg>
  );
}
