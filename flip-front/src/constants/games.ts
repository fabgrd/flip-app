import { Game } from '../types';

export const AVAILABLE_GAMES: Game[] = [
  {
    id: '6-qui-prend',
    name: '6 qui prend !',
    minPlayers: 2,
    maxPlayers: 10,
    description: 'Un jeu de cartes stratégique où il faut éviter de prendre des cartes avec des têtes de bœuf. Parfait pour s\'amuser entre amis !',
  },
  {
    id: 'purity-test',
    name: 'Test de Pureté',
    minPlayers: 1,
    maxPlayers: 10,
    description: 'Un jeu de questions pour découvrir qui est le plus pur du groupe ! Répondez honnêtement aux questions sur différents thèmes.',
  },
  // Futurs jeux à ajouter ici
];

export const MIN_PLAYERS_GLOBAL = 2;
export const MAX_PLAYERS_GLOBAL = 10; 