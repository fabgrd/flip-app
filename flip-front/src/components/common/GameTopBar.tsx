import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { T } from '../../constants/flipTokens';
import { ChunkyButton } from './ChunkyButton';
import { GameMenuActions, GameRule } from './GameMenuHeader';
import type { Player } from '../../types';

interface GameTopBarProps {
  onExit: () => void;
  onSettings: () => void;
  rules: { rules: GameRule[]; title: string; accentColor?: string };
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  showDice?: boolean;
}

export function GameTopBar({
  onExit,
  onSettings,
  rules,
  players,
  onPlayersChange,
  showDice = false,
}: GameTopBarProps) {
  return (
    <View style={s.header}>
      <ChunkyButton
        square
        size="sm"
        color={T.paper}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onExit();
        }}
      >
        <Feather name="arrow-left" size={18} color={T.ink} />
      </ChunkyButton>
      <GameMenuActions
        showDice={showDice}
        onPressSettings={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSettings();
        }}
        rules={rules}
        players={players}
        onPlayersChange={onPlayersChange}
      />
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
