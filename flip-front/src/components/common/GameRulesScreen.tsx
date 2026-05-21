import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { T } from '../../constants/flipTokens';
import type { Player } from '../../types';
import { ChunkyButton } from './ChunkyButton';
import { DotBackground } from './DotBackground';
import { PlayersModal } from './GameMenuHeader';
import { GameTopBar } from './GameTopBar';

export interface RulesStep {
  n: string;
  title: string;
  desc: string;
}

interface GameRulesScreenProps {
  accentColor: string;
  title: string;
  titleColor?: string;
  taglineColor?: string;
  tagline?: string;
  icon?: React.ReactNode;
  iconRotation?: number;

  // Header / GameMenuActions
  rulesModal: { rules: RulesStep[]; title: string };
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onExit: () => void;
  onSettings: () => void;

  // Footer
  minPlayers: number;
  onStart: () => void;
  startLabel: string;
  startDisabled?: boolean;

  // Body
  scrollable?: boolean;
  children?: React.ReactNode;
}

export function GameRulesScreen({
  accentColor,
  title,
  titleColor = '#fff',
  taglineColor = 'rgba(255,255,255,0.65)',
  tagline,
  icon,
  iconRotation = 0,
  rulesModal,
  players,
  onPlayersChange,
  onExit,
  onSettings,
  minPlayers,
  onStart,
  startLabel,
  startDisabled,
  scrollable = false,
  children,
}: GameRulesScreenProps) {
  const [showPlayersModal, setShowPlayersModal] = useState(false);

  const handleStart = () => {
    if (startDisabled) return;
    if (players.length < minPlayers) {
      setShowPlayersModal(true);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onStart();
  };

  const titleBlock = (
    <View style={s.titleArea}>
      {icon ? (
        <View style={[s.iconWrap, iconRotation ? { transform: [{ rotate: `${iconRotation}deg` }] } : null]}>
          {icon}
        </View>
      ) : null}
      <Text style={[s.title, { color: titleColor }]}>{title}</Text>
      {tagline ? <Text style={[s.tagline, { color: taglineColor }]}>{tagline}</Text> : null}
    </View>
  );

  const footer = (
    <View style={s.footer}>
      <ChunkyButton
        full
        color={T.paper}
        disabled={startDisabled}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleStart();
        }}
      >
        {startLabel}
      </ChunkyButton>
    </View>
  );

  return (
    <SafeAreaView style={[s.screen, { backgroundColor: accentColor }]}>
      <DotBackground color={T.ink} opacity={0.1} />

      <GameTopBar
        onExit={onExit}
        onSettings={onSettings}
        rules={{ rules: rulesModal.rules, title: rulesModal.title, accentColor }}
        players={players}
        onPlayersChange={onPlayersChange}
      />

      {scrollable ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
          {titleBlock}
          {children}
          {footer}
        </ScrollView>
      ) : (
        <>
          {titleBlock}
          <View style={{ flex: 1 }}>{children}</View>
          {footer}
        </>
      )}

      <PlayersModal
        visible={showPlayersModal}
        onClose={() => setShowPlayersModal(false)}
        onPlayersChange={onPlayersChange}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  titleArea: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  iconWrap: { position: 'absolute', right: 16, top: 16 },
  title: {
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -2.5,
    lineHeight: 68,
    marginTop: 12,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: 6,
  },
  footer: { padding: 20, paddingBottom: 32 },
});
