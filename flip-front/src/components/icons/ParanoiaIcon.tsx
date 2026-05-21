import React from 'react';
import Svg, { Circle, Ellipse, Text as SvgText } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & { size?: number };

export function ParanoiaIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Circle cx={32} cy={32} r={22} fill="#FFD23F" stroke="#181613" strokeWidth={2.5} />
      <Circle
        cx={32}
        cy={32}
        r={16}
        fill="none"
        stroke="#181613"
        strokeWidth={1.5}
        strokeDasharray="2 3"
      />
      <SvgText
        x={32}
        y={40}
        fontFamily="system-ui"
        fontSize={22}
        fontWeight="900"
        textAnchor="middle"
        fill="#181613"
      >
        ?
      </SvgText>
      <Ellipse cx={48} cy={14} rx={10} ry={6} fill="#FBF7EC" stroke="#181613" strokeWidth={2} />
      <Circle cx={48} cy={14} r={3} fill="#181613" />
    </Svg>
  );
}
