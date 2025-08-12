import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, TextInput } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Colors, GlobalStyles } from '../constants';
import { Player, RootStackParamList } from '../types';
import { useCameleon } from '../games/cameleon';
import { RevealCard, SettingsPanel, PlayerGrid, MrWhiteGuessModal, ActionBar } from '../games/cameleon/components';
import { Avatar, PopModal } from '../components/common';

type CameleonRouteProp = RouteProp<RootStackParamList, 'Cameleon'>;

export function CameleonScreen() {
    const route = useRoute<CameleonRouteProp>();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { players } = route.params as { players: Player[] };

    const {
        gameState,
        defaultDistribution,
        startGame,
        resetGame,
        phase,
        currentRevealPlayer,
        revealIndex,
        revealNext,
        clueOrder,
        beginVote,
        selectedForElimination,
        selectElimination,
        confirmElimination,
        gameOver,
        winner,
        proceedAfterResults,
        mrWhiteToGuessId,
        submitMrWhiteGuess,
    } = useCameleon(players);

    const [overrideUC, setOverrideUC] = useState<number | undefined>(undefined);
    const [overrideMW, setOverrideMW] = useState<number | undefined>(undefined);

    const currentUC = overrideUC ?? defaultDistribution.undercovers;
    const currentMW = overrideMW ?? defaultDistribution.mrWhites;

    const maxImpostors = Math.floor(players.length / 2);
    const totalImpostors = currentUC + currentMW;
    const canStart = useMemo(() => totalImpostors <= maxImpostors && totalImpostors < players.length, [totalImpostors, maxImpostors, players.length]);

    const handleStart = () => {
        startGame({ overrideDistribution: { undercovers: currentUC, mrWhites: currentMW } });
    };

    // Start modal
    const [showStartModal, setShowStartModal] = useState(false);
    useEffect(() => {
        if (phase === 'clues' && clueOrder.length > 0) {
            setShowStartModal(true);
            const timer = setTimeout(() => setShowStartModal(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [phase, clueOrder]);

    // Post-elimination modal
    const [eliminationNotice, setEliminationNotice] = useState<string | null>(null);
    const [eliminatedForModal, setEliminatedForModal] = useState<{ name: string; avatar?: string } | null>(null);
    useEffect(() => {
        if (phase === 'results') {
            const eliminated = gameState.players.find(p => p.isEliminated && p.id === selectedForElimination) || null;
            if (eliminated) {
                const roleLabel = eliminated.role === 'mrWhite' ? t('cameleon:roles.mrWhite') : eliminated.role === 'cameleon' ? t('cameleon:roles.cameleon') : t('cameleon:roles.civilian');
                setEliminatedForModal({ name: eliminated.name, avatar: eliminated.avatar });
                setEliminationNotice(t('cameleon:notices.eliminatedRole', { role: roleLabel }));
                const timer = setTimeout(() => {
                    setEliminationNotice(null);
                    setEliminatedForModal(null);
                    if (!gameOver) {
                        proceedAfterResults();
                    }
                }, 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [phase, selectedForElimination, gameState.players, t, gameOver, proceedAfterResults]);

    // Auto-navigate to final results when game is over
    useEffect(() => {
        if (phase === 'results' && gameOver) {
            const timer = setTimeout(() => (navigation as any).navigate('CameleonResults', { players: gameState.players }), 800);
            return () => clearTimeout(timer);
        }
    }, [phase, gameOver, gameState.players, navigation]);

    const orderedPlayers = useMemo(() => {
        if (clueOrder.length > 0) {
            return clueOrder.map(id => gameState.players.find(p => p.id === id)!).filter(Boolean);
        }
        return gameState.players;
    }, [clueOrder, gameState.players]);

    // Alive impostors counter (combined cameleon + mrWhite)
    const aliveImpostors = useMemo(
        () => gameState.players.filter(p => !p.isEliminated && (p.role === 'cameleon' || p.role === 'mrWhite')).length,
        [gameState.players]
    );

    const renderMainGrid = () => {
        const isVote = phase === 'vote' || phase === 'results';
        return (
            <View style={{ paddingHorizontal: 12, flex: 1 }}>
                <Text style={styles.sectionTitle}>{t('cameleon:game.subtitle')}</Text>
                <Text style={styles.counterInfo}>{t('cameleon:counters.remainingImpostors', { count: aliveImpostors })}</Text>

                <FlatList
                    style={{ flex: 1 }}
                    data={orderedPlayers}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    renderItem={({ item, index }) => {
                        const inner = (
                            <>
                                <Avatar name={item.name} avatar={item.avatar} size={72} />
                                <View style={styles.statusContainer}>
                                    {item.isEliminated ? (
                                        <View style={styles.eliminatedPill}><Text style={styles.eliminatedPillText}>{t('cameleon:badges.eliminated')}</Text></View>
                                    ) : (
                                        <Text style={styles.gridOrder}>{index + 1}</Text>
                                    )}
                                </View>
                                <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
                            </>
                        );
                        if (isVote && !item.isEliminated) {
                            return (
                                <TouchableOpacity style={[styles.gridItem, selectedForElimination === item.id && styles.selectedItem]} onPress={() => selectElimination(item.id)}>
                                    {inner}
                                </TouchableOpacity>
                            );
                        }
                        return (
                            <View style={[styles.gridItem, selectedForElimination === item.id && isVote && styles.selectedItem]}>
                                {inner}
                            </View>
                        );
                    }}
                />

                {isVote ? (
                    <TouchableOpacity
                        style={[styles.primaryBtn, !selectedForElimination && styles.btnDisabled]}
                        onPress={confirmElimination}
                        disabled={!selectedForElimination}
                    >
                        <Text style={styles.primaryBtnText}>{t('cameleon:actions.eliminate')}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.secondaryBtn} onPress={beginVote}>
                        <Text style={styles.secondaryBtnText}>{t('cameleon:actions.goToVote')}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // Planned impostors count for settings screen (combined UC + MW)
    const plannedImpostors = currentUC + currentMW;

    // First player for start modal
    const firstPlayerForModal = useMemo(() => {
        if (phase !== 'clues' || clueOrder.length === 0) return null;
        const id = clueOrder[0];
        return gameState.players.find(p => p.id === id) || null;
    }, [phase, clueOrder, gameState.players]);

    // Mr White guess modal state
    const mrWhitePlayer = useMemo(() => gameState.players.find(p => p.id === mrWhiteToGuessId) || null, [gameState.players, mrWhiteToGuessId]);
    const [guess, setGuess] = useState('');
    useEffect(() => {
        if (mrWhiteToGuessId) setGuess('');
    }, [mrWhiteToGuessId]);

    return (
        <SafeAreaView style={[GlobalStyles.container, styles.container]}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('cameleon:game.title')}</Text>
                <Text style={styles.subtitle}>{t('cameleon:game.subtitle')}</Text>
            </View>

            {phase === 'settings' && (
                <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.settingsBox, { flex: 1 }]}>
                    <SettingsPanel
                        playersCount={players.length}
                        currentUC={currentUC}
                        currentMW={currentMW}
                        maxImpostors={maxImpostors}
                        canStart={canStart}
                        onChangeUC={(val) => setOverrideUC(Math.min(players.length - 1, Math.min(val, maxImpostors - currentMW)))}
                        onChangeMW={(val) => setOverrideMW(Math.min(players.length - 1 - currentUC, Math.min(val, maxImpostors - currentUC)))}
                        onStart={handleStart}
                        t={t}
                    />
                </Animated.View>
            )}

            {phase === 'reveal' && currentRevealPlayer && (
                <View style={{ flex: 1 }}>
                    <RevealCard
                        name={currentRevealPlayer.name}
                        roleLabel={(currentRevealPlayer.role === 'mrWhite' ? t('cameleon:roles.mrWhite') : currentRevealPlayer.role === 'cameleon' ? t('cameleon:roles.cameleon') : t('cameleon:roles.civilian'))}
                        secretWord={currentRevealPlayer.secretWord}
                        onNext={revealNext}
                        t={t}
                    />
                </View>
            )}

            {(phase === 'clues' || phase === 'vote' || phase === 'results') && (
                <>
                    <PlayerGrid
                        players={orderedPlayers as any}
                        isVote={phase === 'vote' || phase === 'results'}
                        clueOrder={clueOrder}
                        selectedForElimination={selectedForElimination}
                        onSelect={selectElimination}
                        t={t}
                    />
                    <ActionBar
                        isVote={phase === 'vote' || phase === 'results'}
                        selectedForElimination={selectedForElimination}
                        onConfirmElimination={confirmElimination}
                        onBeginVote={beginVote}
                        t={t}
                    />
                </>
            )}

            <PopModal visible={!!firstPlayerForModal && showStartModal} title={firstPlayerForModal ? t('cameleon:modals.firstPlayer', { name: firstPlayerForModal.name }) : undefined} name={firstPlayerForModal?.name} avatar={firstPlayerForModal?.avatar} />

            <PopModal visible={!!eliminationNotice} title={eliminationNotice ?? undefined} name={eliminatedForModal?.name} avatar={eliminatedForModal?.avatar} badgeEmoji={'❌'} badgeColor={'#C62828'} />

            <MrWhiteGuessModal
                visible={!!mrWhiteToGuessId}
                name={mrWhitePlayer?.name}
                avatar={mrWhitePlayer?.avatar}
                guess={guess}
                onChangeGuess={setGuess}
                onSubmit={() => submitMrWhiteGuess(guess)}
                t={t}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
    subtitle: { fontSize: 14, color: Colors.text.secondary, marginTop: 4, textAlign: 'center' },
    settingsBox: { margin: 16, padding: 16, backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1, borderColor: '#EDEDED' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 8, textAlign: 'center' },
    sectionSubtitle: { fontSize: 14, color: Colors.text.secondary, marginBottom: 8, textAlign: 'center' },
    counterInfo: { fontSize: 13, color: Colors.text.secondary, marginBottom: 12, textAlign: 'center' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    label: { fontSize: 16, color: Colors.text.primary, fontWeight: '600' },
    stepper: { flexDirection: 'row', alignItems: 'center' },
    stepperBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E0E0E0' },
    stepperBtnText: { fontSize: 20, color: Colors.text.primary },
    stepperValue: { width: 40, textAlign: 'center', fontSize: 16, color: Colors.text.primary },
    primaryBtn: { backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    primaryBtnText: { color: Colors.text.white, fontSize: 16, fontWeight: 'bold' },
    btnDisabled: { opacity: 0.5 },
    revealBox: { margin: 16, padding: 16, backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1, borderColor: '#EDEDED' },
    gridItem: { flexBasis: '33.333%', alignSelf: 'stretch', alignItems: 'center', paddingVertical: 14, height: 134, borderRadius: 12 },
    gridOrder: { fontSize: 13, color: Colors.primary },
    statusContainer: { height: 24, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
    gridName: { fontSize: 13, color: Colors.text.primary, marginTop: 6, maxWidth: 100, textAlign: 'center' },
    eliminatedPill: { paddingHorizontal: 10, paddingVertical: 3, backgroundColor: Colors.danger, borderRadius: 12 },
    eliminatedPillText: { color: Colors.text.white, fontSize: 11, fontWeight: '800' },
    secondaryBtn: { marginTop: 16, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    secondaryBtnText: { color: Colors.primary, fontSize: 16, fontWeight: '600' },
    ghostBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 10 },
    ghostBtnText: { color: Colors.text.secondary, fontSize: 14 },
    selectedItem: { backgroundColor: 'rgba(255,107,107,0.10)', borderColor: Colors.primary, borderWidth: 1.5 },
    resultCard: { backgroundColor: Colors.background, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#EDEDED' },
    resultTitle: { fontSize: 18, fontWeight: '700', color: Colors.text.primary, marginBottom: 8 },
    eliminatedName: { fontSize: 20, fontWeight: '800', color: Colors.primary, marginTop: 4 },
    eliminatedRole: { fontSize: 22, fontWeight: '800', color: Colors.text.primary, marginTop: 4 },
    winnerText: { fontSize: 18, fontWeight: '800', marginTop: 12 },
    winnerCivilians: { color: '#2E7D32' },
    winnerUndercover: { color: '#C62828' },
    // Mr White
    mrWhitePrompt: { fontSize: 15, color: Colors.text.secondary, textAlign: 'center', marginTop: 8 },
    input: { marginTop: 12, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, minWidth: 220, color: Colors.text.primary },
}); 