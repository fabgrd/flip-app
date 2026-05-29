'use client';

import styled from 'styled-components';
import { T } from '../lib/theme';

const Dots = styled.div<{ $color: string; $opacity: number; $gap: number }>`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(${(p) => p.$color} 1px, transparent 1px);
  background-size: ${(p) => p.$gap}px ${(p) => p.$gap}px;
  opacity: ${(p) => p.$opacity};
  pointer-events: none;
`;

export default function SiteRiso({
  color = T.ink,
  opacity = 0.05,
  gap = 16,
}: {
  color?: string;
  opacity?: number;
  gap?: number;
}) {
  return <Dots $color={color} $opacity={opacity} $gap={gap} />;
}
