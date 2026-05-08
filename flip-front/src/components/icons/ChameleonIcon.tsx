import React from 'react';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & { size?: number };

export function ChameleonIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Rect x={6} y={8} width={40} height={32} rx={14} fill="#181613" />
      <Path d="M16 38 L12 50 L26 40" fill="#181613" />
      <SvgText
        x={26}
        y={32}
        fontFamily="system-ui"
        fontSize={22}
        fontWeight="900"
        textAnchor="middle"
        fill="#FFD23F"
      >
        ?
      </SvgText>
      <Circle cx={48} cy={46} r={9} fill="#FBF7EC" stroke="#181613" strokeWidth={2} />
      <Circle cx={50} cy={46} r={3.5} fill="#181613" />
    </Svg>
  );
}
