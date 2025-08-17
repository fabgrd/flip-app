import { TFunction } from 'i18next';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Player } from '../../../types';
import { PlayerAnswer, PurityGameState, PurityResults, Question, Theme } from '../types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateGameQuestions(t: TFunction): Question[] {
  const themeQuestionCounts: Record<Theme, number> = {
    sex: 7,
    drugs: 8,
    morality: 3,
    hygiene: 2,
  };

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

  const allQuestions: Question[] = [];

  (Object.keys(themeQuestionCounts) as Theme[]).forEach((theme) => {
    const requiredCount = themeQuestionCounts[theme];
    const themeQuestions: Question[] = [];

    const levels = ['level1', 'level2', 'level3', 'level4', 'level5'];
    if (theme === 'morality') levels.push('levelBonus');

    levels.forEach((level) => {
      try {
        const questionsData = t(`purityTest:questions.${theme}.${level}`, { returnObjects: true });
        if (Array.isArray(questionsData)) {
          questionsData.forEach((questionData: Question) => {
            themeQuestions.push({
              id: questionData.id,
              text: questionData.text,
              theme,
              points: { yes: questionData.points.yes, no: questionData.points.no },
            });
          });
        }
      } catch (error) {
        console.warn(`Could not load questions for ${theme}.${level}`);
      }
    });

    // Utiliser les fallback si pas assez de questions
    if (themeQuestions.length < requiredCount) {
      const needed = requiredCount - themeQuestions.length;
      themeQuestions.push(...fallbackQuestions[theme].slice(0, needed));
    }

    const shuffled = shuffleArray(themeQuestions);
    allQuestions.push(...shuffled.slice(0, requiredCount));
  });

  return shuffleArray(allQuestions);
}

export const usePurityTest = (initialPlayers: Player[]) => {
  const { t } = useTranslation();

  const [gameState, setGameState] = useState<PurityGameState>(() => {
    const questions = generateGameQuestions(t);

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
    };
  });

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

            // Mettre à jour les scores par thème avec les vrais points de la question
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
    // Calculer le score maximum possible basé sur les questions jouées
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

        // Calculer les pourcentages par thème
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
          rank: 0, // Sera mis à jour après le tri
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

  const resetGame = useCallback(() => {
    const questions = generateGameQuestions(t);

    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => ({
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
    }));
  }, [t]);

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
