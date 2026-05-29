'use client';

import { useTranslations } from 'next-intl';
import styled from 'styled-components';
import { T, bp, fonts, onColor } from '../lib/theme';
import { Link } from '../i18n/navigation';
import { GAMES, getGame } from '../lib/games';
import GameCard from './GameCard';
import SiteRiso from './SiteRiso';
import StoreBadges from './StoreBadges';

const BackBar = styled.div`
  padding: 16px 60px 0;

  @media ${bp.mobile} {
    padding: 16px 20px 0;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: ${T.muted};
  text-decoration: none;
  &:hover { color: ${T.ink}; }
`;

const Hero = styled.section<{ $bg: string }>`
  margin: 16px 60px 0;
  background: ${(p) => p.$bg};
  border: 2px solid ${T.ink};
  border-radius: 32px;
  padding: 56px 52px;
  position: relative;
  overflow: hidden;
  box-shadow: 6px 6px 0 ${T.ink};

  @media ${bp.mobile} {
    margin: 16px 20px 0;
    border-radius: 24px;
    padding: 40px 24px;
  }
`;

const HeroRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 48px;
  max-width: 1000px;
  margin: 0 auto;

  @media ${bp.mobile} {
    display: block;
  }
`;

const IconBox = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: 2.5px solid ${T.ink};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media ${bp.mobile} {
    width: 80px;
    height: 80px;
    border-radius: 24px;
    margin-bottom: 20px;
  }
`;

const HeroEyebrow = styled.div<{ $color: string }>`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 2px;
  color: ${(p) => p.$color};
  opacity: 0.65;
  margin-bottom: 8px;
`;

const HeroTitle = styled.h1<{ $color: string }>`
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 64px;
  letter-spacing: -2px;
  line-height: 0.9;
  color: ${(p) => p.$color};

  @media ${bp.mobile} {
    font-size: 44px;
  }
`;

const HeroTagline = styled.p<{ $color: string }>`
  margin-top: 12px;
  font-family: ${fonts.sans};
  font-size: 20px;
  color: ${(p) => p.$color};
  opacity: 0.85;
  line-height: 1.4;
  max-width: 440px;

  @media ${bp.mobile} {
    font-size: 17px;
  }
`;

const Pills = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 18px;
  flex-wrap: wrap;
`;

const Pill = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.22);
  border: 1.5px solid ${T.ink};
  border-radius: 999px;
  font-family: ${fonts.mono};
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => p.$color};
  letter-spacing: 0.5px;
`;

const DescSection = styled.section`
  padding: 56px 60px;

  @media ${bp.mobile} {
    padding: 36px 20px;
  }
`;

const DescInner = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const DescText = styled.p`
  font-family: ${fonts.sans};
  font-size: 19px;
  color: ${T.inkSoft};
  line-height: 1.65;

  @media ${bp.mobile} {
    font-size: 17px;
  }
`;

const RulesSection = styled.section`
  padding: 0 60px 72px;

  @media ${bp.mobile} {
    padding: 0 20px 48px;
  }
`;

const RulesInner = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const RulesEyebrow = styled.div`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 2px;
  color: ${T.tomato};
  font-weight: 700;
  margin-bottom: 12px;
`;

const RulesTitle = styled.h2`
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 36px;
  letter-spacing: -1px;
  color: ${T.ink};
  margin-bottom: 24px;

  @media ${bp.mobile} {
    font-size: 28px;
  }
`;

const RulesCard = styled.div`
  background: ${T.paper};
  border: 2px solid ${T.ink};
  border-radius: 24px;
  padding: 28px 26px;
  box-shadow: 5px 5px 0 ${T.ink};

  @media ${bp.mobile} {
    padding: 20px 18px;
  }
`;

const RuleRow = styled.div<{ $last: boolean }>`
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: ${(p) => (p.$last ? 'none' : '1.5px dashed rgba(139,130,115,0.3)')};
`;

