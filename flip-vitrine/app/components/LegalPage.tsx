'use client';

import { useTranslations } from 'next-intl';
import styled from 'styled-components';
import { T, bp, fonts } from '../lib/theme';

const Section = styled.section`
  padding: 56px 60px 80px;

  @media ${bp.mobile} {
    padding: 36px 20px 56px;
  }
`;

const Inner = styled.div`
  max-width: 760px;
  margin: 0 auto;
`;

const Eyebrow = styled.div`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 2px;
  color: ${T.tomato};
  font-weight: 700;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 48px;
  letter-spacing: -1.5px;
  color: ${T.ink};
  line-height: 0.95;

  @media ${bp.mobile} {
    font-size: 36px;
  }
`;

const Updated = styled.p`
  margin-top: 14px;
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 1px;
  color: ${T.muted};
  margin-bottom: 36px;
`;

const SectionBlock = styled.div`
  margin-bottom: 28px;
`;

const SectionTitle = styled.h2`
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -0.5px;
  color: ${T.ink};
  margin-bottom: 10px;

  @media ${bp.mobile} {
    font-size: 19px;
  }
`;

const Paragraph = styled.p`
  font-family: ${fonts.sans};
  font-size: 16px;
  color: ${T.inkSoft};
  line-height: 1.6;
  margin-bottom: 8px;
`;

type LegalSection = { title: string; paragraphs: string[] };
type Kind = 'privacy' | 'terms' | 'mentions';

export default function LegalPage({ kind }: { kind: Kind }) {
  const t = useTranslations(`Legal.${kind}`);
  const sections = t.raw('sections') as LegalSection[];

  return (
    <Section>
      <Inner>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <Title>{t('title')}</Title>
        <Updated>{t('updated')}</Updated>
        {sections.map((s) => (
          <SectionBlock key={s.title}>
            <SectionTitle>{s.title}</SectionTitle>
            {s.paragraphs.map((p, i) => (
              <Paragraph key={i}>{p}</Paragraph>
            ))}
          </SectionBlock>
        ))}
      </Inner>
    </Section>
  );
}
