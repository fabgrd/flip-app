import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { T } from '../../constants/flipTokens';

export interface CrownIconProps {
  size?: number;
  fill?: string;
  stroke?: string;
  accent?: string;
}

export function CrownIcon({
  size = 24,
  fill = T.lemon,
  stroke = T.ink,
  accent = T.tomato,
}: CrownIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M6 36h36V20l-9 6-9-12-9 12-9-6v16z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Rect x="6" y="34" width="36" height="6" rx="1" fill={fill} stroke={stroke} strokeWidth="2.5" />
      <Circle cx="15" cy="14" r="3" fill={fill} stroke={stroke} strokeWidth="2" />
      <Circle cx="33" cy="14" r="3" fill={fill} stroke={stroke} strokeWidth="2" />
      <Circle cx="24" cy="8" r="3" fill={accent} stroke={stroke} strokeWidth="2" />
    </Svg>
  );
}
