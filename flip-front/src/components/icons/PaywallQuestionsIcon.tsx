import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import { T } from '../../constants/flipTokens';

type IconProps = SvgProps & { size?: number };

export function PaywallQuestionsIcon({ size = 28, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Rect x="16" y="4" width="34" height="46" rx="6" fill={T.mint} stroke={T.ink} strokeWidth="2.5" transform="rotate(8 33 27)" />
      <Rect x="14" y="6" width="34" height="46" rx="6" fill={T.cobalt} stroke={T.ink} strokeWidth="2.5" transform="rotate(-5 31 29)" />
      <Rect x="10" y="10" width="34" height="46" rx="6" fill={T.lemon} stroke={T.ink} strokeWidth="3" />
      <Rect x="18" y="22" width="18" height="3.5" rx="1.5" fill={T.ink} opacity={0.5} />
      <Rect x="18" y="30" width="14" height="3.5" rx="1.5" fill={T.ink} opacity={0.5} />
      <Rect x="18" y="38" width="17" height="3.5" rx="1.5" fill={T.ink} opacity={0.5} />
    </Svg>
  );
}
