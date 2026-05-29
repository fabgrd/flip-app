'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { T, bp, fonts } from '../lib/theme';
import SiteLogo from './SiteLogo';

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${T.bg};
  border-bottom: 2px solid ${T.ink};
  padding: 0 40px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${bp.compact} {
    padding: 0 16px;
    height: 60px;
  }
`;

const Links = styled.div`
  display: flex;
  gap: 36px;
  align-items: center;

  @media ${bp.compact} {
    gap: 20px;
  }
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  font-family: ${fonts.sans};
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  font-size: 16px;
  color: ${T.ink};
  padding: 4px 0;
  border-bottom: 2px solid ${(p) => (p.$active ? T.tomato : 'transparent')};
  text-decoration: none;

  @media ${bp.compact} {
    font-size: 14px;
  }
`;

const DownloadCta = styled.a`
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

  @media ${bp.compact} {
    display: none;
  }
`;

const DownloadIcon = styled.a`
  display: none;

  @media ${bp.compact} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: ${T.ink};
    border: 2px solid ${T.ink};
  }
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  text-decoration: none;
`;

export default function SiteNav() {
  const pathname = usePathname() || '/';
  const onHome = pathname === '/';
  const onJeux = pathname.startsWith('/jeux');

  return (
    <Nav>
      <LogoLink href="/" aria-label="Accueil Fl!p">
        <SiteLogo size={34} />
      </LogoLink>
      <Links>
        <NavItem href="/" $active={onHome}>
          Accueil
        </NavItem>
        <NavItem href="/jeux" $active={onJeux}>
          Jeux
        </NavItem>
      </Links>
      <DownloadCta href="#">Télécharger</DownloadCta>
      <DownloadIcon href="#" aria-label="Télécharger">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M8 2v8M4 7l4 4 4-4M3 14h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </DownloadIcon>
    </Nav>
  );
}
