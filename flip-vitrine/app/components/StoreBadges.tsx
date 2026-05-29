'use client';

import styled, { css } from 'styled-components';
import { T, fonts } from '../lib/theme';

type Size = 'md' | 'lg';

const sizeStyles = {
  lg: css`
    height: 56px;
    padding: 0 26px;
    font-size: 16px;
  `,
  md: css`
    height: 48px;
    padding: 0 20px;
    font-size: 14px;
  `,
};

const Row = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Badge = styled.a<{ $size: Size; $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 2px solid ${T.ink};
  border-radius: 16px;
  font-family: ${fonts.display};
  font-weight: 700;
  box-shadow: 4px 4px 0 ${T.ink};
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  transition: transform 120ms ease, box-shadow 120ms ease;
  ${(p) => sizeStyles[p.$size]}

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 ${T.ink};
  }
`;

export default function StoreBadges({ size = 'lg' }: { size?: Size }) {
  return (
    <Row>
      <Badge href="#" $size={size} $bg={T.ink} $color="#fff">
        <svg width="16" height="19" viewBox="0 0 16 19" fill="currentColor" aria-hidden>
          <path d="M13.3 10c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.7-.8-2.9-.8-1.5 0-2.8.9-3.5 2.2C.7 9.7 1.8 13.6 3.3 15.7c.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.9-.7 1.3 0 1.6.7 2.8.7 1.2 0 1.9-1 2.6-2.1.8-1.2 1.2-2.3 1.2-2.4 0 0-2.3-.9-2.3-3.4zM11 3.3c.6-.7.9-1.6.8-2.5-.8 0-1.8.6-2.4 1.2-.5.6-.9 1.5-.8 2.4.9 0 1.8-.4 2.4-1.1z" />
        </svg>
        App Store
      </Badge>
      <Badge href="#" $size={size} $bg={T.paper} $color={T.ink}>
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden>
          <path d="M1 1l14 8L1 17V1z" fill={T.mint} stroke={T.ink} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        Google Play
      </Badge>
    </Row>
  );
}
