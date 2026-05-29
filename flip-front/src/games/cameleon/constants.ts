import { CameleonRoleDistribution, CameleonTheme, CameleonWordPair } from './types';

export const DEFAULT_DISTRIBUTION_BY_PLAYER_COUNT: Record<number, CameleonRoleDistribution> = {
  4: { undercovers: 1, mrWhites: 0 },
  5: { undercovers: 1, mrWhites: 1 },
  6: { undercovers: 2, mrWhites: 0 },
  7: { undercovers: 2, mrWhites: 1 },
  8: { undercovers: 2, mrWhites: 1 },
  9: { undercovers: 3, mrWhites: 1 },
  10: { undercovers: 3, mrWhites: 1 },
  11: { undercovers: 3, mrWhites: 1 },
  12: { undercovers: 3, mrWhites: 2 },
  13: { undercovers: 4, mrWhites: 1 },
  14: { undercovers: 4, mrWhites: 2 },
  15: { undercovers: 4, mrWhites: 2 },
  16: { undercovers: 5, mrWhites: 2 },
  17: { undercovers: 5, mrWhites: 2 },
  18: { undercovers: 5, mrWhites: 2 },
  19: { undercovers: 6, mrWhites: 2 },
  20: { undercovers: 6, mrWhites: 2 },
};

// ─────────────────────────────────────────────────────────────
// DAILY — vie quotidienne, métiers, lieux, objets courants
// ─────────────────────────────────────────────────────────────
const DAILY: CameleonWordPair[] = [
  { civilianWord: 'Chat', cameleonWord: 'Tigre' },
  { civilianWord: 'Chien', cameleonWord: 'Loup' },
  { civilianWord: 'Plage', cameleonWord: 'Piscine' },
  { civilianWord: 'Pizza', cameleonWord: 'Tarte flambée' },
  { civilianWord: 'Avion', cameleonWord: 'Hélicoptère' },
  { civilianWord: 'Hiver', cameleonWord: 'Automne' },
  { civilianWord: 'Infirmier', cameleonWord: 'Médecin' },
  { civilianWord: 'Boulanger', cameleonWord: 'Pâtissier' },
  { civilianWord: 'Cinéma', cameleonWord: 'Théâtre' },
  { civilianWord: 'Concert', cameleonWord: 'Festival' },
  { civilianWord: 'Forêt', cameleonWord: 'Jungle' },
  { civilianWord: 'Neige', cameleonWord: 'Grêle' },
  { civilianWord: 'Voiture', cameleonWord: 'Moto' },
  { civilianWord: 'Lit', cameleonWord: 'Canapé' },
  { civilianWord: 'Café', cameleonWord: 'Thé' },
  { civilianWord: 'Vélo', cameleonWord: 'Trottinette' },
  { civilianWord: 'Supermarché', cameleonWord: 'Épicerie' },
  { civilianWord: 'Mairie', cameleonWord: 'Préfecture' },
  { civilianWord: 'Camembert', cameleonWord: 'Brie' },
  { civilianWord: 'Boulangerie', cameleonWord: 'Sandwicherie' },
  { civilianWord: 'Musée', cameleonWord: "Galerie d'art" },
  { civilianWord: 'Médecin', cameleonWord: 'Pharmacien' },
  { civilianWord: 'Train', cameleonWord: 'Bus' },
  { civilianWord: 'Bibliothèque', cameleonWord: 'Librairie' },
  { civilianWord: 'Vacances', cameleonWord: 'Week-end' },
  { civilianWord: 'Maison', cameleonWord: 'Appartement' },
  { civilianWord: 'Pluie', cameleonWord: 'Brume' },
  { civilianWord: 'Montagne', cameleonWord: 'Colline' },
  { civilianWord: 'Chaussures', cameleonWord: 'Baskets' },
  { civilianWord: 'Réveil', cameleonWord: 'Alarme de téléphone' },
];

