import type { Metadata } from 'next';
import GamesIndex from '../components/GamesIndex';

export const metadata: Metadata = {
  title: 'Nos jeux',
  description: '8 jeux pour animer n’importe quelle soirée.',
};

export default function Page() {
  return <GamesIndex />;
}
