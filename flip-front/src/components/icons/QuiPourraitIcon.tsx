import React from 'react';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { T } from '../../constants/flipTokens';

type IconProps = SvgProps & { size?: number };

// Icône : bulle de vote avec un point d'interrogation (« qui pourrait… ? »).
export function QuiPourraitIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      {/* bulle + queue */}
      <Path
        d="M19 8 H45 Q58 8 58 22 V31 Q58 45 45 45 H27 L18 55 L20 45 H19 Q6 45 6 31 V22 Q6 8 19 8 Z"
        fill={T.paper}
        stroke={T.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {/* point d'interrogation */}
      <SvgText
        x={32}
        y={38}
        fontFamily="system-ui"
        fontSize={30}
        fontWeight="900"
        textAnchor="middle"
        fill={T.quiPourraitAccent}
        stroke={T.ink}
        strokeWidth={1}
      >
        ?
      </SvgText>
    </Svg>
  );
}
