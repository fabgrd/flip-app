import { t } from 'i18next';
import { CameleonRoleDistribution, CameleonTheme, CameleonWordPair } from './types';

export const DEFAULT_DISTRIBUTION_BY_PLAYER_COUNT: Record<number, CameleonRoleDistribution> = {
  4: { undercovers: 1, mrWhites: 0 },
  5: { undercovers: 1, mrWhites: 1 },
  6: { undercovers: 2, mrWhites: 0 },
  7: { undercovers: 2, mrWhites: 1 },
  8: { undercovers: 2, mrWhites: 1 },
  9: { undercovers: 3, mrWhites: 1 },
  10: { undercovers: 3, mrWhites: 1 },
};

const DAILY_WORD_PAIRS: CameleonWordPair[] = [
  { civilianWord: t('cameleon:wordPairs.chat'), cameleonWord: t('cameleon:wordPairs.tigre') },
  { civilianWord: t('cameleon:wordPairs.plage'), cameleonWord: t('cameleon:wordPairs.desert') },
  { civilianWord: t('cameleon:wordPairs.pizza'), cameleonWord: t('cameleon:wordPairs.tarte') },
  { civilianWord: t('cameleon:wordPairs.avion'), cameleonWord: t('cameleon:wordPairs.fusee') },
  { civilianWord: t('cameleon:wordPairs.hiver'), cameleonWord: t('cameleon:wordPairs.automne') },
  {
    civilianWord: t('cameleon:wordPairs.infirmier'),
    cameleonWord: t('cameleon:wordPairs.medecin'),
  },
  {
    civilianWord: t('cameleon:wordPairs.boulanger'),
    cameleonWord: t('cameleon:wordPairs.patissier'),
  },
  { civilianWord: t('cameleon:wordPairs.cinema'), cameleonWord: t('cameleon:wordPairs.theatre') },
  { civilianWord: t('cameleon:wordPairs.concert'), cameleonWord: t('cameleon:wordPairs.festival') },
  { civilianWord: t('cameleon:wordPairs.foret'), cameleonWord: t('cameleon:wordPairs.jungle') },
  { civilianWord: t('cameleon:wordPairs.neige'), cameleonWord: t('cameleon:wordPairs.glace') },
  { civilianWord: t('cameleon:wordPairs.biere'), cameleonWord: t('cameleon:wordPairs.vin') },
];

const FOOTBALL_WORD_PAIRS: CameleonWordPair[] = [
  { civilianWord: t('cameleon:wordPairs.football'), cameleonWord: t('cameleon:wordPairs.rugby') },
  {
    civilianWord: t('cameleon:wordPairs.gta'),
    cameleonWord: t('cameleon:wordPairs.redDeadRedemption'),
  },
  {
    civilianWord: t('cameleon:wordPairs.onePiece'),
    cameleonWord: t('cameleon:wordPairs.dragonBall'),
  },
  { civilianWord: t('cameleon:wordPairs.cinema'), cameleonWord: t('cameleon:wordPairs.theatre') },
  { civilianWord: t('cameleon:wordPairs.concert'), cameleonWord: t('cameleon:wordPairs.festival') },
  { civilianWord: t('cameleon:wordPairs.neige'), cameleonWord: t('cameleon:wordPairs.glace') },
];

const HOT_WORD_PAIRS: CameleonWordPair[] = [
  {
    civilianWord: t('cameleon:wordPairs.marijuana'),
    cameleonWord: t('cameleon:wordPairs.hashish'),
  },
  {
    civilianWord: t('cameleon:wordPairs.bouzelouf'),
    cameleonWord: t('cameleon:wordPairs.tastyCrousty'),
  },
  {
    civilianWord: t('cameleon:wordPairs.biteDeCheval'),
    cameleonWord: t('cameleon:wordPairs.couilleDeTaureau'),
  },
  {
    civilianWord: t('cameleon:wordPairs.saintNectaire'),
    cameleonWord: t('cameleon:wordPairs.camembert'),
  },
  { civilianWord: t('cameleon:wordPairs.pet'), cameleonWord: t('cameleon:wordPairs.rot') },
  { civilianWord: t('cameleon:wordPairs.vomi'), cameleonWord: t('cameleon:wordPairs.caca') },
  { civilianWord: t('cameleon:wordPairs.OM'), cameleonWord: t('cameleon:wordPairs.OL') },
];

const WTF_WORD_PAIRS: CameleonWordPair[] = [
  {
    civilianWord: t('cameleon:wordPairs.bombonnne'),
    cameleonWord: t('cameleon:wordPairs.ballon'),
  },
  {
    civilianWord: t('cameleon:wordPairs.rouge'),
    cameleonWord: t('cameleon:wordPairs.porto'),
  },
  {
    civilianWord: t('cameleon:wordPairs.gland'),
    cameleonWord: t('cameleon:wordPairs.freine'),
  },
  { civilianWord: t('cameleon:wordPairs.chat'), cameleonWord: t('cameleon:wordPairs.tigre') },
  { civilianWord: t('cameleon:wordPairs.plage'), cameleonWord: t('cameleon:wordPairs.desert') },
];

const RANDOM_WORD_PAIRS: CameleonWordPair[] = [
  ...DAILY_WORD_PAIRS,
  ...FOOTBALL_WORD_PAIRS,
  ...HOT_WORD_PAIRS,
  ...WTF_WORD_PAIRS,
];

export const CAMELEON_THEME_OPTIONS: Array<{ value: CameleonTheme; labelKey: string }> = [
  { value: 'random', labelKey: 'cameleon:themes.random' },
  { value: 'daily', labelKey: 'cameleon:themes.daily' },
  { value: 'football', labelKey: 'cameleon:themes.football' },
  { value: 'hot', labelKey: 'cameleon:themes.hot' },
  { value: 'wtf', labelKey: 'cameleon:themes.wtf' },
];

export const WORD_PAIRS_BY_THEME: Record<CameleonTheme, CameleonWordPair[]> = {
  random: RANDOM_WORD_PAIRS,
  daily: DAILY_WORD_PAIRS,
  football: FOOTBALL_WORD_PAIRS,
  hot: HOT_WORD_PAIRS,
  wtf: WTF_WORD_PAIRS,
};

export function getWordPairsForTheme(theme: CameleonTheme): CameleonWordPair[] {
  return WORD_PAIRS_BY_THEME[theme] ?? RANDOM_WORD_PAIRS;
}
