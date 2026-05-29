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
} from '../components/icons';
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
  titleKey: string;
  taglineKey: string;
  icon: ComponentType<{ size?: number }>;
  color: GameColorToken;
  minPlayers: number;
  maxPlayers: number;
  playersLabelKey: string;
  durationLabelKey: string;
  route: GameRoute;
  requires: readonly Entitlement[];
  variants?: readonly GameVariantConfig[];
  enabled: boolean;
  isNew?: boolean;
  developmentOnly?: boolean;
}

export const GAMES: readonly GameConfig[] = [
  {
    id: 'purity-test',
    titleKey: 'games:purityTest.title',
    taglineKey: 'games:purityTest.tagline',
    icon: PureteIcon,
    color: 'violet',
    minPlayers: 1,
    maxPlayers: 99,
    playersLabelKey: 'games:labels.players.purityTest',
    durationLabelKey: 'games:labels.duration.purityTest',
    route: 'PurityTest',
    requires: [],
    variants: [
      { id: 'spicy', requires: 'spicy_content' },
      { id: 'hardcore', requires: 'hardcore_content' },
    ],
    enabled: true,
    isNew: true,
  },
  {
    id: 'red-flag',
    titleKey: 'games:redFlag.title',
    taglineKey: 'games:redFlag.tagline',
    icon: RedFlagIcon,
    color: 'tomato',
    minPlayers: 1,
    maxPlayers: 99,
    playersLabelKey: 'games:labels.players.redFlag',
    durationLabelKey: 'games:labels.duration.redFlag',
    route: 'RedFlag',
    requires: [],
    enabled: true,
    isNew: false,
  },
  {
    id: 'casting',
    titleKey: 'games:casting.title',
    taglineKey: 'games:casting.tagline',
    icon: CastingIcon,
    color: 'castingOrange',
    minPlayers: 3,
    maxPlayers: 11,
    playersLabelKey: 'games:labels.players.casting',
    durationLabelKey: 'games:labels.duration.casting',
    route: 'Casting',
    requires: [],
    variants: [{ id: 'drinks', requires: 'drinks_mode' }],
    enabled: true,
  },
  {
    id: 'apero',
    titleKey: 'games:apero.title',
    taglineKey: 'games:apero.tagline',
    icon: AperoIcon,
    color: 'pink',
    minPlayers: 2,
    maxPlayers: 99,
    playersLabelKey: 'games:labels.players.apero',
    durationLabelKey: 'games:labels.duration.apero',
    route: 'Apero',
    requires: [],
    variants: [{ id: 'drinks', requires: 'drinks_mode' }],
    enabled: true,
  },
  {
    id: 'medusa',
    titleKey: 'games:medusa.title',
    taglineKey: 'games:medusa.tagline',
    icon: MedusaIcon,
    color: 'cobalt',
    minPlayers: 5,
    maxPlayers: 20,
    playersLabelKey: 'games:labels.players.medusa',
    durationLabelKey: 'games:labels.duration.medusa',
    route: 'Medusa',
    requires: [],
    variants: [{ id: 'drinks', requires: 'drinks_mode' }],
    enabled: true,
  },
  {
    id: 'paranoia',
    titleKey: 'games:paranoia.title',
    taglineKey: 'games:paranoia.tagline',
    icon: ParanoiaIcon,
    color: 'teal',
    minPlayers: 4,
    maxPlayers: 10,
    playersLabelKey: 'games:labels.players.paranoia',
    durationLabelKey: 'games:labels.duration.paranoia',
    route: 'Paranoia',
    requires: [],
    enabled: true,
  },
  {
    id: 'cameleon',
    titleKey: 'games:cameleon.title',
    taglineKey: 'games:cameleon.tagline',
    icon: ChameleonIcon,
    color: 'mint',
    minPlayers: 4,
    maxPlayers: 20,
    playersLabelKey: 'games:labels.players.cameleon',
    durationLabelKey: 'games:labels.duration.cameleon',
    route: 'Cameleon',
    requires: [],
    enabled: true,
  },
  {
    id: 'left-right',
    titleKey: 'games:leftRight.title',
    taglineKey: 'games:leftRight.tagline',
    icon: GaucheDroiteIcon,
    color: 'lemon',
    minPlayers: 1,
    maxPlayers: 99,
    playersLabelKey: 'games:labels.players.leftRight',
    durationLabelKey: 'games:labels.duration.leftRight',
    route: 'LeftRight',
    requires: [],
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
