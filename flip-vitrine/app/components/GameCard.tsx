'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { T, fonts } from '../lib/theme';
import type { Game } from '../lib/games';

const CardLink = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: none;
`;

const Card = styled.div`
  background: ${T.paper};
  border: 2px solid ${T.ink};
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 5px 5px 0 ${T.ink};
  cursor: pointer;
  transition: transform 140ms ease, box-shadow 140ms ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 ${T.ink};
  }
`;

const Inner = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 110px;
`;

const IconCell = styled.div<{ $bg: string }>`
  width: 100px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px solid ${T.ink};
  background: ${(p) => p.$bg};
`;

const Body = styled.div`
  flex: 1;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Name = styled.div`
  font-family: ${fonts.display};
  font-weight: 800;
  font-size: 22px;
  line-height: 1;
  letter-spacing: -0.6px;
  color: ${T.ink};
`;

const Tagline = styled.div`
  margin-top: 5px;
  font-family: ${fonts.sans};
  font-size: 14px;
  color: ${T.inkSoft};
  line-height: 1.3;
`;

const Tags = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  background: ${T.bg};
  border: 1.5px solid ${T.ink};
  border-radius: 999px;
  font-family: ${fonts.mono};
  font-size: 11px;
  font-weight: 600;
  color: ${T.ink};
`;

export default function GameCard({ game }: { game: Game }) {
  const { Icon } = game;
  return (
    <CardLink href={`/jeux/${game.id}`}>
      <Card>
        <Inner>
          <IconCell $bg={game.color}>
            <Icon size={56} />
          </IconCell>
          <Body>
            <Name>{game.name}</Name>
            <Tagline>{game.tagline}</Tagline>
            <Tags>
              <Tag>👥 {game.players}</Tag>
              <Tag>⏱ {game.time}</Tag>
            </Tags>
          </Body>
        </Inner>
      </Card>
    </CardLink>
  );
}
