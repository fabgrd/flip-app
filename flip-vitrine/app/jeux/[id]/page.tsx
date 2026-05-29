import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GameDetail from '../../components/GameDetail';
import { GAMES, getGame } from '../../lib/games';

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return GAMES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const game = getGame(id);
  if (!game) return {};
  return {
    title: game.name,
    description: game.tagline,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  if (!getGame(id)) notFound();
  return <GameDetail id={id} />;
}
