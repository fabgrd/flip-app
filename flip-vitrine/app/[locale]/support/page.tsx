import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Support from '../../components/Support';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Support.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Support />;
}
