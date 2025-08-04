import { useState, useCallback, useMemo } from 'react';
import { Player } from '../../../types';
import { PurityPlayer, PlayerAnswer, Question, Theme, PurityGameState, PurityResults } from '../types';
import { useTranslation } from 'react-i18next';

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateGameQuestions(t: any): Question[] {
    const themes: Theme[] = ['sex', 'drugs', 'morality', 'hygiene'];
    const allQuestions: Question[] = [];

    const fallbackQuestions: Record<Theme, Question[]> = {
        sex: [
            { id: 'sex_fallback_1', text: 'As-tu déjà eu des relations sexuelles ?', theme: 'sex', points: { yes: 2, no: 0 } },
            { id: 'sex_fallback_2', text: 'As-tu déjà embrassé quelqu\'un ?', theme: 'sex', points: { yes: 1, no: 0 } },
            { id: 'sex_fallback_3', text: 'As-tu déjà eu un coup d\'un soir ?', theme: 'sex', points: { yes: 3, no: 0 } },
            { id: 'sex_fallback_4', text: 'As-tu déjà simulé l\'orgasme ?', theme: 'sex', points: { yes: 2, no: 0 } },
            { id: 'sex_fallback_5', text: 'Vous êtes-vous déjà masturbé ?', theme: 'sex', points: { yes: 1, no: 0 } }
        ],
        drugs: [
            { id: 'drugs_fallback_1', text: 'As-tu déjà bu de l\'alcool ?', theme: 'drugs', points: { yes: 1, no: 0 } },
            { id: 'drugs_fallback_2', text: 'As-tu déjà été ivre ?', theme: 'drugs', points: { yes: 2, no: 0 } },
            { id: 'drugs_fallback_3', text: 'As-tu déjà fumé un joint ?', theme: 'drugs', points: { yes: 2, no: 0 } },
            { id: 'drugs_fallback_4', text: 'As-tu déjà vomi à cause de l\'alcool ?', theme: 'drugs', points: { yes: 3, no: 0 } },
            { id: 'drugs_fallback_5', text: 'Bu avant l\'âge légal ?', theme: 'drugs', points: { yes: 1, no: 0 } }
        ],
        morality: [
            { id: 'morality_fallback_1', text: 'As-tu déjà menti pour éviter un problème ?', theme: 'morality', points: { yes: 1, no: 0 } },
            { id: 'morality_fallback_2', text: 'As-tu déjà volé quelque chose ?', theme: 'morality', points: { yes: 3, no: 0 } },
            { id: 'morality_fallback_3', text: 'As-tu déjà triché à un examen ?', theme: 'morality', points: { yes: 2, no: 0 } },
            { id: 'morality_fallback_4', text: 'As-tu déjà fait pleurer quelqu\'un volontairement ?', theme: 'morality', points: { yes: 4, no: 0 } },
            { id: 'morality_fallback_5', text: 'As-tu déjà ignoré un SDF ?', theme: 'morality', points: { yes: 1, no: 0 } }
        ],
        hygiene: [
            { id: 'hygiene_fallback_1', text: 'As-tu déjà oublié de te brosser les dents avant de dormir ?', theme: 'hygiene', points: { yes: 1, no: 0 } },
            { id: 'hygiene_fallback_2', text: 'As-tu déjà porté le même sous-vêtement plusieurs jours ?', theme: 'hygiene', points: { yes: 2, no: 0 } },
            { id: 'hygiene_fallback_3', text: 'As-tu déjà mangé quelque chose tombé par terre ?', theme: 'hygiene', points: { yes: 2, no: 0 } },
            { id: 'hygiene_fallback_4', text: 'As-tu déjà senti un vêtement pour savoir s\'il était propre ?', theme: 'hygiene', points: { yes: 1, no: 0 } },
            { id: 'hygiene_fallback_5', text: 'As-tu déjà pété dans ton lit sous la couette ?', theme: 'hygiene', points: { yes: 1, no: 0 } }
        ],
    };

    themes.forEach(theme => {
        const themeQuestions: Question[] = [];

        // Récupérer toutes les questions pour ce thème depuis i18n
        const levels = ['level1', 'level2', 'level3', 'level4', 'level5'];
        if (theme === 'morality') {
            levels.push('levelBonus'); // Ajouter les questions bonus pour la moralité
        }

        levels.forEach(level => {
            try {
                const questionsData = t(`purityTest:questions.${theme}.${level}`, { returnObjects: true });

                if (Array.isArray(questionsData)) {
                    questionsData.forEach((questionData: any) => {
                        themeQuestions.push({
                            id: questionData.id,
                            text: questionData.text,
                            theme: theme,
                            points: { yes: questionData.points, no: 0 }
                        });
                    });
                }
            } catch (error) {
                console.warn(`Could not load questions for ${theme}.${level}`);
            }
        });

        // Si pas de questions trouvées via i18n, utiliser les questions de fallback
        if (themeQuestions.length === 0 && fallbackQuestions[theme].length > 0) {
            themeQuestions.push(...fallbackQuestions[theme]);
        }

        // Mélanger les questions de ce thème et prendre 5
        const shuffledThemeQuestions = shuffleArray(themeQuestions);
        const selectedQuestions = shuffledThemeQuestions.slice(0, 5);

        allQuestions.push(...selectedQuestions);
    });

    // Mélanger toutes les questions pour un ordre aléatoire
    return shuffleArray(allQuestions);
}

