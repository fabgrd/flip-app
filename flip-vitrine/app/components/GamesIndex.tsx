'use client';

import styled from 'styled-components';
import { T, bp, fonts } from '../lib/theme';
import { GAMES } from '../lib/games';
import GameCard from './GameCard';

const Section = styled.section`
  padding: 56px 60px 80px;

  @media ${bp.mobile} {
    padding: 36px 20px 56px;
  }
`;

const Inner = styled.div`
  max-width: 1100px;
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
  max-width: 520px;

  @media ${bp.mobile} {
    font-size: 16px;
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

export default function GamesIndex() {
  return (
    <Section>
      <Inner>
        <Header>
          <Eyebrow>CATALOGUE</Eyebrow>
          <Title>Nos jeux</Title>
          <Lead>
            8 jeux pour animer n&apos;importe quelle soirée. Pas besoin de cartes, de dés ou de plateau — juste l&apos;app.
          </Lead>
        </Header>
        <Grid>
          {GAMES.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
