import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { T } from '../../constants/flipTokens';
import { GameCard } from './GamePrimitives';

export interface RulesStepItem {
  n: string;
  t: string;
  d: string;
}

interface RulesStepsCardProps {
  steps: RulesStepItem[];
  accentColor?: string;
  starColor?: string;
  label?: string;
}

export function RulesStepsCard({
  steps,
  accentColor = T.pink,
  starColor = T.lemon,
  label,
}: RulesStepsCardProps) {
  return (
    <GameCard style={{ borderRadius: 22, padding: 18 }}>
      {label ? <Text style={s.cardLabel}>{label}</Text> : null}
      {steps.map((step, i) => {
        const isStar = step.n === '★';
        return (
          <View key={`${step.n}-${i}`} style={[s.ruleRow, i < steps.length - 1 && s.divider]}>
            <View style={[s.ruleNum, { backgroundColor: isStar ? starColor : accentColor }]}>
              <Text style={[s.ruleNumText, { color: isStar ? T.ink : '#fff' }]}>{step.n}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.ruleTitle}>{step.t}</Text>
              <Text style={s.ruleDesc}>{step.d}</Text>
            </View>
          </View>
        );
      })}
    </GameCard>
  );
}

const s = StyleSheet.create({
  cardLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  ruleRow: { flexDirection: 'row', gap: 12, paddingVertical: 9 },
  divider: { borderBottomWidth: 1, borderBottomColor: `${T.muted}40` },
  ruleNum: {
    width: 30,
    height: 30,
    borderRadius: 9,
    flexShrink: 0,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleNumText: { fontSize: 14, fontWeight: '900' },
  ruleTitle: { color: T.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  ruleDesc: { color: T.inkSoft, fontSize: 13, marginTop: 2, lineHeight: 18 },
});
