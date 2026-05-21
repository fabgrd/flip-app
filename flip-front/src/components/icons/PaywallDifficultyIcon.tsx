import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import { T } from '../../constants/flipTokens';

type IconProps = SvgProps & { size?: number };

export function PaywallDifficultyIcon({ size = 28, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Path
        d="M32 4C24 16 14 26 14 38C14 50 22 58 32 58C42 58 50 50 50 38C50 26 40 16 32 4Z"
        fill={T.tomato}
        stroke={T.ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Path
        d="M32 26C28 32 24 36 24 42C24 48 28 52 32 52C36 52 40 48 40 42C40 36 36 32 32 26Z"
        fill={T.lemon}
        stroke={T.ink}
        strokeWidth="2"
      />
    </Svg>
  );
}
