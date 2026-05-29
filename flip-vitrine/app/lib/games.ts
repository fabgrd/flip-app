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

export type Rule = { t: string; d: string };

export type Game = {
  id: string;
  name: string;
  num: number;
  color: string;
  tagline: string;
  category: string;
  players: string;
  time: string;
  Icon: ComponentType<{ size?: number }>;
  desc: string;
  rules: Rule[];
};

export const GAMES: Game[] = [
  {
    id: 'cameleon',
    name: 'Caméléon',
    num: 1,
    color: T.mint,
    tagline: "Démasque l'imposteur",
    category: 'Bluff',
    players: '4–10',
    time: '15 min',
    Icon: IconCameleon,
    desc: "Un mot secret est partagé entre tous les joueurs… sauf un : le caméléon. Chacun donne un indice à tour de rôle, puis le groupe vote pour démasquer l'imposteur. Le caméléon doit bluffer pour se fondre dans la masse — et s'il est démasqué, il a une dernière chance de sauver sa peau en devinant le mot.",
    rules: [
      { t: 'Faites tourner le tel', d: 'Chacun voit son mot secret… sauf le caméléon.' },
      { t: 'À tour de rôle, un indice', d: 'Un mot, pas plus. Pas trop évident, pas trop vague.' },
      { t: 'Tout le monde vote', d: "Démasquez l'imposteur ou laissez-le filer." },
    ],
  },
  {
    id: 'gauche-droite',
    name: 'Gauche ou Droite',
    num: 2,
    color: T.lemon,
    tagline: "L'échiquier politique",
    category: 'Quiz',
    players: '2–∞',
    time: '10 min',
    Icon: IconGaucheDroite,
    desc: "Une phrase de la vie de tous les jours s'affiche. À toi de deviner si c'est politiquement à gauche ou à droite. Aucun jugement, juste un quiz — le débat vient naturellement après.",
    rules: [
      { t: "Une phrase s'affiche", d: 'Une opinion, un fait de société, un sujet de débat.' },
      { t: 'Place ta réponse', d: 'Gauche ou droite ? Choisis ton camp.' },
      { t: 'Le verdict tombe', d: "L'app valide — et le débat peut commencer." },
    ],
  },
  {
    id: 'purete',
    name: 'Test de Pureté',
    num: 3,
    color: T.violet,
    tagline: "Combien de péchés à ton actif ?",
    category: 'Solo',
    players: 'Solo+',
    time: '5 min',
    Icon: IconPurete,
    desc: "30 questions « as-tu déjà… ». Chaque case cochée fait baisser ton score de pureté. Plus c'est bas, plus tu as vécu. Honnêteté absolue requise — ce qui est dit ici reste ici.",
    rules: [
      { t: "30 questions s'affichent", d: '« As-tu déjà… » — une à la fois.' },
      { t: 'Coupable ou innocent', d: 'Appuie sur Jamais ou Coupable pour chaque question.' },
      { t: 'Ton score tombe', d: 'De 100% (pur) à 0% (légende vivante).' },
    ],
  },
  {
    id: 'paranoia',
    name: 'Paranoïa',
    num: 4,
    color: T.tomato,
    tagline: 'Secret ou révélation',
    category: 'Ambiance',
    players: '4–10',
    time: '20 min',
    Icon: IconParanoia,
    desc: "Un questionneur pose une question secrète à une cible. La cible désigne quelqu'un du groupe à voix haute — mais personne ne connaît la question. Pile ou face décide si elle sera révélée ou gardée secrète.",
    rules: [
      { t: 'Le questionneur voit une question', d: 'Genre « qui craquerait en prison ? ». Il la garde pour lui.' },
      { t: "La cible choisit quelqu'un", d: 'Elle désigne un joueur à voix haute. Le groupe panique.' },
      { t: 'Pile ou face', d: 'La cible perd ? La question est révélée pour tout le monde.' },
    ],
  },
  {
    id: 'medusa',
    name: 'Médusa',
    num: 5,
    color: T.cobalt,
    tagline: 'Ne croise aucun regard',
    category: 'Action',
    players: '5+',
    time: '10 min',
    Icon: IconMedusa,
    desc: 'Tout le monde regarde en bas. Au signal « MÉDUSA ! », levez les yeux et fixez quelqu\'un. Si deux joueurs se croisent du regard : pénalité. Fous rires garantis.',
    rules: [
      { t: 'Tout le monde regarde en bas', d: 'Le joueur actif dit « Regardez en bas ! ».' },
      { t: '3… 2… 1… MÉDUSA !', d: 'Au signal, levez la tête et fixez un joueur.' },
      { t: 'Eye contact = pénalité', d: 'Deux regards croisés ? 1 gorgée chacun.' },
    ],
  },
  {
    id: 'apero',
    name: "L'Apéro",
    num: 6,
    color: T.pink,
    tagline: 'Devine la carte ou bois la diff',
    category: 'Cartes',
    players: '3–8',
    time: '15 min',
    Icon: IconApero,
    desc: "Le donneur pioche une carte, le joueur devine la valeur. C'est plus ou c'est moins ? Raté : bois la différence entre ta réponse et la carte. Trouvé : le donneur trinque.",
    rules: [
      { t: 'Le donneur pioche', d: 'La carte reste cachée. Le joueur tente de deviner.' },
      { t: "C'est plus ou c'est moins ?", d: 'Un premier essai, un indice, puis un dernier essai.' },
      { t: 'Bois la différence', d: 'Raté = |ta réponse − la carte| en gorgées.' },
    ],
  },
  {
    id: 'casting',
    name: 'Le Casting',
    num: 7,
    color: T.orange,
    tagline: 'Joue la scène, trompe le jury',
    category: 'Acting',
    players: '3–11',
    time: '20 min',
    Icon: IconCasting,
    desc: "Un scénario, des chiffres secrets de 1 (catastrophique) à 10 (oscar). Chaque acteur joue la scène selon son chiffre. Le devin observe et essaie de deviner les chiffres. Acting, bluff et fous rires.",
    rules: [
      { t: 'Un devin est désigné', d: 'Il observe. Les autres sont les acteurs.' },
      { t: 'Chaque acteur reçoit un chiffre', d: 'De 1 (nul) à 10 (oscar). Le devin ne sait pas.' },
      { t: 'Joue la scène, devine', d: "Le devin attribue un chiffre. L'écart = gorgées." },
    ],
  },
  {
    id: 'red-flag',
    name: 'Red Flag',
    num: 8,
    color: T.red,
    tagline: 'Es-tu un red flag ?',
    category: 'Solo',
    players: 'Solo',
    time: '5 min',
    Icon: IconRedFlag,
    desc: 'Es-tu un red flag ? 20 questions en swipe façon Tinder. Score de toxicité partageable. Le test que tes exs auraient aimé te faire passer.',
    rules: [
      { t: 'Swipe les cartes', d: '20 questions — une à la fois, style Tinder.' },
      { t: 'Coupable ou innocent', d: 'Swipe droite si oui, gauche si non.' },
      { t: 'Ton score tombe', d: "Plus c'est haut, plus t'es un red flag." },
    ],
  },
];

export const getGame = (id: string): Game | undefined => GAMES.find((g) => g.id === id);
