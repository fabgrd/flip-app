import { RFCategoryId, RFLevelKey } from './types';

export const RF_CATEGORIES: readonly RFCategoryId[] = [
  'stalker',
  'manipulateur',
  'narcisse',
  'drama',
  'collant',
];

export const RF_LEVEL_KEYS: readonly RFLevelKey[] = ['soft', 'chill', 'hot', 'hard'];

export const RF_LEVEL_LABELS: Readonly<Record<RFLevelKey, string>> = {
  soft: 'Soft',
  chill: 'Chill',
  hot: 'Hot',
  hard: 'Hard',
};

// Same accent palette as Purity (Soft, Chill, Hot, Hard — Medium skipped, RF only has 4 buckets).
export const RF_LEVEL_COLORS: Readonly<Record<RFLevelKey, string>> = {
  soft: '#8BC4A0',
  chill: '#6BB5DE',
  hot: '#F4834F',
  hard: '#E05252',
};

// Each level corresponds to a points value in the JSON (2..5).
export const RF_LEVEL_POINTS: Readonly<Record<RFLevelKey, number>> = {
  soft: 2,
  chill: 3,
  hot: 4,
  hard: 5,
};

export const RF_LEVEL_INDEX: Readonly<Record<RFLevelKey, number>> = {
  soft: 0,
  chill: 1,
  hot: 2,
  hard: 3,
};

export const RF_CATEGORY_LABELS: Readonly<Record<RFCategoryId, string>> = {
  stalker: 'Stalker',
  manipulateur: 'Manipulateur',
  narcisse: 'Narcisse',
  drama: 'Drama',
  collant: 'Collant',
};

export const RF_CATEGORY_COLORS: Readonly<Record<RFCategoryId, string>> = {
  stalker: '#FF5B3A',
  manipulateur: '#9B5BFF',
  narcisse: '#FFD23F',
  drama: '#E63946',
  collant: '#FF8FB1',
};

export const RF_DEFAULT_CAT_COUNTS: Readonly<Record<RFCategoryId, number>> = {
  stalker: 4,
  manipulateur: 4,
  narcisse: 4,
  drama: 4,
  collant: 4,
};
