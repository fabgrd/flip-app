'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { T, bp, fonts } from '../lib/theme';
import SiteLogo from './SiteLogo';

const Footer = styled.footer`
  background: ${T.ink};
  color: #fff;
  padding: 72px 60px;

  @media ${bp.compact} {
    padding: 40px 20px;
  }
`;

const Top = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
`;

const Brand = styled.div``;

const Tagline = styled.p`
  margin-top: 14px;
  font-family: ${fonts.sans};
  font-size: 15px;
  color: rgba(255, 255, 255, 0.4);
  max-width: 300px;
  line-height: 1.5;
`;

const Columns = styled.div`
  display: flex;
  gap: 56px;

  @media ${bp.compact} {
    gap: 36px;
  }
`;

const Col = styled.div``;

const ColLabel = styled.div`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 2px;
  opacity: 0.35;
  margin-bottom: 16px;
`;

const ColLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FootLink = styled(Link)`
  font-family: ${fonts.sans};
  font-size: 15px;
  opacity: 0.6;
  color: inherit;
  text-decoration: none;
  &:hover { opacity: 1; }
`;

const ExtLink = styled.a`
  font-family: ${fonts.sans};
  font-size: 15px;
  opacity: 0.6;
  color: inherit;
  text-decoration: none;
  &:hover { opacity: 1; }
`;

const Legal = styled.div`
  max-width: 1100px;
  margin: 48px auto 0;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 1px;
  opacity: 0.2;
`;

export default function SiteFooter() {
  return (
    <Footer>
      <Top>
        <Brand>
          <SiteLogo size={36} color="#fff" />
          <Tagline>Les jeux de soirée. Réinventés.</Tagline>
        </Brand>
        <Columns>
          <Col>
            <ColLabel>NAVIGATION</ColLabel>
            <ColLinks>
              <FootLink href="/">Accueil</FootLink>
              <FootLink href="/jeux">Nos jeux</FootLink>
            </ColLinks>
          </Col>
          <Col>
            <ColLabel>TÉLÉCHARGER</ColLabel>
            <ColLinks>
              <ExtLink href="#">App Store</ExtLink>
              <ExtLink href="#">Google Play</ExtLink>
            </ColLinks>
          </Col>
        </Columns>
      </Top>
      <Legal>© 2026 Fl!p · Tous droits réservés</Legal>
    </Footer>
  );
}
