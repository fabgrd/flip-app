import type { ComponentType } from 'react';
import { T } from './theme';
import {
  IconApero,
  IconCameleon,
  IconCasting,
  IconGaucheDroite,
  IconMedusa,
  IconParanoia,
  IconPurete,
  IconRedFlag,
} from './icons';

export type GameId =
  | 'cameleon'
  | 'gauche-droite'
  | 'purete'
  | 'paranoia'
  | 'medusa'
  | 'apero'
  | 'casting'
  | 'red-flag';

export type GameMeta = {
  id: GameId;
  num: number;
  color: string;
  Icon: ComponentType<{ size?: number }>;
};

export const GAMES: GameMeta[] = [
  { id: 'cameleon', num: 1, color: T.mint, Icon: IconCameleon },
  { id: 'gauche-droite', num: 2, color: T.lemon, Icon: IconGaucheDroite },
  { id: 'purete', num: 3, color: T.violet, Icon: IconPurete },
  { id: 'paranoia', num: 4, color: T.tomato, Icon: IconParanoia },
  { id: 'medusa', num: 5, color: T.cobalt, Icon: IconMedusa },
  { id: 'apero', num: 6, color: T.pink, Icon: IconApero },
  { id: 'casting', num: 7, color: T.orange, Icon: IconCasting },
  { id: 'red-flag', num: 8, color: T.red, Icon: IconRedFlag },
];

export const getGame = (id: string): GameMeta | undefined => GAMES.find((g) => g.id === id);
