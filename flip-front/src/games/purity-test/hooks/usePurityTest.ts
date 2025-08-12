import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Player } from '../../../types';
import { PlayerAnswer, Question, Theme, PurityGameState, PurityResults } from '../types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateGameQuestions(t: any): Question[] {
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
        text: 'eu des relations sexuelles ?',
        theme: 'sex',
        points: { yes: 2, no: 0 },
      },
      {
        id: 'sex_fallback_2',
        text: "embrassé quelqu'un ?",
        theme: 'sex',
        points: { yes: 1, no: 0 },
      },
      {
        id: 'sex_fallback_3',
        text: "eu un coup d'un soir ?",
        theme: 'sex',
        points: { yes: 3, no: 0 },
      },
      { id: 'sex_fallback_4', text: "simulé l'orgasme ?", theme: 'sex', points: { yes: 2, no: 0 } },
      {
        id: 'sex_fallback_5',
        text: 'Vous êtes-vous déjà masturbé ?',
        theme: 'sex',
        points: { yes: 1, no: 0 },
      },
    ],
    drugs: [
      {
        id: 'drugs_fallback_1',
        text: "bu de l'alcool ?",
        theme: 'drugs',
        points: { yes: 1, no: 0 },
      },
      { id: 'drugs_fallback_2', text: 'été ivre ?', theme: 'drugs', points: { yes: 2, no: 0 } },
      {
        id: 'drugs_fallback_3',
        text: 'fumé un joint ?',
        theme: 'drugs',
        points: { yes: 2, no: 0 },
      },
      {
        id: 'drugs_fallback_4',
        text: "vomi à cause de l'alcool ?",
        theme: 'drugs',
        points: { yes: 3, no: 0 },
      },
      {
        id: 'drugs_fallback_5',
        text: "Bu avant l'âge légal ?",
        theme: 'drugs',
        points: { yes: 1, no: 0 },
      },
    ],
    morality: [
      {
        id: 'morality_fallback_1',
        text: 'menti pour éviter un problème ?',
        theme: 'morality',
        points: { yes: 1, no: 0 },
      },
      {
        id: 'morality_fallback_2',
        text: 'volé quelque chose ?',
        theme: 'morality',
        points: { yes: 3, no: 0 },
      },
      {
        id: 'morality_fallback_3',
        text: 'triché à un examen ?',
        theme: 'morality',
        points: { yes: 2, no: 0 },
      },
      {
        id: 'morality_fallback_4',
        text: "fait pleurer quelqu'un volontairement ?",
        theme: 'morality',
        points: { yes: 4, no: 0 },
      },
      {
        id: 'morality_fallback_5',
        text: 'ignoré un SDF ?',
        theme: 'morality',
        points: { yes: 1, no: 0 },
      },
    ],
    hygiene: [
      {
        id: 'hygiene_fallback_1',
        text: 'oublié de te brosser les dents avant de dormir ?',
        theme: 'hygiene',
        points: { yes: 1, no: 0 },
      },
      {
        id: 'hygiene_fallback_2',
        text: 'porté le même sous-vêtement plusieurs jours ?',
        theme: 'hygiene',
        points: { yes: 2, no: 0 },
      },
      {
        id: 'hygiene_fallback_3',
        text: 'mangé quelque chose tombé par terre ?',
        theme: 'hygiene',
        points: { yes: 2, no: 0 },
      },
      {
        id: 'hygiene_fallback_4',
        text: "senti un vêtement pour savoir s'il était propre ?",
        theme: 'hygiene',
        points: { yes: 1, no: 0 },
      },
      {
        id: 'hygiene_fallback_5',
        text: 'pété dans ton lit sous la couette ?',
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
          questionsData.forEach((questionData: any) => {
            themeQuestions.push({
              id: questionData.id,
              text: questionData.text,
              theme,
              points: { yes: questionData.points, no: 0 },
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
      .map((player, index) => {
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

    return { players: playersWithResults };
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
