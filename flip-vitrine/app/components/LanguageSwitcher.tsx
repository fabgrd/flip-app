'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import styled from 'styled-components';
import { T, bp, fonts } from '../lib/theme';
import { usePathname, useRouter } from '../i18n/navigation';
import { routing } from '../i18n/routing';

const Wrap = styled.div`
  display: inline-flex;
  align-items: center;
  height: 36px;
  border: 2px solid ${T.ink};
  border-radius: 12px;
  overflow: hidden;
  background: ${T.bg};

  @media ${bp.compact} {
    height: 32px;
  }
`;

const Btn = styled.button<{ $active: boolean }>`
  appearance: none;
  border: 0;
  padding: 0 10px;
  height: 100%;
  font-family: ${fonts.mono};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  background: ${(p) => (p.$active ? T.ink : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : T.ink)};

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [pending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next as 'fr' | 'en' });
    });
  }

  return (
    <Wrap role="group" aria-label="Language">
      {routing.locales.map((l) => (
        <Btn
          key={l}
          $active={l === currentLocale}
          onClick={() => switchTo(l)}
          disabled={pending}
          aria-pressed={l === currentLocale}
        >
          {l.toUpperCase()}
        </Btn>
      ))}
    </Wrap>
  );
}
