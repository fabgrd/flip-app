import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';

import { DotBackground, FlatChunkyButton, PopModal, RulesButton } from '../components/common';
import { T } from '../constants/flipTokens';
import { useCameleon } from '../games/cameleon';
import {
  ActionBar,
  MrWhiteGuessModal,
  PlayerGrid,
  RevealCard,
  SettingsPanel,
} from '../games/cameleon/components';
import { CAMELEON_THEME_OPTIONS } from '../games/cameleon/constants';
import type { CameleonTheme } from '../games/cameleon/types';
import { Player, RootStackParamList } from '../types';

type CameleonRouteProp = RouteProp<RootStackParamList, 'Cameleon'>;

const CAMELEON_RULES = [
  { n: '1', title: 'Faites tourner le tel', desc: 'Chacun voit son mot secret… sauf le caméléon.' },
  {
    n: '2',
    title: 'À tour de rôle, un indice',
    desc: 'Un mot, pas plus. Ni trop évident, ni trop vague.',
  },
  { n: '3', title: 'Discutez', desc: 'Débattez — qui semble ne pas savoir de quoi il parle ?' },
  {
    n: '4',
    title: 'Tout le monde vote',
    desc: "Désignez l'imposteur. S'il est démasqué, les civils gagnent.",
  },
];

const THEME_META: Record<CameleonTheme, { emoji: string; desc: string }> = {
  random: { emoji: '🎲', desc: 'Un mix de tout' },
  daily: { emoji: '📅', desc: 'Mots du quotidien' },
  football: { emoji: '⚽', desc: 'Foot & culture pop' },
  hot: { emoji: '🔥', desc: 'Adulte & osé' },
  wtf: { emoji: '🤪', desc: 'Complètement WTF' },
  sousculture: { emoji: '🕶️', desc: 'Culture underground' },
  rap: { emoji: '🎤', desc: 'Rap & punchlines' },
  decadence: { emoji: '🍸', desc: 'Ambiance décadente' },
};