const RuleNum = styled.div<{ $bg: string; $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  border: 2px solid ${T.ink};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 16px;
`;

const RuleTitle = styled.div`
  font-family: ${fonts.display};
  font-size: 19px;
  font-weight: 700;
  color: ${T.ink};

  @media ${bp.mobile} {
    font-size: 17px;
  }
`;

const RuleDesc = styled.div`
  margin-top: 4px;
  font-family: ${fonts.sans};
  font-size: 15px;
  color: ${T.inkSoft};
  line-height: 1.45;

  @media ${bp.mobile} {
    font-size: 14px;
  }
`;

const Cta = styled.section`
  padding: 60px;
  text-align: center;
  background: ${T.bgAlt};
  border-top: 2px solid ${T.ink};
  border-bottom: 2px solid ${T.ink};

  @media ${bp.mobile} {
    padding: 40px 20px;
  }
`;

const CtaInner = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const CtaTitle = styled.h2`
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 38px;
  letter-spacing: -1px;
  color: ${T.ink};
  line-height: 1;

  @media ${bp.mobile} {
    font-size: 28px;
  }
`;

const CtaSub = styled.p`
  margin-top: 12px;
  font-family: ${fonts.sans};
  font-size: 16px;
  color: ${T.inkSoft};
`;

const CtaBadges = styled.div`
  margin-top: 24px;
`;

const Others = styled.section`
  padding: 72px 60px;

  @media ${bp.mobile} {
    padding: 48px 20px;
  }
`;

const OthersInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const OthersTitle = styled.h2`
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 36px;
  letter-spacing: -1px;
  color: ${T.ink};
  margin-bottom: 28px;

  @media ${bp.mobile} {
    font-size: 28px;
    margin-bottom: 20px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;

  @media ${bp.mobile} {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

type Rule = { t: string; d: string };

export default function GameDetail({ id }: { id: string }) {
  const tDetail = useTranslations('Games.detail');
  const tCategories = useTranslations('Games.categories');
  const tGame = useTranslations(`Games.items.${id}`);

  const game = getGame(id);
  if (!game) return null;
  const { Icon } = game;
  const txt = onColor(game.color);
  const others = GAMES.filter((g) => g.id !== game.id).slice(0, 4);

  const name = tGame('name');
  const tagline = tGame('tagline');
  const desc = tGame('desc');
  const players = tGame('players');
  const time = tGame('time');
  const categoryKey = tGame('category');
  const category = tCategories(categoryKey);
  const rules = tGame.raw('rules') as Rule[];

  return (
    <>
      <BackBar>
        <BackLink href="/jeux">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path d="M8 1L3 6l5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {tDetail('back')}
        </BackLink>
      </BackBar>

      <Hero $bg={game.color}>
        <SiteRiso color={T.ink} opacity={0.08} gap={16} />
        <HeroRow>
          <IconBox>
            <Icon size={80} />
          </IconBox>
          <div>
            <HeroEyebrow $color={txt}>{tDetail('gameNumber', { num: game.num })}</HeroEyebrow>
            <HeroTitle $color={txt}>{name}</HeroTitle>
            <HeroTagline $color={txt}>{tagline}</HeroTagline>
            <Pills>
              <Pill $color={txt}>👥 {players}</Pill>
              <Pill $color={txt}>⏱ {time}</Pill>
              <Pill $color={txt}>{category}</Pill>
            </Pills>
          </div>
        </HeroRow>
      </Hero>

      <DescSection>
        <DescInner>
          <DescText>{desc}</DescText>
        </DescInner>
      </DescSection>

      <RulesSection>
        <RulesInner>
          <RulesEyebrow>{tDetail('rulesEyebrow')}</RulesEyebrow>
          <RulesTitle>{tDetail('rulesTitle')}</RulesTitle>
          <RulesCard>
            {rules.map((r, i) => (
              <RuleRow key={r.t} $last={i === rules.length - 1}>
                <RuleNum $bg={game.color} $color={txt}>{i + 1}</RuleNum>
                <div>
                  <RuleTitle>{r.t}</RuleTitle>
                  <RuleDesc>{r.d}</RuleDesc>
                </div>
              </RuleRow>
            ))}
          </RulesCard>
        </RulesInner>
      </RulesSection>

      <Cta>
        <CtaInner>
          <CtaTitle>{tDetail('ctaTitle', { name })}</CtaTitle>
          <CtaSub>{tDetail('ctaSub')}</CtaSub>
          <CtaBadges>
            <StoreBadges />
          </CtaBadges>
        </CtaInner>
      </Cta>

      <Others>
        <OthersInner>
          <OthersTitle>{tDetail('othersTitle')}</OthersTitle>
          <Grid>
            {others.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </Grid>
        </OthersInner>
      </Others>
    </>
  );
}
