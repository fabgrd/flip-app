import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { T } from '../../constants/flipTokens';

type IconProps = SvgProps & { size?: number };

// Icône : doigt qui pointe — 1:1 maquette screens-quipourrait.jsx
export function QuiPourraitIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      {/* lignes de mouvement */}
      <Line x1={6} y1={20} x2={16} y2={20} stroke={T.ink} strokeWidth={3} strokeLinecap="round" />
      <Line x1={4} y1={32} x2={14} y2={32} stroke={T.ink} strokeWidth={3} strokeLinecap="round" />
      <Line x1={6} y1={44} x2={16} y2={44} stroke={T.ink} strokeWidth={3} strokeLinecap="round" />
      {/* index pointé */}
      <Rect
        x={24}
        y={26}
        width={30}
        height={13}
        rx={6.5}
        fill={T.lemon}
        stroke={T.ink}
        strokeWidth={2.5}
      />
      {/* poing */}
      <Rect
        x={22}
        y={22}
        width={16}
        height={26}
        rx={7}
        fill={T.lemon}
        stroke={T.ink}
        strokeWidth={2.5}
      />
      {/* pouce */}
      <Path
        d="M30 22 Q30 14 38 16"
        fill="none"
        stroke={T.ink}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* ongle */}
      <Circle cx={50} cy={32.5} r={2.4} fill={T.ink} />
    </Svg>
  );
}
