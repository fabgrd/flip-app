import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import GameDetail from '../../../components/GameDetail';
import { GAMES, getGame } from '../../../lib/games';
import { routing } from '../../../i18n/routing';

type Params = { locale: string; id: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    GAMES.map((g) => ({ locale, id: g.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!getGame(id)) return {};
  const t = await getTranslations({ locale, namespace: `Games.items.${id}` });
  return {
    title: t('name'),
    description: t('tagline'),
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale, id } = await params;
  if (!getGame(id)) notFound();
  setRequestLocale(locale);
  return <GameDetail id={id} />;
}