// ─────────────────────────────────────────────────────────────
// FOOTBALL & CULTURE POP — sport, gaming, séries, musique, réseaux
// ─────────────────────────────────────────────────────────────
const SOUSCULTURE: CameleonWordPair[] = [
  { civilianWord: 'Football', cameleonWord: 'Rugby' },
  { civilianWord: 'Handball', cameleonWord: 'Basket' },
  { civilianWord: 'Le Mans', cameleonWord: 'Monaco (F1)' },
  { civilianWord: 'GTA', cameleonWord: 'Red Dead Redemption' },
  { civilianWord: 'Fortnite', cameleonWord: 'PUBG' },
  { civilianWord: 'PS5', cameleonWord: 'Xbox' },
  { civilianWord: 'Minecraft', cameleonWord: 'Roblox' },
  { civilianWord: 'League of Legends', cameleonWord: 'Dota 2' },
  { civilianWord: 'One Piece', cameleonWord: 'Dragon Ball' },
  { civilianWord: 'Naruto', cameleonWord: 'Bleach' },
  { civilianWord: 'Marvel', cameleonWord: 'DC Comics' },
  { civilianWord: 'Netflix', cameleonWord: 'Disney+' },
  { civilianWord: 'Breaking Bad', cameleonWord: 'Peaky Blinders' },
  { civilianWord: 'TikTok', cameleonWord: 'Instagram' },
  { civilianWord: 'Snapchat', cameleonWord: 'Telegram' },
  { civilianWord: 'Rap', cameleonWord: 'R&B' },
  { civilianWord: 'Beyoncé', cameleonWord: 'Rihanna' },
  { civilianWord: 'PNL', cameleonWord: 'Nekfeu' },
  { civilianWord: 'Nike', cameleonWord: 'Adidas' },
  { civilianWord: 'Supreme', cameleonWord: 'Palace' },
  { civilianWord: 'iPhone', cameleonWord: 'Samsung Galaxy' },
  { civilianWord: 'YouTube', cameleonWord: 'Twitch' },
  { civilianWord: 'Spotify', cameleonWord: 'Deezer' },
  { civilianWord: 'Festival (musique)', cameleonWord: 'Rave' },
];

// ─────────────────────────────────────────────────────────────
// FOOT — juste du foot wesh
// ─────────────────────────────────────────────────────────────
const FOOTBALL: CameleonWordPair[] = [
  { civilianWord: 'Football', cameleonWord: 'Rugby' },
  { civilianWord: 'OM', cameleonWord: 'OL' },
  { civilianWord: 'Arsenal', cameleonWord: 'Tottenham' },
  { civilianWord: 'Messi', cameleonWord: 'Ronaldo' },
  { civilianWord: 'Ligue 1', cameleonWord: 'Premier League' },
  { civilianWord: 'Coupe du monde', cameleonWord: 'Euro' },
  { civilianWord: 'Mbappé', cameleonWord: 'Dembélé' },
  { civilianWord: 'Zidane', cameleonWord: 'Platini' },
  { civilianWord: 'Neymar', cameleonWord: 'Suarez' },
  { civilianWord: 'Benzema', cameleonWord: 'Giroud' },
  { civilianWord: 'Lloris', cameleonWord: 'Lucas Chevalier' },
  { civilianWord: 'Maradona', cameleonWord: 'Pelé' },
  { civilianWord: 'Real Madrid', cameleonWord: 'Atlético Madrid' },
  { civilianWord: 'Manchester United', cameleonWord: 'Manchester City' },
  { civilianWord: 'Bayern Munich', cameleonWord: 'Borussia Dortmund' },
  { civilianWord: 'Ligue des Champions', cameleonWord: 'Europa League' },
];
// ─────────────────────────────────────────────────────────────
// RAP — rappeurs français, hip-hop FR
// ─────────────────────────────────────────────────────────────
const RAP: CameleonWordPair[] = [
  { civilianWord: 'PNL', cameleonWord: 'Nekfeu' },
  { civilianWord: 'Booba', cameleonWord: 'Kaaris' },
  { civilianWord: 'Freeze Corleone', cameleonWord: 'Kalash Criminel' },
  { civilianWord: 'Jul', cameleonWord: 'Maes' },
  { civilianWord: 'Vald', cameleonWord: 'Gringe' },
  { civilianWord: 'Orelsan', cameleonWord: 'Roméo Elvis' },
  { civilianWord: 'Sadek', cameleonWord: 'Rohff' },
  { civilianWord: 'Jcvd', cameleonWord: "Heuss l'enfoiré" },
  { civilianWord: 'Moha La Squale', cameleonWord: '13 Block' },
  { civilianWord: 'Lacrim', cameleonWord: 'Kof Kof' },
];

// ─────────────────────────────────────────────────────────────
// HOT — sexe, drague, adulte
// ─────────────────────────────────────────────────────────────
const HOT: CameleonWordPair[] = [
  { civilianWord: 'OnlyFans', cameleonWord: 'Mym' },
  { civilianWord: 'Pornhub', cameleonWord: 'Xvideos' },
  { civilianWord: 'Gland', cameleonWord: 'Frein (anatomique)' },
  { civilianWord: 'Baiser', cameleonWord: 'Sucer' },
  { civilianWord: 'Pénis', cameleonWord: 'Clitoris' },
];

// ─────────────────────────────────────────────────────────────
// DECADENCE — alcool, drogue, substances, fêtes excessives
// ─────────────────────────────────────────────────────────────
const DECADENCE: CameleonWordPair[] = [
  { civilianWord: 'Marijuana', cameleonWord: 'Hashisch' },
  { civilianWord: 'Coke', cameleonWord: 'MDMA' },
  { civilianWord: 'Chicha', cameleonWord: 'Pétard' },
  { civilianWord: 'Gueule de bois', cameleonWord: 'Bad trip' },
  { civilianWord: 'Binge drinking', cameleonWord: 'Prégame' },
  { civilianWord: 'Vodka', cameleonWord: 'Rhum' },
  { civilianWord: 'Bière', cameleonWord: 'Cidre' },
  { civilianWord: 'Cuite', cameleonWord: 'Défonce' },
];

