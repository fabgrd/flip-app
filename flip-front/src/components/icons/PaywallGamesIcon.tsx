import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import { T } from '../../constants/flipTokens';

type IconProps = SvgProps & { size?: number };

export function PaywallGamesIcon({ size = 28, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Rect x="2" y="14" width="60" height="38" rx="14" fill={T.cobalt} stroke={T.ink} strokeWidth="3" />
      <Rect x="13" y="25" width="8" height="18" rx="2.5" fill="#fff" opacity={0.9} />
      <Rect x="8" y="30" width="18" height="8" rx="2.5" fill="#fff" opacity={0.9} />
      <Circle cx="44" cy="27" r="5.5" fill={T.tomato} stroke={T.ink} strokeWidth="2" />
      <Circle cx="53" cy="39" r="5.5" fill={T.lemon} stroke={T.ink} strokeWidth="2" />
    </Svg>
  );
}
