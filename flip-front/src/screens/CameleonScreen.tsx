import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  DotBackground,
  GameHeader,
  GameRulesScreen,
  PlayerPickerGrid,
  PopModal,
} from '../components/common';
import { ChameleonIcon } from '../components/icons';
import { T } from '../constants/flipTokens';
import { useCameleon, useCameleonThemeAccess } from '../games/cameleon';
import { useDrinksMode } from '../hooks';
import {
  ActionBar,
  MrWhiteGuessModal,
  RevealCard,
  SettingsPanel,
} from '../games/cameleon/components';
import type { CameleonTheme } from '../games/cameleon/types';
import { Player, RootStackParamList } from '../types';

type CameleonRouteProp = RouteProp<RootStackParamList, 'Cameleon'>;


export function CameleonScreen() {
  const route = useRoute<CameleonRouteProp>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { players } = route.params as { players: Player[] };
  const [localPlayers, setLocalPlayers] = useState(players);
  const { enabled: drinksEnabled } = useDrinksMode();
  const [eliminationDrink, setEliminationDrink] = useState<string | null>(null);

  const {
    gameState,
    defaultDistribution,
    startGame,
    phase,
    currentRevealPlayer,
    revealNext,
    clueOrder,
    beginVote,
    selectedForElimination,
    selectElimination,
    confirmElimination,
    gameOver,
    proceedAfterResults,
    mrWhiteToGuessId,
    submitMrWhiteGuess,
  } = useCameleon(localPlayers);

  const [overrideUC, setOverrideUC] = useState<number | undefined>(undefined);
  const [overrideMW, setOverrideMW] = useState<number | undefined>(undefined);
  const [selectedThemes, setSelectedThemes] = useState<CameleonTheme[]>(['random']);
  const { isThemeAllowed, requestUnlockFor, filterAllowed } = useCameleonThemeAccess();

  const currentUC = Math.max(1, overrideUC ?? defaultDistribution.undercovers);
  const currentMW = overrideMW ?? defaultDistribution.mrWhites;
  const maxImpostors = Math.floor(localPlayers.length / 2);
  const totalImpostors = currentUC + currentMW;
  const canStart = useMemo(
    () => totalImpostors <= maxImpostors && totalImpostors < localPlayers.length,
    [totalImpostors, maxImpostors, localPlayers.length],
  );

  const handleStart = () => {
    const safeThemes = selectedThemes.includes('random')
      ? selectedThemes
      : filterAllowed(selectedThemes);
    const pairsData = t('cameleon:wordPairsByTheme', { returnObjects: true }) as Record<string, Array<{ w: string; c: string }>>;
    startGame({
      overrideDistribution: { undercovers: currentUC, mrWhites: currentMW },
      themes: safeThemes.length > 0 ? safeThemes : ['random'],
      pairsData,
    });
  };

  const [showStartModal, setShowStartModal] = useState(false);
  useEffect(() => {
    if (phase === 'clues' && clueOrder.length > 0) {
      setShowStartModal(true);
      const timer = setTimeout(() => setShowStartModal(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, clueOrder]);

  const [eliminationNotice, setEliminationNotice] = useState<string | null>(null);
  const [eliminatedForModal, setEliminatedForModal] = useState<{
    name: string;
    avatar?: string;
  } | null>(null);
  useEffect(() => {
    if (phase === 'results') {
      const eliminated =
        gameState.players.find((p) => p.isEliminated && p.id === selectedForElimination) || null;
      if (eliminated) {
        const roleLabel =
          eliminated.role === 'mrWhite'
            ? t('cameleon:roles.mrWhite')
            : eliminated.role === 'cameleon'
              ? t('cameleon:roles.cameleon')
              : t('cameleon:roles.civilian');
        setEliminatedForModal({ name: eliminated.name, avatar: eliminated.avatar });
        setEliminationNotice(t('cameleon:notices.eliminatedRole', { role: roleLabel }));
        if (drinksEnabled) {
          const isImpostor = eliminated.role === 'cameleon' || eliminated.role === 'mrWhite';
          setEliminationDrink(
            isImpostor
              ? t('cameleon:ui.drinkCaught', { name: eliminated.name })
              : t('cameleon:ui.drinkBadVote', { name: eliminated.name }),
          );
        }
        const timer = setTimeout(
          () => {
            setEliminationNotice(null);
            setEliminatedForModal(null);
            setEliminationDrink(null);
            if (!gameOver) proceedAfterResults();
          },
          drinksEnabled ? 2400 : 1500,
        );
        return () => clearTimeout(timer);
      }
    }
  }, [
    phase,
    selectedForElimination,
    gameState.players,
    t,
    gameOver,
    proceedAfterResults,
    drinksEnabled,
  ]);

  useEffect(() => {
    if (phase === 'results' && gameOver) {
      const timer = setTimeout(
        () => navigation.navigate('CameleonResults', { players: gameState.players }),
        800,
      );
      return () => clearTimeout(timer);
    }
  }, [phase, gameOver, gameState.players, navigation]);

  const orderedPlayers = useMemo(() => {
    if (clueOrder.length > 0)
      return clueOrder.map((id) => gameState.players.find((p) => p.id === id)!).filter(Boolean);
    return gameState.players;
  }, [clueOrder, gameState.players]);

  const firstPlayerForModal = useMemo(() => {
    if (phase !== 'clues' || clueOrder.length === 0) return null;
    return gameState.players.find((p) => p.id === clueOrder[0]) || null;
  }, [phase, clueOrder, gameState.players]);

  const mrWhitePlayer = useMemo(
    () => gameState.players.find((p) => p.id === mrWhiteToGuessId) || null,
    [gameState.players, mrWhiteToGuessId],
  );
  const [guess, setGuess] = useState('');
  useEffect(() => {
    if (mrWhiteToGuessId) setGuess('');
  }, [mrWhiteToGuessId]);

  const bgColor = phase === 'settings' ? T.mint : phase === 'reveal' ? T.paper : T.bg;

  const toggleTheme = (theme: CameleonTheme) => {
    if (theme === 'random') {
      setSelectedThemes(['random']);
      return;
    }
    setSelectedThemes((prev) => {
      const withoutRandom = prev.filter((tt) => tt !== 'random');
      const isOn = withoutRandom.includes(theme);
      const next = isOn ? withoutRandom.filter((tt) => tt !== theme) : [...withoutRandom, theme];
      return next.length === 0 ? ['random'] : next;
    });
  };

  if (phase === 'settings') {
    return (
      <GameRulesScreen
        accentColor={T.mint}
        title={t('cameleon:ui.title')}
        tagline={t('cameleon:ui.tagline')}
        icon={<ChameleonIcon size={86} />}
        rulesModal={{ rules: t('cameleon:ui.steps', { returnObjects: true }) as any, title: t('cameleon:ui.modalTitle') }}
        players={localPlayers}
        onPlayersChange={setLocalPlayers}
        onExit={() => navigation.goBack()}
        onSettings={() => navigation.navigate('Settings')}
        minPlayers={3}
        onStart={handleStart}
        startLabel={t('cameleon:ui.start')}
        startDisabled={!canStart}
      >
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.flex}>
          <SettingsPanel
            playersCount={localPlayers.length}
            currentUC={currentUC}
            currentMW={currentMW}
            selectedThemes={selectedThemes}
            maxImpostors={maxImpostors}
            onChangeUC={(val) =>
              setOverrideUC(
                Math.max(
                  1,
                  Math.min(localPlayers.length - 1, Math.min(val, maxImpostors - currentMW)),
                ),
              )
            }
            onChangeMW={(val) =>
              setOverrideMW(
                Math.min(
                  localPlayers.length - 1 - currentUC,
                  Math.min(val, maxImpostors - currentUC),
                ),
              )
            }
            onToggleTheme={toggleTheme}
            isThemeAllowed={isThemeAllowed}
            onRequestUnlock={requestUnlockFor}
            t={t}
          />
        </Animated.View>
      </GameRulesScreen>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {(phase === 'clues' || phase === 'vote' || phase === 'results') && (
        <DotBackground opacity={0.06} color={T.ink} />
      )}

      {/* ── REVEAL ── */}
      {phase === 'reveal' && currentRevealPlayer && (
        <View style={styles.flex}>
          <GameHeader
            floating
            tint={T.paper}
            onExit={() => navigation.goBack()}
            onSettings={() => (navigation as any).navigate('Settings')}
            rules={{
              title: t('cameleon:ui.modalTitle'),
              rules: t('cameleon:ui.steps', { returnObjects: true }) as any,
              accentColor: T.mint,
            }}
            players={localPlayers}
            onPlayersChange={setLocalPlayers}
          />
          <RevealCard
            key={currentRevealPlayer.id}
            name={currentRevealPlayer.name}
            avatar={currentRevealPlayer.avatar}
            roleLabel={
              currentRevealPlayer.role === 'mrWhite'
                ? t('cameleon:roles.mrWhite')
                : currentRevealPlayer.role === 'cameleon'
                  ? t('cameleon:roles.cameleon')
                  : t('cameleon:roles.civilian')
            }
            secretWord={currentRevealPlayer.secretWord}
            onNext={revealNext}
            t={t}
          />
        </View>
      )}

      {/* ── CLUES / VOTE ── */}
      {(phase === 'clues' || phase === 'vote' || phase === 'results') && (
        <>
          <GameHeader
            tint={T.paper}
            onExit={() => navigation.goBack()}
            onSettings={() => (navigation as any).navigate('Settings')}
            rules={{
              title: t('cameleon:ui.modalTitle'),
              rules: t('cameleon:ui.steps', { returnObjects: true }) as any,
              accentColor: T.mint,
            }}
            players={localPlayers}
            onPlayersChange={setLocalPlayers}
          />
          <View style={styles.header}>
            <View style={styles.chipRow}>
              <View style={[styles.chip, { backgroundColor: T.mint }]}>
                <Text style={styles.chipText}>
                  {phase === 'vote' || phase === 'results'
                    ? t('cameleon:phases.vote', 'Vote final')
                    : t('cameleon:phases.clues', 'Indices')}
                </Text>
              </View>
            </View>
            <Text style={styles.phaseTitle}>
              {phase === 'vote' || phase === 'results'
                ? t('cameleon:ui.whoIsTitle')
                : t('cameleon:game.title', 'Le Caméléon')}
            </Text>
            {(phase === 'vote' || phase === 'results') && (
              <Text style={styles.phaseSubtitle}>
                {t('cameleon:vote.hint', 'Discutez puis votez ensemble.')}
              </Text>
            )}
          </View>
          <PlayerPickerGrid
            players={orderedPlayers}
            selectedId={
              phase === 'vote' || phase === 'results' ? selectedForElimination : null
            }
            onSelect={
              phase === 'vote' || phase === 'results'
                ? (p) => selectElimination(p.id)
                : undefined
            }
            isDisabled={(p) => p.isEliminated}
            selectedColor={T.tomato}
            selectedNameColor="#fff"
            avatarSize={60}
            minCardHeight={120}
            renderBadge={(item, index, selected) =>
              item.isEliminated ? (
                <View style={cmStyles.eliminatedBadge}>
                  <Text style={cmStyles.eliminatedBadgeText}>
                    {t('cameleon:badges.eliminated', 'Éliminé')}
                  </Text>
                </View>
              ) : (
                <View style={[cmStyles.orderBadge, selected && cmStyles.orderBadgeSelected]}>
                  <Text
                    style={[
                      cmStyles.orderBadgeText,
                      selected && cmStyles.orderBadgeTextSelected,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
              )
            }
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

      <PopModal
        visible={!!firstPlayerForModal && showStartModal}
        title={
          firstPlayerForModal
            ? t('cameleon:modals.firstPlayer', { name: firstPlayerForModal.name })
            : undefined
        }
        name={firstPlayerForModal?.name}
        avatar={firstPlayerForModal?.avatar}
      />
      <PopModal
        visible={!!eliminationNotice}
        title={eliminationNotice ?? undefined}
        name={eliminatedForModal?.name}
        avatar={eliminatedForModal?.avatar}
        badgeEmoji="❌"
        badgeColor="#C62828"
      >
        {eliminationDrink && <Text style={styles.drinkInstruction}>{eliminationDrink}</Text>}
      </PopModal>
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
  flex: { flex: 1 },

  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  chipRow: { flexDirection: 'row', marginBottom: 10 },
  chip: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: T.ink,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  chipText: {
    color: T.ink,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  phaseTitle: {
    color: T.ink,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 38,
  },
  phaseSubtitle: { color: T.inkSoft, fontSize: 14, marginTop: 6, lineHeight: 20 },
  drinkInstruction: {
    marginTop: 12,
    color: T.ink,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: T.lemon,
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});

const cmStyles = StyleSheet.create({
  orderBadge: {
    position: 'absolute',
    top: 8,
    left: 10,
    width: 22,
    height: 22,
    borderRadius: 8,
    backgroundColor: T.bg,
    borderWidth: 1.5,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBadgeSelected: { backgroundColor: T.ink },
  orderBadgeText: { color: T.ink, fontSize: 11, fontWeight: '900' },
  orderBadgeTextSelected: { color: '#fff' },
  eliminatedBadge: {
    position: 'absolute',
    top: 8,
    left: 10,
    backgroundColor: T.inkSoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  eliminatedBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
