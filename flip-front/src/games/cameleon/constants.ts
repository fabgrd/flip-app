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
  { civilianWord: 'Chat', cameleonWord: 'Tigre' },
  { civilianWord: 'Plage', cameleonWord: 'Désert' },
  { civilianWord: 'Pizza', cameleonWord: 'Tarte' },
  { civilianWord: 'Avion', cameleonWord: 'Fusée' },
  { civilianWord: 'Hiver', cameleonWord: 'Automne' },
  { civilianWord: 'Infirmier', cameleonWord: 'Médecin' },
  { civilianWord: 'Boulanger', cameleonWord: 'Pâtissier' },
  { civilianWord: 'Football', cameleonWord: 'Rugby' },
  { civilianWord: 'Cinéma', cameleonWord: 'Théâtre' },
  { civilianWord: 'Concert', cameleonWord: 'Festival' },
  { civilianWord: 'Forêt', cameleonWord: 'Jungle' },
  { civilianWord: 'Marijuana', cameleonWord: 'Hashish' },
  { civilianWord: 'Neige', cameleonWord: 'Glace' },
  { civilianWord: 'Bière', cameleonWord: 'Vin' },
  { civilianWord: 'GTA', cameleonWord: 'Red Dead Redemption' },
  { civilianWord: 'One Piece', cameleonWord: 'Dragon Ball' },
];
