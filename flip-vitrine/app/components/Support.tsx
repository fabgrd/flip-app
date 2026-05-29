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
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 44px;

  @media ${bp.mobile} {
    margin-bottom: 28px;
  }
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
  font-size: 56px;
  letter-spacing: -2px;
  color: ${T.ink};
  line-height: 0.9;

  @media ${bp.mobile} {
    font-size: 40px;
  }
`;

const Lead = styled.p`
  margin-top: 16px;
  font-family: ${fonts.sans};
  font-size: 19px;
  color: ${T.inkSoft};
  line-height: 1.5;
  max-width: 560px;

  @media ${bp.mobile} {
    font-size: 16px;
  }
`;

const ContactCard = styled.div`
  background: ${T.paper};
  border: 2px solid ${T.ink};
  border-radius: 18px;
  padding: 28px;
  box-shadow: 4px 4px 0 ${T.tomato};
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media ${bp.mobile} {
    padding: 22px;
  }
`;

const ContactLabel = styled.div`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 2px;
  color: ${T.muted};
  font-weight: 700;
`;

const ContactRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12px;
  justify-content: space-between;
`;

const ContactText = styled.p`
  font-family: ${fonts.sans};
  font-size: 16px;
  color: ${T.inkSoft};
  line-height: 1.5;
  margin: 0;
`;

const MailButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  background: ${T.ink};
  color: #fff;
  border: 2px solid ${T.ink};
  border-radius: 14px;
  font-family: ${fonts.display};
  font-weight: 700;
  font-size: 15px;
  box-shadow: 3px 3px 0 ${T.tomato};
  text-decoration: none;
  white-space: nowrap;
`;

const FaqLabel = styled.div`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 2px;
  color: ${T.tomato};
  font-weight: 700;
  margin-bottom: 16px;
`;

const FaqTitle = styled.h2`
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 36px;
  letter-spacing: -1px;
  color: ${T.ink};
  line-height: 0.95;
  margin-bottom: 24px;

  @media ${bp.mobile} {
    font-size: 28px;
  }
`;

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FaqItem = styled.details`
  background: ${T.paper};
  border: 2px solid ${T.ink};
  border-radius: 14px;
  padding: 18px 22px;

  &[open] {
    box-shadow: 3px 3px 0 ${T.cobalt};
  }
`;

const FaqQuestion = styled.summary`
  font-family: ${fonts.display};
  font-weight: 700;
  font-size: 18px;
  color: ${T.ink};
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  &::-webkit-details-marker { display: none; }

  &::after {
    content: '+';
    font-size: 22px;
    color: ${T.tomato};
    font-weight: 700;
  }

  ${FaqItem}[open] &::after {
    content: '−';
  }
`;

const FaqAnswer = styled.p`
  margin-top: 12px;
  font-family: ${fonts.sans};
  font-size: 15px;
  color: ${T.inkSoft};
  line-height: 1.6;
`;

type FaqEntry = { q: string; a: string };

export default function Support() {
  const t = useTranslations('Support');
  const email = t('contact.email');
  const faq = t.raw('faq.items') as FaqEntry[];

  return (
    <Section>
      <Inner>
        <Header>
          <Eyebrow>{t('header.eyebrow')}</Eyebrow>
          <Title>{t('header.title')}</Title>
          <Lead>{t('header.lead')}</Lead>
        </Header>

        <ContactCard>
          <ContactLabel>{t('contact.label')}</ContactLabel>
          <ContactRow>
            <ContactText>
              {t('contact.responseTime')}
              <br />
              <strong>{email}</strong>
            </ContactText>
            <MailButton href={`mailto:${email}`}>{t('contact.button')}</MailButton>
          </ContactRow>
        </ContactCard>

        <FaqLabel>{t('faq.eyebrow')}</FaqLabel>
        <FaqTitle>{t('faq.title')}</FaqTitle>
        <FaqList>
          {faq.map((item) => (
            <FaqItem key={item.q}>
              <FaqQuestion>{item.q}</FaqQuestion>
              <FaqAnswer>{item.a}</FaqAnswer>
            </FaqItem>
          ))}
        </FaqList>
      </Inner>
    </Section>
  );
}
