import { TFunction } from 'i18next';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Player } from '../../../types';
import {
  LevelKey,
  PlayerAnswer,
  PurityGameState,
  PurityQuestionConfig,
  PurityResults,
  Question,
  Theme,
} from '../types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const DEFAULT_TOTAL_QUESTIONS = 20;
const DEFAULT_THEME_COUNTS: Record<Theme, number> = {
  sex: 5,
  drugs: 5,
  morality: 5,
  hygiene: 5,
};
const DEFAULT_LEVEL_COUNTS: Record<LevelKey, number> = {
  level1: 5,
  level2: 5,
  level3: 5,
  level4: 5,
  level5: 5,
  levelBonus: 0,
};

function normalizeWeights<T extends string>(weights: Record<T, number>, keys: T[]): Record<T, number> {
  const total = keys.reduce((sum, key) => sum + Math.max(0, weights[key] ?? 0), 0);
  if (total <= 0) {
    const equal = Math.round(100 / keys.length);
    return keys.reduce((acc, key) => ({ ...acc, [key]: equal }), {} as Record<T, number>);
  }
  return keys.reduce(
    (acc, key) => ({ ...acc, [key]: Math.max(0, weights[key] ?? 0) }),
    {} as Record<T, number>,
  );
}

function allocateCounts<T extends string>(weights: Record<T, number>, keys: T[], total: number) {
  if (total <= 0 || keys.length === 0)
    return keys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {} as Record<T, number>);
  const normalized = normalizeWeights(weights, keys);
  const weightSum = keys.reduce((sum, key) => sum + normalized[key], 0);
  const raw = keys.map((key) => ({
    key,
    value: (normalized[key] / weightSum) * total,
  }));
  const base = raw.map((entry) => ({ ...entry, count: Math.floor(entry.value) }));
  let remaining = total - base.reduce((sum, entry) => sum + entry.count, 0);
  base.sort((a, b) => b.value - a.value);
  let idx = 0;
  while (remaining > 0 && base.length > 0) {
    base[idx % base.length].count += 1;
    remaining -= 1;
    idx += 1;
  }
  return base.reduce((acc, entry) => ({ ...acc, [entry.key]: entry.count }), {} as Record<T, number>);
}

