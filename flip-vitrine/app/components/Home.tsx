'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { T, bp, fonts } from '../lib/theme';
import { GAMES } from '../lib/games';
import SiteLogo from './SiteLogo';
import SiteRiso from './SiteRiso';
import StoreBadges from './StoreBadges';
import GameCard from './GameCard';

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  padding: 100px 60px 110px;
  text-align: center;
  border-bottom: 2px solid ${T.ink};

  @media ${bp.mobile} {
    padding: 56px 20px 64px;
  }
`;

const HeroInner = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  margin-top: 36px;
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 76px;
  line-height: 0.9;
  letter-spacing: -3.5px;
  color: ${T.ink};

  @media ${bp.mobile} {
    margin-top: 24px;
    font-size: 42px;
    letter-spacing: -1.5px;
  }
`;

const HeroBadge = styled.span`
  background: ${T.tomato};
  color: #fff;
  padding: 0 12px;
  border-radius: 18px;
  display: inline-block;
  transform: rotate(-2deg);

  @media ${bp.mobile} {
    border-radius: 12px;
  }
`;

const HeroSub = styled.p`
  margin: 28px auto 0;
  font-family: ${fonts.sans};
  font-size: 21px;
  color: ${T.inkSoft};
  line-height: 1.5;
  max-width: 520px;

  @media ${bp.mobile} {
    margin-top: 20px;
    font-size: 17px;
  }
`;

const HeroCta = styled.div`
  margin-top: 40px;

  @media ${bp.mobile} {
    margin-top: 28px;
  }
`;

const Features = styled.section`
  padding: 72px 60px;
  border-bottom: 2px solid ${T.ink};

  @media ${bp.mobile} {
    padding: 48px 20px;
  }
`;

const FeaturesGrid = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media ${bp.mobile} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FeatureCard = styled.div`
  background: ${T.paper};
  border: 2px solid ${T.ink};
  border-radius: 22px;
  padding: 32px 28px;
  box-shadow: 4px 4px 0 ${T.ink};

  @media ${bp.mobile} {
    padding: 24px 20px;
  }
`;

const FeatureNumber = styled.div<{ $color: string }>`
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 56px;
  line-height: 0.9;
  letter-spacing: -2px;
  color: ${(p) => p.$color};

  @media ${bp.mobile} {
    font-size: 44px;
  }
`;

const FeatureLabel = styled.div`
  margin-top: 4px;
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 2px;
  color: ${T.muted};
  text-transform: uppercase;
`;

const FeatureDesc = styled.div`
  margin-top: 12px;
  font-family: ${fonts.sans};
  font-size: 15px;
  color: ${T.inkSoft};
  line-height: 1.45;
`;

const FEATURES = [
  { n: '8', label: 'jeux inclus', desc: "Du bluff à l'acting, il y en a pour tous les goûts et toutes les soirées.", color: T.tomato },
  { n: '0€', label: 'pour jouer', desc: "L'essentiel est gratuit. Le premium débloque plus de contenu.", color: T.mint },
  { n: '0', label: 'wifi requis', desc: 'Tout fonctionne offline. Parfait pour les apéros à la campagne.', color: T.cobalt },
] as const;

const Preview = styled.section`
  padding: 72px 60px;

  @media ${bp.mobile} {
    padding: 48px 20px;
  }
`;

const PreviewInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const PreviewHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 36px;
  flex-wrap: wrap;
  gap: 12px;

  @media ${bp.mobile} {
    margin-bottom: 24px;
  }
`;

const PreviewTitle = styled.h2`
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 44px;
  letter-spacing: -1.5px;
  color: ${T.ink};
  line-height: 1;

  @media ${bp.mobile} {
    font-size: 32px;
  }
`;

const SeeAllLink = styled(Link)`
  font-family: ${fonts.display};
  font-weight: 700;
  font-size: 17px;
  color: ${T.tomato};
  text-decoration: none;

  @media ${bp.mobile} {
    font-size: 15px;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;

  @media ${bp.mobile} {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const DiscoverWrap = styled.div`
  text-align: center;
  margin-top: 40px;

  @media ${bp.mobile} {
    margin-top: 28px;
  }
`;

const DiscoverBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 28px;
  background: ${T.paper};
  color: ${T.ink};
  border: 2px solid ${T.ink};
  border-radius: 18px;
  font-family: ${fonts.display};
  font-weight: 700;
  font-size: 16px;
  box-shadow: 4px 4px 0 ${T.ink};
  text-decoration: none;
  transition: transform 120ms ease, box-shadow 120ms ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 ${T.ink};
  }
`;

export default function Home() {
  return (
    <>
      <Hero>
        <SiteRiso opacity={0.04} gap={18} />
        <HeroInner>
          <SiteLogo size={96} />
          <HeroTitle>
            Les jeux de soirée. <HeroBadge>Réinventés.</HeroBadge>
          </HeroTitle>
          <HeroSub>
            8 jeux dans une app. Pas de wifi, pas de matos — juste ton tel et ta bande de potes.
          </HeroSub>
          <HeroCta>
            <StoreBadges />
          </HeroCta>
        </HeroInner>
      </Hero>

      <Features>
        <FeaturesGrid>
          {FEATURES.map((f) => (
            <FeatureCard key={f.label}>
              <FeatureNumber $color={f.color}>{f.n}</FeatureNumber>
              <FeatureLabel>{f.label}</FeatureLabel>
              <FeatureDesc>{f.desc}</FeatureDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Features>

      <Preview>
        <PreviewInner>
          <PreviewHead>
            <PreviewTitle>Nos jeux</PreviewTitle>
            <SeeAllLink href="/jeux">Voir les 8 jeux →</SeeAllLink>
          </PreviewHead>
          <CardGrid>
            {GAMES.slice(0, 4).map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </CardGrid>
          <DiscoverWrap>
            <DiscoverBtn href="/jeux">Découvrir tous les jeux →</DiscoverBtn>
          </DiscoverWrap>
        </PreviewInner>
      </Preview>
    </>
  );
}
