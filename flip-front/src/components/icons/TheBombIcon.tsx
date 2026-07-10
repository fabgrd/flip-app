import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { T } from '../../constants/flipTokens';

type IconProps = SvgProps & { size?: number };

// Icône bombe — 1:1 avec la maquette screens-bombe.jsx (BombeIcon)
export function TheBombIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      {/* corps */}
      <Circle cx={30} cy={40} r={20} fill={T.ink} />
      {/* reflet */}
      <Circle cx={23} cy={33} r={5} fill="#fff" opacity={0.35} />
      {/* embout */}
      <Rect
        x={36}
        y={16}
        width={9}
        height={9}
        rx={2}
        transform="rotate(45 40.5 20.5)"
        fill={T.ink}
      />
      {/* mèche */}
      <Path
        d="M43 17 Q52 10 50 4"
        fill="none"
        stroke={T.ink}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* étincelle */}
      <Path
        d="M50 4 l3 -2 -1 3 3 1 -3 1 1 3 -3 -2 -2 2 1 -3 -3 -1 3 -1 z"
        fill={T.bombAccent}
        stroke={T.ink}
        strokeWidth={0.8}
      />
    </Svg>
  );
}
