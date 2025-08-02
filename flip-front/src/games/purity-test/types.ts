export type Theme = 'sex' | 'drugs' | 'morality' | 'hygiene' | 'violence' | 'other';

export type Question = {
    id: string;
    text: string;
    theme: Theme;
    points: { yes: number; no: number };
};

export type PlayerAnswer = {
    playerId: string;
    questionId: string;
    answer: 'yes' | 'no';
};

export type PurityPlayer = {
    id: string;
    name: string;
    avatar?: string;
    answers: PlayerAnswer[];
    score: number;
    themeScores: Record<Theme, { score: number; maxScore: number }>;
};

export type PurityGameState = {
    players: PurityPlayer[];
    currentQuestionIndex: number;
    questions: Question[];
    isGameFinished: boolean;
};

export type PurityResults = {
    players: Array<{
        player: PurityPlayer;
        impurityPercentage: number;
        rank: number;
        themePercentages: Record<Theme, number>;
    }>;
}; 