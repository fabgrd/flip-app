import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { T } from '../../constants/flipTokens';
import { FlatChunkyButton } from './FlatChunkyButton';
import { RulesButton } from './RulesModal';

export interface GameRule {
  n: string;
  title: string;
  desc: string;
}

export interface GameMenuActionsProps {
  onPressDice?: () => void;
  showDice?: boolean;
  onPressSettings: () => void;
  rules: {
    title: string;
    rules: GameRule[];
    accentColor?: string;
  };
  style?: StyleProp<ViewStyle>;
}

export function GameMenuActions({
  onPressDice,
  showDice = true,
  onPressSettings,
  rules,
  style,
}: GameMenuActionsProps) {
  return (
    <View style={[styles.actions, style]}>
      {showDice && onPressDice && (
        <FlatChunkyButton
          size="xs"
          square
          color={T.paper}
          textColor={T.ink}
          onPress={onPressDice}
        >
          <MaterialCommunityIcons name="dice-5-outline" size={18} color={T.ink} />
        </FlatChunkyButton>
      )}
      <FlatChunkyButton
        size="xs"
        square
        color={T.paper}
        textColor={T.ink}
        onPress={onPressSettings}
      >
        <MaterialCommunityIcons name="cog-outline" size={18} color={T.ink} />
      </FlatChunkyButton>
      <RulesButton
        rules={rules.rules}
        title={rules.title}
        accentColor={rules.accentColor}
      />
    </View>
  );
}

export interface GameMenuHeaderProps extends GameMenuActionsProps {
  chipLabel: string;
  title: string;
  titleColor?: string;
  chipColor?: string;
  chipTextColor?: string;
}

export function GameMenuHeader({
  chipLabel,
  title,
  titleColor = T.ink,
  chipColor = T.paper,
  chipTextColor = T.ink,
  ...actionsProps
}: GameMenuHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <View style={[styles.chip, { backgroundColor: chipColor, borderColor: T.ink }]}>
          <Text style={[styles.chipText, { color: chipTextColor }]}>{chipLabel}</Text>
        </View>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      </View>
      <GameMenuActions {...actionsProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingTop: 4,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
    overflow: 'hidden',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2.5,
    lineHeight: 50,
    marginBottom: 8,
  },
});
