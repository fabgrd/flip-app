import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Player } from '../../../types';
import { shuffleArray } from '../../../utils/array';
import { POLITICAL_QUESTION_CONFIG } from '../constants';
import {
  PlayerPoliticalAnswer,
  PoliticalGameState,
  PoliticalOrientation,
  PoliticalResults,
} from '../types';

export const useLeftRight = (initialPlayers: Player[]) => {
  const { t } = useTranslation();

  const [gameState, setGameState] = useState<PoliticalGameState>(() => {
    const questions = shuffleArray([...POLITICAL_QUESTION_CONFIG]).map((config) => ({
      id: config.id,
      text: t(`leftRight:questions.${config.id}`),
      points: config.points,
    }));

    return {
      players: initialPlayers.map((player) => ({
        ...player,
        answers: [],
        leftScore: 0,
        rightScore: 0,
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
    (playerId: string, answer: PoliticalOrientation) => {
      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((player) => {
          if (player.id === playerId) {
            const newAnswer: PlayerPoliticalAnswer = {
              playerId,
              questionId: currentQuestion.id,
              answer,
            };

            const updatedAnswers = [...player.answers, newAnswer];
            const points = currentQuestion.points[answer];

            const newLeftScore = player.leftScore + (answer === 'left' ? points : 0);
            const newRightScore = player.rightScore + (answer === 'right' ? points : 0);

            return {
              ...player,
              answers: updatedAnswers,
              leftScore: newLeftScore,
              rightScore: newRightScore,
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

  const calculateResults = useCallback((): PoliticalResults => {
    const playersWithResults = gameState.players
      .map((player) => {
        const totalScore = player.leftScore + player.rightScore;

        const leftPercentage =
          totalScore > 0 ? Math.round((player.leftScore / totalScore) * 100) : 50;
        const rightPercentage = 100 - leftPercentage;

        const dominantOrientation: PoliticalOrientation =
          player.leftScore > player.rightScore ? 'left' : 'right';

        return {
          player,
          leftPercentage,
          rightPercentage,
          dominantOrientation,
          rank: 0, // Will be updated after sorting
        };
      })
      .sort((a, b) => {
        // Sort by most extreme political orientation
        const aExtremeness = Math.abs(a.leftPercentage - 50);
        const bExtremeness = Math.abs(b.leftPercentage - 50);
        return bExtremeness - aExtremeness;
      })
      .map((result, index) => ({
        ...result,
        rank: index + 1,
      }));

    return { players: playersWithResults };
  }, [gameState.players]);

  const resetGame = useCallback(() => {
    const questions = shuffleArray([...POLITICAL_QUESTION_CONFIG]).map((config) => ({
      id: config.id,
      text: t(`leftRight:questions.${config.id}`),
      points: config.points,
    }));

    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => ({
        ...player,
        answers: [],
        leftScore: 0,
        rightScore: 0,
      })),
      currentQuestionIndex: 0,
      questions,
      isGameFinished: false,
    }));
  }, []);

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