function generateGameQuestions(t: TFunction, config?: PurityQuestionConfig): Question[] {
  const themeCounts = config?.themeCounts ?? DEFAULT_THEME_COUNTS;
  const levelCounts = config?.levelCounts ?? DEFAULT_LEVEL_COUNTS;
  const computedTotal = Object.values(themeCounts).reduce((sum, val) => sum + Math.max(0, val), 0);
  const totalQuestions = config?.totalQuestions ?? (computedTotal > 0 ? computedTotal : DEFAULT_TOTAL_QUESTIONS);

  const fallbackQuestions: Record<Theme, Question[]> = {
    sex: [
      {
        id: 'sex_fallback_1',
        text: 'have sex with someone ?',
        theme: 'sex',
        points: { yes: 2, no: 0 },
      },
      {
        id: 'sex_fallback_2',
        text: 'kissed someone ?',
        theme: 'sex',
        points: { yes: 1, no: 0 },
      },
      {
        id: 'sex_fallback_3',
        text: 'had sex with someone once ?',
        theme: 'sex',
        points: { yes: 3, no: 0 },
      },
      { id: 'sex_fallback_4', text: 'faked an orgasm ?', theme: 'sex', points: { yes: 2, no: 0 } },
      {
        id: 'sex_fallback_5',
        text: 'have you ever masturbated ?',
        theme: 'sex',
        points: { yes: 1, no: 0 },
      },
    ],
    drugs: [
      {
        id: 'drugs_fallback_1',
        text: 'drunk ?',
        theme: 'drugs',
        points: { yes: 1, no: 0 },
      },
      { id: 'drugs_fallback_2', text: 'drunk ?', theme: 'drugs', points: { yes: 2, no: 0 } },
      {
        id: 'drugs_fallback_3',
        text: 'smoked a joint ?',
        theme: 'drugs',
        points: { yes: 2, no: 0 },
      },
      {
        id: 'drugs_fallback_4',
        text: 'vomited because of alcohol ?',
        theme: 'drugs',
        points: { yes: 3, no: 0 },
      },
      {
        id: 'drugs_fallback_5',
        text: 'used drugs before the legal age ?',
        theme: 'drugs',
        points: { yes: 1, no: 0 },
      },
    ],
    morality: [
      {
        id: 'morality_fallback_1',
        text: 'lied to avoid a problem ?',
        theme: 'morality',
        points: { yes: 1, no: 0 },
      },
      {
        id: 'morality_fallback_2',
        text: 'stole something ?',
        theme: 'morality',
        points: { yes: 3, no: 0 },
      },
      {
        id: 'morality_fallback_3',
        text: 'cheated on an exam ?',
        theme: 'morality',
        points: { yes: 2, no: 0 },
      },
      {
        id: 'morality_fallback_4',
        text: 'made someone cry on purpose ?',
        theme: 'morality',
        points: { yes: 4, no: 0 },
      },
      {
        id: 'morality_fallback_5',
        text: 'ignored a homeless person ?',
        theme: 'morality',
        points: { yes: 1, no: 0 },
      },
    ],
    hygiene: [
      {
        id: 'hygiene_fallback_1',
        text: 'forgot to brush your teeth before sleeping ?',
        theme: 'hygiene',
        points: { yes: 1, no: 0 },
      },
      {
        id: 'hygiene_fallback_2',
        text: 'wore the same underwear for several days ?',
        theme: 'hygiene',
        points: { yes: 2, no: 0 },
      },
      {
        id: 'hygiene_fallback_3',
        text: 'ate something that fell on the ground ?',
        theme: 'hygiene',
        points: { yes: 2, no: 0 },
      },
      {
        id: 'hygiene_fallback_4',
        text: 'felt a shirt to know if it was clean ?',
        theme: 'hygiene',
        points: { yes: 1, no: 0 },
      },
      {
        id: 'hygiene_fallback_5',
        text: 'peed in your bed under the blanket ?',
        theme: 'hygiene',
        points: { yes: 1, no: 0 },
      },
    ],
  };

  const normalizedThemeCounts = allocateCounts(
    themeCounts,
    Object.keys(DEFAULT_THEME_COUNTS) as Theme[],
    totalQuestions,
  );

  const allQuestions: Question[] = [];

  (Object.keys(normalizedThemeCounts) as Theme[]).forEach((theme) => {
    const requiredCount = normalizedThemeCounts[theme];
    if (requiredCount <= 0) return;

    const levelBuckets: Record<LevelKey, Question[]> = {
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
      levelBonus: [],
    };

    const levels: LevelKey[] = ['level1', 'level2', 'level3', 'level4', 'level5'];
    if (theme === 'morality') levels.push('levelBonus');

    levels.forEach((level) => {
      try {
        const questionsData = t(`purityTest:questions.${theme}.${level}`, { returnObjects: true });
        if (Array.isArray(questionsData)) {
          questionsData.forEach((questionData: { id: string; text: string; points: number | { yes: number; no: number } }) => {
            const rawPoints = questionData.points;
            const points: { yes: number; no: number } =
              typeof rawPoints === 'number'
                ? { yes: rawPoints, no: 0 }
                : rawPoints;
            levelBuckets[level].push({
              id: questionData.id,
              text: questionData.text,
              theme,
              points,
            });
          });
        }
      } catch (error) {
        console.warn(`Could not load questions for ${theme}.${level}`);
      }
    });

    const availableLevels = levels.filter((level) => levelBuckets[level].length > 0);
    const perThemeLevelCounts = allocateCounts(levelCounts, availableLevels, requiredCount);
    const picked: Question[] = [];
    const remainingPool: Question[] = [];

    availableLevels.forEach((level) => {
      const pool = shuffleArray(levelBuckets[level]);
      const take = Math.min(perThemeLevelCounts[level] ?? 0, pool.length);
      picked.push(...pool.slice(0, take));
      remainingPool.push(...pool.slice(take));
    });

    remainingPool.push(...fallbackQuestions[theme].map((q) => ({ ...q })));

    if (picked.length < requiredCount) {
      const deficit = requiredCount - picked.length;
      const fillers = shuffleArray(remainingPool).slice(0, deficit);
      picked.push(...fillers);
    }

    allQuestions.push(...picked.slice(0, requiredCount));
  });

  return shuffleArray(allQuestions);
}

function buildInitialState(t: TFunction, initialPlayers: Player[], config?: PurityQuestionConfig) {
  const questions = generateGameQuestions(t, config);

  return {
    players: initialPlayers.map((player) => ({
      ...player,
      answers: [],
      score: 0,
      themeScores: {
        sex: { score: 0, maxScore: 0 },
        drugs: { score: 0, maxScore: 0 },
        morality: { score: 0, maxScore: 0 },
        hygiene: { score: 0, maxScore: 0 },
      },
    })),
    currentQuestionIndex: 0,
    questions,
    isGameFinished: false,
  } as PurityGameState;
}