export const usePurityTest = (initialPlayers: Player[]) => {
    const { t } = useTranslation();

    const [gameState, setGameState] = useState<PurityGameState>(() => {
        const questions = generateGameQuestions(t);

        return {
            players: initialPlayers.map(player => ({
                ...player,
                answers: [],
                score: 0,
                themeScores: {
                    sex: { score: 0, maxScore: 0 },
                    drugs: { score: 0, maxScore: 0 },
                    morality: { score: 0, maxScore: 0 },
                    hygiene: { score: 0, maxScore: 0 },
                }
            })),
            currentQuestionIndex: 0,
            questions: questions,
            isGameFinished: false
        };
    });

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

                    // Mettre à jour les scores par thème avec les vrais points de la question
                    const newThemeScores = { ...player.themeScores };
                    const theme = currentQuestion.theme;
                    const maxPointsForQuestion = Math.max(currentQuestion.points.yes, currentQuestion.points.no);

                    newThemeScores[theme] = {
                        score: newThemeScores[theme].score + points,
                        maxScore: newThemeScores[theme].maxScore + maxPointsForQuestion
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
        // Calculer le score maximum possible basé sur les questions jouées
        const maxPossibleScore = gameState.questions.reduce((total, question) => {
            return total + Math.max(question.points.yes, question.points.no);
        }, 0);

        const playersWithResults = gameState.players.map((player, index) => {
            const totalScore = player.score;

            // Calculer le pourcentage d'impureté basé sur les vrais points
            const impurityPercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

            // Déterminer le niveau d'impureté
            let impurityLevel: string;
            if (impurityPercentage <= 10) impurityLevel = 'saint';
            else if (impurityPercentage <= 25) impurityLevel = 'pure';
            else if (impurityPercentage <= 45) impurityLevel = 'mostlyPure';
            else if (impurityPercentage <= 65) impurityLevel = 'mixed';
            else if (impurityPercentage <= 80) impurityLevel = 'naughty';
            else if (impurityPercentage <= 95) impurityLevel = 'veryImpure';
            else impurityLevel = 'diabolical';

            // Calculer les pourcentages par thème
            const themePercentages: Record<Theme, number> = {} as Record<Theme, number>;
            Object.keys(player.themeScores).forEach(theme => {
                const themeKey = theme as Theme;
                const themeData = player.themeScores[themeKey];
                themePercentages[themeKey] = themeData.maxScore > 0
                    ? Math.round((themeData.score / themeData.maxScore) * 100)
                    : 0;
            });

            return {
                player: {
                    ...player,
                    impurityLevel
                },
                impurityPercentage,
                rank: 0, // Sera mis à jour après le tri
                themePercentages
            };
        }).sort((a, b) => b.impurityPercentage - a.impurityPercentage)
            .map((result, index) => ({
                ...result,
                rank: index + 1
            }));

        return { players: playersWithResults };
    }, [gameState.players, gameState.questions]);

    const resetGame = useCallback(() => {
        const questions = generateGameQuestions(t);

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
                }
            })),
            currentQuestionIndex: 0,
            questions: questions,
            isGameFinished: false
        }));
    }, [t]);

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