// ─────────────────────────────────────────────────────────────
// WTF — absurde, bizarre, improbable, références de groupe
// ─────────────────────────────────────────────────────────────
const WTF: CameleonWordPair[] = [
  { civilianWord: 'Bouzelouf', cameleonWord: 'Tasty Crousty' },
  { civilianWord: 'Bite de cheval', cameleonWord: 'Couille de taureau' },
  { civilianWord: 'Ballon (protoxyde)', cameleonWord: 'Bombonne de protoxyde' },
  { civilianWord: 'Pet', cameleonWord: 'Rot' },
  { civilianWord: 'Vomi', cameleonWord: 'Caca' },
  { civilianWord: 'Rouge qui tache', cameleonWord: 'Porto' },
  { civilianWord: 'Cheval de Troie', cameleonWord: 'Ransomware' },
  { civilianWord: 'Jean-Michel', cameleonWord: 'Gérard' },
  { civilianWord: 'Skibidi toilet', cameleonWord: 'Sigma grindset' },
  { civilianWord: 'Soupe de cailloux', cameleonWord: 'Smoothie de terre' },
  { civilianWord: 'Caillou (dessin animé)', cameleonWord: 'Oui-Oui' },
];

// ─────────────────────────────────────────────────────────────
// RANDOM = union de tous les thèmes
// ─────────────────────────────────────────────────────────────
const ALL: CameleonWordPair[] = [
  ...DAILY,
  ...SOUSCULTURE,
  ...RAP,
  ...FOOTBALL,
  ...HOT,
  ...DECADENCE,
  ...WTF,
];

export const CAMELEON_THEME_OPTIONS: Array<{ value: CameleonTheme; labelKey: string }> = [
  { value: 'random', labelKey: 'cameleon:themes.random' },
  { value: 'daily', labelKey: 'cameleon:themes.daily' },
  { value: 'sousculture', labelKey: 'cameleon:themes.sousculture' },
  { value: 'rap', labelKey: 'cameleon:themes.rap' },
  { value: 'football', labelKey: 'cameleon:themes.football' },
  { value: 'hot', labelKey: 'cameleon:themes.hot' },
  { value: 'decadence', labelKey: 'cameleon:themes.decadence' },
  { value: 'wtf', labelKey: 'cameleon:themes.wtf' },
];

export const WORD_PAIRS_BY_THEME: Record<Exclude<CameleonTheme, 'random'>, CameleonWordPair[]> = {
  daily: DAILY,
  sousculture: SOUSCULTURE,
  rap: RAP,
  football: FOOTBALL,
  hot: HOT,
  decadence: DECADENCE,
  wtf: WTF,
};

/**
 * Retourne les paires pour une sélection de thèmes.
 * Si 'random' est inclus (ou liste vide), retourne toutes les paires.
 * Déduplique si un même thème apparaît plusieurs fois.
 */
export function getWordPairsForThemes(themes: CameleonTheme[]): CameleonWordPair[] {
  if (themes.length === 0 || themes.includes('random')) return ALL;

  const seen = new Set<string>();
  const result: CameleonWordPair[] = [];

  for (const theme of themes) {
    if (theme === 'random') continue;
    const pairs = WORD_PAIRS_BY_THEME[theme] ?? [];
    for (const pair of pairs) {
      const key = `${pair.civilianWord}|${pair.cameleonWord}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(pair);
      }
    }
  }

  return result.length > 0 ? result : ALL;
}

// compat: ancienne signature pour ne pas casser d'autres éventuels imports
export function getWordPairsForTheme(theme: CameleonTheme): CameleonWordPair[] {
  return getWordPairsForThemes([theme]);
}

export function getWordPairsForThemesLocalized(
  themes: CameleonTheme[],
  pairsData: Record<string, Array<{ w: string; c: string }>>,
): CameleonWordPair[] {
  const toWordPair = (p: { w: string; c: string }): CameleonWordPair => ({
    civilianWord: p.w,
    cameleonWord: p.c,
  });

  if (themes.length === 0 || themes.includes('random')) {
    return Object.values(pairsData).flat().map(toWordPair);
  }

  const seen = new Set<string>();
  const result: CameleonWordPair[] = [];
  for (const theme of themes) {
    if (theme === 'random') continue;
    for (const pair of (pairsData[theme] ?? []).map(toWordPair)) {
      const key = `${pair.civilianWord}|${pair.cameleonWord}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(pair);
      }
    }
  }
  return result.length > 0 ? result : Object.values(pairsData).flat().map(toWordPair);
}
