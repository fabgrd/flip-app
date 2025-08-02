import { Question, Theme } from './types';

export const PURITY_QUESTIONS: Question[] = [
    // Questions sur la sexualité
    {
        id: 'sex_1',
        text: 'As-tu déjà embrassé quelqu\'un ?',
        theme: 'sex',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'sex_2',
        text: 'As-tu déjà eu des relations sexuelles ?',
        theme: 'sex',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'sex_3',
        text: 'As-tu déjà eu plus de 5 partenaires ?',
        theme: 'sex',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'sex_4',
        text: 'As-tu déjà eu une relation d\'un soir ?',
        theme: 'sex',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'sex_5',
        text: 'As-tu déjà trompé ton/ta partenaire ?',
        theme: 'sex',
        points: { yes: 1, no: 0 }
    },

    // Questions sur les drogues
    {
        id: 'drugs_1',
        text: 'As-tu déjà fumé une cigarette ?',
        theme: 'drugs',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'drugs_2',
        text: 'As-tu déjà bu de l\'alcool ?',
        theme: 'drugs',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'drugs_3',
        text: 'As-tu déjà été ivre au point de vomir ?',
        theme: 'drugs',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'drugs_4',
        text: 'As-tu déjà pris une drogue autre que le cannabis ?',
        theme: 'drugs',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'drugs_5',
        text: 'As-tu déjà fumé du cannabis ?',
        theme: 'drugs',
        points: { yes: 1, no: 0 }
    },

    // Questions sur la moralité
    {
        id: 'morality_1',
        text: 'As-tu déjà menti à tes parents ?',
        theme: 'morality',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'morality_2',
        text: 'As-tu déjà volé quelque chose ?',
        theme: 'morality',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'morality_3',
        text: 'As-tu déjà triché à un examen ?',
        theme: 'morality',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'morality_4',
        text: 'As-tu déjà insulté quelqu\'un méchamment ?',
        theme: 'morality',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'morality_5',
        text: 'As-tu déjà fait pleurer quelqu\'un volontairement ?',
        theme: 'morality',
        points: { yes: 1, no: 0 }
    },

    // Questions sur l'hygiène
    {
        id: 'hygiene_1',
        text: 'As-tu déjà oublié de te brosser les dents pendant plus de 2 jours ?',
        theme: 'hygiene',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'hygiene_2',
        text: 'As-tu déjà porté le même sous-vêtement plus de 3 jours ?',
        theme: 'hygiene',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'hygiene_3',
        text: 'As-tu déjà mangé quelque chose tombé par terre ?',
        theme: 'hygiene',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'hygiene_4',
        text: 'As-tu déjà utilisé les toilettes sans te laver les mains ?',
        theme: 'hygiene',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'hygiene_5',
        text: 'As-tu déjà dormi sans te laver pendant plus de 3 jours ?',
        theme: 'hygiene',
        points: { yes: 1, no: 0 }
    },

    // Questions sur la violence
    {
        id: 'violence_1',
        text: 'As-tu déjà frappé quelqu\'un par colère ?',
        theme: 'violence',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'violence_2',
        text: 'As-tu déjà cassé quelque chose en étant en colère ?',
        theme: 'violence',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'violence_3',
        text: 'As-tu déjà participé à une bagarre ?',
        theme: 'violence',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'violence_4',
        text: 'As-tu déjà menacé quelqu\'un physiquement ?',
        theme: 'violence',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'violence_5',
        text: 'As-tu déjà fait du mal à un animal ?',
        theme: 'violence',
        points: { yes: 1, no: 0 }
    },

    // Questions diverses
    {
        id: 'other_1',
        text: 'As-tu déjà séché les cours ou le travail ?',
        theme: 'other',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'other_2',
        text: 'As-tu déjà conduit sans permis ?',
        theme: 'other',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'other_3',
        text: 'As-tu déjà utilisé un faux nom ou âge ?',
        theme: 'other',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'other_4',
        text: 'As-tu déjà espionné quelqu\'un ?',
        theme: 'other',
        points: { yes: 1, no: 0 }
    },
    {
        id: 'other_5',
        text: 'As-tu déjà fouillé dans les affaires de quelqu\'un sans permission ?',
        theme: 'other',
        points: { yes: 1, no: 0 }
    }
];

export const THEME_LABELS: Record<Theme, string> = {
    sex: 'Sexualité',
    drugs: 'Substances',
    morality: 'Moralité',
    hygiene: 'Hygiène',
    violence: 'Violence',
    other: 'Divers'
};

export const THEME_COLORS: Record<Theme, string> = {
    sex: '#FF6B9D',
    drugs: '#4ECDC4',
    morality: '#45B7D1',
    hygiene: '#96CEB4',
    violence: '#FFEAA7',
    other: '#DDA0DD'
}; 