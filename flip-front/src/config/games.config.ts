import { ComponentType } from 'react';

import {
  AperoIcon,
  CastingIcon,
  ChameleonIcon,
  GaucheDroiteIcon,
  MedusaIcon,
  ParanoiaIcon,
  PureteIcon,
  RedFlagIcon,
} from '../components';
import { T } from '../constants/flipTokens';
import { Entitlement } from '../entitlements';

export type GameId =
  | 'red-flag'
  | 'casting'
  | 'apero'
  | 'medusa'
  | 'paranoia'
  | 'cameleon'
  | 'left-right'
  | 'purity-test';

export type GameRoute =
  | 'PurityTest'
  | 'Cameleon'
  | 'LeftRight'
  | 'Paranoia'
  | 'Medusa'
  | 'Apero'
  | 'Casting'
  | 'RedFlag';

export type GameColorToken = keyof typeof T;

export interface GameVariantConfig {
  id: string;
  requires?: Entitlement | readonly Entitlement[];
}

export interface GameConfig {
  id: GameId;
  title: string;
  tagline: string;
  icon: ComponentType<{ size?: number }>;
  color: GameColorToken;
  minPlayers: number;
  maxPlayers: number;
  playersLabel: string;
  durationLabel: string;
  route: GameRoute;
  requires: readonly Entitlement[];
  variants?: readonly GameVariantConfig[];
  enabled: boolean;
  isNew?: boolean;
  developmentOnly?: boolean;
}

export const GAMES: readonly GameConfig[] = [
  {
    id: 'red-flag',
    title: 'Es-tu un Red Flag ?',
    tagline: 'Tes exs auraient aimé te faire passer ce test',
    icon: RedFlagIcon,
    color: 'tomato',
    minPlayers: 1,
    maxPlayers: 99,
    playersLabel: '1+',
    durationLabel: '5 min',
    route: 'RedFlag',
    requires: [],
    enabled: true,
    isNew: true,
  },
  {
    id: 'casting',
    title: 'Le Casting',
    tagline: 'Joue la scène plus ou moins',
    icon: CastingIcon,
    color: 'castingOrange',
    minPlayers: 3,
    maxPlayers: 11,
    playersLabel: '3–11',
    durationLabel: '20 min',
    route: 'Casting',
    requires: [],
    variants: [{ id: 'drinks', requires: 'drinks_mode' }],
    enabled: true,
  },
  {
    id: 'apero',
    title: "L'Apéro",
    tagline: 'Devine la carte du donneur',
    icon: AperoIcon,
    color: 'pink',
    minPlayers: 2,
    maxPlayers: 99,
    playersLabel: '2+',
    durationLabel: '20 min',
    route: 'Apero',
    requires: [],
    variants: [{ id: 'drinks', requires: 'drinks_mode' }],
    enabled: true,
  },
  {
    id: 'medusa',
    title: 'Médusa',
    tagline: 'Lève les yeux… et évite le regard',
    icon: MedusaIcon,
    color: 'cobalt',
    minPlayers: 5,
    maxPlayers: 20,
    playersLabel: '5+',
    durationLabel: '10 min',
    route: 'Medusa',
    requires: [],
    variants: [{ id: 'drinks', requires: 'drinks_mode' }],
    enabled: true,
  },
  {
    id: 'paranoia',
    title: 'Paranoïa',
    tagline: 'Qui a dit ton prénom… et pourquoi ?',
    icon: ParanoiaIcon,
    color: 'teal',
    minPlayers: 4,
    maxPlayers: 10,
    playersLabel: '4+',
    durationLabel: '15 min',
    route: 'Paranoia',
    requires: [],
    enabled: true,
  },
  {
    id: 'cameleon',
    title: 'Caméléon',
    tagline: "Démasque l'imposteur",
    icon: ChameleonIcon,
    color: 'mint',
    minPlayers: 4,
    maxPlayers: 10,
    playersLabel: '4–10',
    durationLabel: '15 min',
    route: 'Cameleon',
    requires: [],
    enabled: true,
  },
  {
    id: 'left-right',
    title: 'Gauche ou Droite',
    tagline: "Place la phrase sur l'échiquier politique",
    icon: GaucheDroiteIcon,
    color: 'lemon',
    minPlayers: 2,
    maxPlayers: 99,
    playersLabel: '2+',
    durationLabel: '10 min',
    route: 'LeftRight',
    requires: [],
    enabled: true,
  },
  {
    id: 'purity-test',
    title: 'Test de Pureté',
    tagline: 'Combien de péchés à ton actif ?',
    icon: PureteIcon,
    color: 'violet',
    minPlayers: 1,
    maxPlayers: 99,
    playersLabel: '1+',
    durationLabel: '5 min',
    route: 'PurityTest',
    requires: [],
    variants: [
      { id: 'spicy', requires: 'spicy_content' },
      { id: 'hardcore', requires: 'hardcore_content' },
    ],
    enabled: true,
  },
];

export const GAMES_BY_ID: Readonly<Record<GameId, GameConfig>> = Object.freeze(
  GAMES.reduce(
    (acc, g) => {
      acc[g.id] = g;
      return acc;
    },
    {} as Record<GameId, GameConfig>,
  ),
);

export function getGameConfig(id: string): GameConfig | undefined {
  return GAMES_BY_ID[id as GameId];
}
