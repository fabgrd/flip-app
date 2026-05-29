'use client';

import styled from 'styled-components';
import { T, fonts } from '../lib/theme';

const Wrap = styled.span<{ $size: number; $color: string }>`
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: ${(p) => p.$size}px;
  letter-spacing: ${(p) => -p.$size * 0.04}px;
  line-height: 1;
  color: ${(p) => p.$color};
  display: inline-flex;
  align-items: baseline;
  user-select: none;
`;

const Bang = styled.span<{ $accent: string }>`
  color: ${(p) => p.$accent};
  transform: rotate(-8deg) translateY(-2px);
  display: inline-block;
  margin: 0 -0.04em;
`;

type Props = { size?: number; color?: string; accent?: string };

export default function SiteLogo({ size = 48, color = T.ink, accent = T.tomato }: Props) {
  return (
    <Wrap $size={size} $color={color}>
      Fl<Bang $accent={accent}>!</Bang>p
    </Wrap>
  );
}
