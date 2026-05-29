export type PoliticalOrientation = 'left' | 'right';

export type PoliticalQuestion = {
  id: string;
  text: string;
  points: { left: number; right: number };
};

export type PlayerPoliticalAnswer = {
  playerId: string;
  questionId: string;
  answer: PoliticalOrientation;
};

export type PoliticalPlayer = {
  id: string;
  name: string;
  color: string;
  answers: PlayerPoliticalAnswer[];
  leftScore: number;
  rightScore: number;
};

export type PoliticalGameState = {
  players: PoliticalPlayer[];
  currentQuestionIndex: number;
  questions: PoliticalQuestion[];
  isGameFinished: boolean;
};

export type PoliticalResults = {
  players: Array<{
    player: PoliticalPlayer;
    leftPercentage: number;
    rightPercentage: number;
    dominantOrientation: PoliticalOrientation;
    rank: number;
  }>;
};