export const usePurityTest = (initialPlayers: Player[], config?: PurityQuestionConfig) => {
  const { t } = useTranslation();

  const [gameState, setGameState] = useState<PurityGameState>(() =>
    buildInitialState(t, initialPlayers, config),
  );

  const currentQuestion = useMemo(
    () => gameState.questions[gameState.currentQuestionIndex],
    [gameState.questions, gameState.currentQuestionIndex],
  );

  const progress = useMemo(
    () => (gameState.currentQuestionIndex / gameState.questions.length) * 100,
    [gameState.currentQuestionIndex, gameState.questions.length],
  );

  const submitAnswer = useCallback(
    (playerId: string, answer: 'yes' | 'no') => {
      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((player) => {
          if (player.id === playerId) {
            const newAnswer: PlayerAnswer = {
              playerId,
              questionId: currentQuestion.id,
              answer,
            };

            const updatedAnswers = [...player.answers, newAnswer];
            const points = currentQuestion.points[answer];
            const newScore = player.score + points;

            const newThemeScores = { ...player.themeScores };
            const { theme } = currentQuestion;
            const maxPointsForQuestion = Math.max(
              currentQuestion.points.yes,
              currentQuestion.points.no,
            );

            newThemeScores[theme] = {
              score: newThemeScores[theme].score + points,
              maxScore: newThemeScores[theme].maxScore + maxPointsForQuestion,
            };

            return {
              ...player,
              answers: updatedAnswers,
              score: newScore,
              themeScores: newThemeScores,
            };
          }
          return player;
        }),
      }));
    },
    [currentQuestion],
  );

  const nextQuestion = useCallback(() => {
    setGameState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;
      const isFinished = nextIndex >= prev.questions.length;

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        isGameFinished: isFinished,
      };
    });
  }, []);

  const canProceedToNextQuestion = useMemo(() => {
    return gameState.players.every((player) =>
      player.answers.some((answer) => answer.questionId === currentQuestion?.id),
    );
  }, [gameState.players, currentQuestion]);

  const calculateResults = useCallback((): PurityResults => {
    const maxPossibleScore = gameState.questions.reduce((total, question) => {
      return total + Math.max(question.points.yes, question.points.no);
    }, 0);

    const playersWithResults = gameState.players
      .map((player) => {
        const totalScore = player.score;

        const impurityPercentage =
          maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

        let impurityLevel: string;
        if (impurityPercentage <= 25) impurityLevel = 'saint';
        else if (impurityPercentage <= 35) impurityLevel = 'pure';
        else if (impurityPercentage <= 45) impurityLevel = 'mostlyPure';
        else if (impurityPercentage <= 55) impurityLevel = 'mixed';
        else if (impurityPercentage <= 65) impurityLevel = 'naughty';
        else if (impurityPercentage <= 75) impurityLevel = 'veryImpure';
        else if (impurityPercentage <= 85) impurityLevel = 'diabolical';
        else impurityLevel = 'beyondEvil';

        const themePercentages: Record<Theme, number> = {} as Record<Theme, number>;
        Object.keys(player.themeScores).forEach((theme) => {
          const themeKey = theme as Theme;
          const themeData = player.themeScores[themeKey];
          themePercentages[themeKey] =
            themeData.maxScore > 0 ? Math.round((themeData.score / themeData.maxScore) * 100) : 0;
        });

        return {
          player: {
            ...player,
            impurityLevel,
          },
          impurityPercentage,
          rank: 0,
          themePercentages,
        };
      })
      .sort((a, b) => b.impurityPercentage - a.impurityPercentage)
      .map((result, index) => ({
        ...result,
        rank: index + 1,
      }));

    return { players: playersWithResults as unknown as PurityResults['players'] };
  }, [gameState.players, gameState.questions]);

  const resetGame = useCallback(
    (nextConfig?: PurityQuestionConfig) => {
      setGameState(buildInitialState(t, initialPlayers, nextConfig));
    },
    [t, initialPlayers],
  );

  const getPlayerAnswer = useCallback(
    (playerId: string, questionId?: string) => {
      const qId = questionId || currentQuestion?.id;
      if (!qId) return null;

      const player = gameState.players.find((p) => p.id === playerId);
      return player?.answers.find((answer) => answer.questionId === qId) || null;
    },
    [gameState.players, currentQuestion],
  );

  return {
    gameState,
    currentQuestion,
    progress,
    submitAnswer,
    nextQuestion,
    canProceedToNextQuestion,
    calculateResults,
    resetGame,
    getPlayerAnswer,
    isGameFinished: gameState.isGameFinished,
    totalQuestions: gameState.questions.length,
  };
};