export function CameleonScreen() {
  const route = useRoute<CameleonRouteProp>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { players } = route.params as { players: Player[] };

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
  } = useCameleon(players);

  const [overrideUC, setOverrideUC] = useState<number | undefined>(undefined);
  const [overrideMW, setOverrideMW] = useState<number | undefined>(undefined);
  const [selectedThemes, setSelectedThemes] = useState<CameleonTheme[]>(['random']);
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const currentUC = overrideUC ?? defaultDistribution.undercovers;
  const currentMW = overrideMW ?? defaultDistribution.mrWhites;
  const maxImpostors = Math.floor(players.length / 2);
  const totalImpostors = currentUC + currentMW;
  const canStart = useMemo(
    () => totalImpostors <= maxImpostors && totalImpostors < players.length,
    [totalImpostors, maxImpostors, players.length],
  );

  const handleStart = () => {
    startGame({
      overrideDistribution: { undercovers: currentUC, mrWhites: currentMW },
      themes: selectedThemes,
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
        const timer = setTimeout(() => {
          setEliminationNotice(null);
          setEliminatedForModal(null);
          if (!gameOver) proceedAfterResults();
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, selectedForElimination, gameState.players, t, gameOver, proceedAfterResults]);

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

  // Theme button: show emoji of active selection
  // If random or multiple → 🎲, otherwise the single theme emoji
  const themeButtonEmoji = (() => {
    if (selectedThemes.includes('random') || selectedThemes.length === 0) return '🎲';
    if (selectedThemes.length === 1) return THEME_META[selectedThemes[0]].emoji;
    return '🎨';
  })();

  const toggleTheme = (theme: CameleonTheme) => {
    if (theme === 'random') {
      // Random sélectionne tout et désélectionne les autres
      setSelectedThemes(['random']);
      return;
    }
    setSelectedThemes((prev) => {
      const withoutRandom = prev.filter((t) => t !== 'random');
      const isOn = withoutRandom.includes(theme);
      const next = isOn ? withoutRandom.filter((t) => t !== theme) : [...withoutRandom, theme];
      // Si rien n'est sélectionné, revenir à random
      return next.length === 0 ? ['random'] : next;
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {(phase === 'clues' || phase === 'vote' || phase === 'results' || phase === 'settings') && (
        <DotBackground opacity={0.06} color={T.ink} />
      )}

      {/* ── SETTINGS ── */}
      {phase === 'settings' && (
        <>
          <View style={styles.settingsHeader}>
            <View>
              <Text style={styles.settingsChip}>Jeu n°1</Text>
              <Text style={styles.settingsTitle}>Le{'\n'}Caméléon</Text>
            </View>
            <View style={styles.headerActions}>
              {/* Theme button */}
              <FlatChunkyButton
                size="xs"
                square
                color={T.paper}
                textColor={T.ink}
                onPress={() => setThemeModalVisible(true)}
              >
                <Text style={styles.themeBtnEmoji}>{themeButtonEmoji}</Text>
              </FlatChunkyButton>
              <RulesButton rules={CAMELEON_RULES} title="Le Caméléon" accentColor={T.mint} />
            </View>
          </View>

          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.flex}>
            <SettingsPanel
              playersCount={players.length}
              currentUC={currentUC}
              currentMW={currentMW}
              selectedTheme={selectedThemes[0] ?? 'random'}
              maxImpostors={maxImpostors}
              canStart={canStart}
              onChangeUC={(val) =>
                setOverrideUC(Math.min(players.length - 1, Math.min(val, maxImpostors - currentMW)))
              }
              onChangeMW={(val) =>
                setOverrideMW(
                  Math.min(players.length - 1 - currentUC, Math.min(val, maxImpostors - currentUC)),
                )
              }
              onChangeTheme={() => { }}
              onStart={handleStart}
              t={t}
            />
          </Animated.View>
        </>
      )}

      {/* ── REVEAL ── */}
      {phase === 'reveal' && currentRevealPlayer && (
        <View style={styles.flex}>
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
                ? 'Qui est\nle caméléon ?'
                : t('cameleon:game.title', 'Le Caméléon')}
            </Text>
            {(phase === 'vote' || phase === 'results') && (
              <Text style={styles.phaseSubtitle}>
                {t('cameleon:vote.hint', 'Discutez puis votez ensemble.')}
              </Text>
            )}
          </View>
          <PlayerGrid
            players={orderedPlayers}
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

      {/* ── THEME PICKER MODAL ── */}
      <Modal
        visible={themeModalVisible}
        transparent
        animationType="none"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setThemeModalVisible(false)}
          />
          <Animated.View
            entering={ZoomIn.duration(200)}
            exiting={ZoomOut.duration(150)}
            style={styles.modalCard}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Thème du jeu</Text>
                <Text style={styles.modalSubtitle}>Sélectionne un ou plusieurs thèmes</Text>
              </View>
              <FlatChunkyButton
                size="xs"
                square
                color={T.paper}
                textColor={T.ink}
                metrics={{ height: 28, radius: 8, paddingH: 0, fontSize: 12 }}
                onPress={() => setThemeModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </FlatChunkyButton>
            </View>
            <ScrollView
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {CAMELEON_THEME_OPTIONS.map((opt, i) => {
                const meta = THEME_META[opt.value];
                const isRandom = opt.value === 'random';
                const active = isRandom
                  ? selectedThemes.includes('random')
                  : !selectedThemes.includes('random') && selectedThemes.includes(opt.value);
                return (
                  <Animated.View key={opt.value} entering={FadeInDown.delay(i * 40)}>
                    <TouchableOpacity
                      style={[styles.themeRow, active && styles.themeRowActive]}
                      onPress={() => toggleTheme(opt.value)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.themeRowEmoji}>{meta.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.themeRowName, active && styles.themeRowNameActive]}>
                          {t(opt.labelKey)}
                        </Text>
                        <Text style={[styles.themeRowDesc, active && styles.themeRowDescActive]}>
                          {isRandom ? 'Tous les mots mélangés' : meta.desc}
                        </Text>
                      </View>
                      <View style={[styles.checkbox, active && styles.checkboxActive]}>
                        {active && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </ScrollView>
            <FlatChunkyButton
              size="sm"
              color={T.ink}
              textColor="#fff"
              metrics={{ fontSize: 16 }}
              style={styles.modalDoneBtn}
              onPress={() => setThemeModalVisible(false)}
            >
              Valider
            </FlatChunkyButton>
          </Animated.View>
        </Animated.View>
      </Modal>

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
      />
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

  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  settingsChip: {
    color: T.ink,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    backgroundColor: T.paper,
    borderWidth: 1.5,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
    overflow: 'hidden',
  },
  settingsTitle: {
    color: T.ink,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2.5,
    lineHeight: 50,
    marginBottom: 8,
  },

  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingTop: 4,
  },
  themeBtnEmoji: { fontSize: 18 },

  // Theme modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24,22,19,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    width: '100%',
    maxHeight: '75%',
    overflow: 'hidden',
    shadowColor: T.ink,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: T.ink,
    backgroundColor: T.mint,
  },
  modalTitle: { color: T.ink, fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  modalSubtitle: { color: T.inkSoft, fontSize: 12, marginTop: 2 },
  modalCloseText: { color: T.ink, fontSize: 12, fontWeight: '900' },
  modalContent: { padding: 12, gap: 8 },

  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: T.bg,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    padding: 14,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  themeRowActive: {
    backgroundColor: T.ink,
    transform: [{ translateX: 3 }, { translateY: 3 }],
    shadowOpacity: 0,
    elevation: 0,
  },
  themeRowEmoji: { fontSize: 26 },
  themeRowName: { color: T.ink, fontSize: 16, fontWeight: '900' },
  themeRowNameActive: { color: '#fff' },
  themeRowDesc: { color: T.muted, fontSize: 12, marginTop: 2 },
  themeRowDescActive: { color: 'rgba(255,255,255,0.6)' },
  themeRowCheck: { color: T.mint, fontSize: 20, fontWeight: '900' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: T.ink,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxActive: { backgroundColor: T.mint, borderColor: T.paper },
  checkmark: { color: T.ink, fontSize: 13, fontWeight: '900' },
  modalDoneBtn: { margin: 12, marginTop: 4, alignSelf: 'center', minWidth: 220 },

  // Clues/vote header
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
});
