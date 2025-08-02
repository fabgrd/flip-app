import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp, StackActions } from '@react-navigation/native';

import { useGame } from '../contexts/GameContext';
import { GameEndScreen, MinimalTopBar, VerticalGameBoard, TurnIndicatorPopup, CardSelectionModal, GameRules } from '../components/game';
import { RootStackParamList, GameCard } from '../types';
import { GlobalStyles } from '../constants';

type TakeSixGameScreenRouteProp = RouteProp<RootStackParamList, 'TakeSixGame'>;

export function ImmersiveGameScreen() {
    const route = useRoute<TakeSixGameScreenRouteProp>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { state, actions } = useGame();

    const [activePlayerIndex, setActivePlayerIndex] = useState(0);
    const [showRules, setShowRules] = useState(false);
    const [showTurnPopup, setShowTurnPopup] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);

    useEffect(() => {
        if (route.params?.players && state.phase === 'setup') {
            actions.initializeGame(route.params.players);
        }
    }, [route.params?.players]);

    useEffect(() => {
        if (state.phase === 'selection' && !state.players[activePlayerIndex]?.selectedCard) {
            setShowTurnPopup(true);
            const timer = setTimeout(() => {
                setShowTurnPopup(false);
                setShowCardModal(true);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [state.phase, activePlayerIndex, state.players]);

    // CORRECTION : Gère les transitions automatiques entre les phases
    useEffect(() => {
        console.log('PHASE CHANGED TO:', state.phase);

        if (state.phase === 'reveal') {
            // Tous les joueurs ont sélectionné, on révèle les cartes
            console.log('TRIGGERING REVEAL_CARDS');
            setTimeout(() => {
                actions.nextPhase();
            }, 500);
        } else if (state.phase === 'placement') {
            // Les cartes sont révélées, on traite le placement
            console.log('TRIGGERING PROCESS_PLACEMENT');
            setTimeout(() => {
                actions.nextPhase();
            }, 1000);
        } else if (state.phase === 'selection' && state.players.length > 0 && state.players.every(p => p.selectedCard === null)) {
            // Nouveau tour, on remet l'index du joueur actif à 0
            setActivePlayerIndex(0);
        }
    }, [state.phase]);

    const handleCardSelect = (card: GameCard) => {
        const currentPlayer = state.players[activePlayerIndex];
        if (currentPlayer) {
            actions.selectCard(currentPlayer.id, card);
            setShowCardModal(false);

            if (activePlayerIndex < state.players.length - 1) {
                setActivePlayerIndex(activePlayerIndex + 1);
            }
        }
    };

    const handleGoHome = () => {
        actions.resetGame();
        navigation.dispatch(StackActions.popToTop());
    };

    if (state.gameEnded && state.winner) {
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <GameEndScreen
                    players={state.players}
                    winner={state.winner}
                    onPlayAgain={actions.resetGame}
                    onGoHome={handleGoHome}
                />
            </SafeAreaView>
        );
    }

    const currentPlayer = state.players[activePlayerIndex];

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <MinimalTopBar
                currentTurn={state.turn}
                maxTurns={state.maxTurns}
                onGoBack={handleGoHome}
                onShowRules={() => setShowRules(true)}
            />
            <View style={styles.container}>
                <VerticalGameBoard gameState={state} onLineSelect={actions.selectLine} />
            </View>
            {currentPlayer && (
                <>
                    <TurnIndicatorPopup
                        playerName={currentPlayer.name}
                        visible={showTurnPopup}
                    />
                    <CardSelectionModal
                        player={currentPlayer}
                        visible={showCardModal}
                        onCardSelect={handleCardSelect}
                    />
                </>
            )}
            <GameRules visible={showRules} onClose={() => setShowRules(false)} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
}); 