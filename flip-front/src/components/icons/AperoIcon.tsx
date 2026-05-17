import React from 'react';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & { size?: number };

export function AperoIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Rect
        x="22"
        y="6"
        width="24"
        height="34"
        rx="4"
        fill="#FF8FB1"
        stroke="#181613"
        strokeWidth="2.5"
        transform="rotate(10 34 23)"
      />
      <Rect
        x="16"
        y="10"
        width="24"
        height="34"
        rx="4"
        fill="#FBF7EC"
        stroke="#181613"
        strokeWidth="2.5"
      />
      <SvgText
        x="28"
        y="26"
        fontFamily="system-ui"
        fontSize="11"
        fontWeight="900"
        textAnchor="middle"
        fill="#FF5B3A"
      >
        ♥
      </SvgText>
      <SvgText
        x="28"
        y="40"
        fontFamily="system-ui"
        fontSize="14"
        fontWeight="900"
        textAnchor="middle"
        fill="#181613"
      >
        7
      </SvgText>
      <Path
        d="M46 50 Q50 42 54 50 Q50 56 46 50Z"
        fill="#FF5B3A"
        stroke="#181613"
        strokeWidth="1.5"
      />
    </Svg>
  );
}
