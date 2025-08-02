import { useState, useCallback, useMemo } from 'react';
import { Player } from '../../../types';
import { PurityPlayer, PlayerAnswer, Question, Theme, PurityGameState, PurityResults } from '../types';
import { PURITY_QUESTIONS } from '../constants';

export const usePurityTest = (initialPlayers: Player[]) => {
    const [gameState, setGameState] = useState<PurityGameState>(() => ({
        players: initialPlayers.map(player => ({
            ...player,
            answers: [],
            score: 0,
            themeScores: {
                sex: { score: 0, maxScore: 0 },
                drugs: { score: 0, maxScore: 0 },
                morality: { score: 0, maxScore: 0 },
                hygiene: { score: 0, maxScore: 0 },
                violence: { score: 0, maxScore: 0 },
                other: { score: 0, maxScore: 0 }
            }
        })),
        currentQuestionIndex: 0,
        questions: PURITY_QUESTIONS,
        isGameFinished: false
    }));

    const currentQuestion = useMemo(() =>
        gameState.questions[gameState.currentQuestionIndex],
        [gameState.questions, gameState.currentQuestionIndex]
    );

    const progress = useMemo(() =>
        (gameState.currentQuestionIndex / gameState.questions.length) * 100,
        [gameState.currentQuestionIndex, gameState.questions.length]
    );

    const submitAnswer = useCallback((playerId: string, answer: 'yes' | 'no') => {
        setGameState(prev => ({
            ...prev,
            players: prev.players.map(player => {
                if (player.id === playerId) {
                    const newAnswer: PlayerAnswer = {
                        playerId,
                        questionId: currentQuestion.id,
                        answer
                    };

                    const updatedAnswers = [...player.answers, newAnswer];
                    const points = currentQuestion.points[answer];
                    const newScore = player.score + points;

                    // Mettre à jour les scores par thème
                    const newThemeScores = { ...player.themeScores };
                    const theme = currentQuestion.theme;
                    newThemeScores[theme] = {
                        score: newThemeScores[theme].score + points,
                        maxScore: newThemeScores[theme].maxScore + 1
                    };

                    return {
                        ...player,
                        answers: updatedAnswers,
                        score: newScore,
                        themeScores: newThemeScores
                    };
                }
                return player;
            })
        }));
    }, [currentQuestion]);

    const nextQuestion = useCallback(() => {
        setGameState(prev => {
            const nextIndex = prev.currentQuestionIndex + 1;
            const isFinished = nextIndex >= prev.questions.length;

            return {
                ...prev,
                currentQuestionIndex: nextIndex,
                isGameFinished: isFinished
            };
        });
    }, []);

    const canProceedToNextQuestion = useMemo(() => {
        return gameState.players.every(player =>
            player.answers.some(answer => answer.questionId === currentQuestion?.id)
        );
    }, [gameState.players, currentQuestion]);

    const calculateResults = useCallback((): PurityResults => {
        const playersWithResults = gameState.players.map(player => {
            const maxPossibleScore = gameState.questions.length;
            // Logique d'impureté : plus le score est haut, plus on est impur
            const impurityPercentage = Math.round((player.score / maxPossibleScore) * 100);

            const themePercentages: Record<Theme, number> = {} as Record<Theme, number>;
            Object.keys(player.themeScores).forEach(theme => {
                const themeKey = theme as Theme;
                const themeData = player.themeScores[themeKey];
                themePercentages[themeKey] = themeData.maxScore > 0
                    ? Math.round((themeData.score / themeData.maxScore) * 100)
                    : 0;
            });

            return {
                player,
                impurityPercentage,
                rank: 0, // Sera calculé après
                themePercentages
            };
        });

        // Calculer les rangs : plus d'impureté = meilleur rang
        playersWithResults.sort((a, b) => b.impurityPercentage - a.impurityPercentage);
        playersWithResults.forEach((result, index) => {
            result.rank = index + 1;
        });

        return { players: playersWithResults };
    }, [gameState.players, gameState.questions.length]);

    const resetGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            players: prev.players.map(player => ({
                ...player,
                answers: [],
                score: 0,
                themeScores: {
                    sex: { score: 0, maxScore: 0 },
                    drugs: { score: 0, maxScore: 0 },
                    morality: { score: 0, maxScore: 0 },
                    hygiene: { score: 0, maxScore: 0 },
                    violence: { score: 0, maxScore: 0 },
                    other: { score: 0, maxScore: 0 }
                }
            })),
            currentQuestionIndex: 0,
            isGameFinished: false
        }));
    }, []);

    const getPlayerAnswer = useCallback((playerId: string, questionId?: string) => {
        const qId = questionId || currentQuestion?.id;
        if (!qId) return null;

        const player = gameState.players.find(p => p.id === playerId);
        return player?.answers.find(answer => answer.questionId === qId) || null;
    }, [gameState.players, currentQuestion]);

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
        totalQuestions: gameState.questions.length
    };
}; 