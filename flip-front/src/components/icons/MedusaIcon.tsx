import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & { size?: number };

export function MedusaIcon({ size = 64, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <Path d="M16 26 Q12 14 17 7" stroke="#4FCB8A" strokeWidth={3} strokeLinecap="round" fill="none" />
      <Circle cx={17} cy={6} r={2.5} fill="#4FCB8A" />
      <Path d="M26 22 Q24 10 28 4" stroke="#4FCB8A" strokeWidth={3} strokeLinecap="round" fill="none" />
      <Circle cx={28} cy={3} r={2.5} fill="#4FCB8A" />
      <Path d="M38 22 Q40 10 36 4" stroke="#4FCB8A" strokeWidth={3} strokeLinecap="round" fill="none" />
      <Circle cx={36} cy={3} r={2.5} fill="#4FCB8A" />
      <Path d="M48 26 Q52 14 47 7" stroke="#4FCB8A" strokeWidth={3} strokeLinecap="round" fill="none" />
      <Circle cx={47} cy={6} r={2.5} fill="#4FCB8A" />
      <Ellipse cx={32} cy={38} rx={22} ry={14} fill="#FBF7EC" stroke="#181613" strokeWidth={2.5} />
      <Circle cx={32} cy={38} r={8} fill="#2447FF" />
      <Circle cx={32} cy={38} r={4} fill="#181613" />
      <Circle cx={34} cy={36} r={2} fill="#fff" />
    </Svg>
  );
}
