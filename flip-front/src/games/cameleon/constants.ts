import { t } from 'i18next';
import { CameleonRoleDistribution, CameleonWordPair } from './types';

export const DEFAULT_DISTRIBUTION_BY_PLAYER_COUNT: Record<number, CameleonRoleDistribution> = {
  4: { undercovers: 1, mrWhites: 0 },
  5: { undercovers: 1, mrWhites: 1 },
  6: { undercovers: 2, mrWhites: 0 },
  7: { undercovers: 2, mrWhites: 1 },
  8: { undercovers: 2, mrWhites: 1 },
  9: { undercovers: 3, mrWhites: 1 },
  10: { undercovers: 3, mrWhites: 1 },
};

export const WORD_PAIRS: CameleonWordPair[] = [
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
  { civilianWord: t('cameleon:wordPairs.football'), cameleonWord: t('cameleon:wordPairs.rugby') },
  { civilianWord: t('cameleon:wordPairs.cinema'), cameleonWord: t('cameleon:wordPairs.theatre') },
  { civilianWord: t('cameleon:wordPairs.concert'), cameleonWord: t('cameleon:wordPairs.festival') },
  { civilianWord: t('cameleon:wordPairs.foret'), cameleonWord: t('cameleon:wordPairs.jungle') },
  {
    civilianWord: t('cameleon:wordPairs.marijuana'),
    cameleonWord: t('cameleon:wordPairs.hashish'),
  },
  { civilianWord: t('cameleon:wordPairs.neige'), cameleonWord: t('cameleon:wordPairs.glace') },
  { civilianWord: t('cameleon:wordPairs.biere'), cameleonWord: t('cameleon:wordPairs.vin') },
  {
    civilianWord: t('cameleon:wordPairs.gta'),
    cameleonWord: t('cameleon:wordPairs.redDeadRedemption'),
  },
  {
    civilianWord: t('cameleon:wordPairs.onePiece'),
    cameleonWord: t('cameleon:wordPairs.dragonBall'),
  },
];
