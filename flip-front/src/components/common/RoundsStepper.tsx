import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { T } from '../../constants/flipTokens';

interface RoundsStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function RoundsStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  step = 1,
  label,
  accentColor = T.lemon,
  style,
}: RoundsStepperProps) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('common:labels.rounds', 'Tours');

  const clamped = Math.min(max, Math.max(min, value));
  const canDec = clamped > min;
  const canInc = clamped < max;

  const bump = (next: number) => {
    const v = Math.min(max, Math.max(min, next));
    if (v === clamped) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(v);
  };

  return (
    <View style={[s.card, style]}>
      <View style={[s.iconWrap, { backgroundColor: accentColor }]}>
        <Feather name="repeat" size={16} color={T.ink} />
      </View>
      <Text style={s.label}>{resolvedLabel}</Text>
      <View style={s.stepper}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!canDec}
          onPress={() => bump(clamped - step)}
          style={[s.btn, !canDec && s.btnDisabled]}
        >
          <Text style={[s.btnText, !canDec && s.btnTextDisabled]}>−</Text>
        </TouchableOpacity>
        <Text style={s.value}>{clamped}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!canInc}
          onPress={() => bump(clamped + step)}
          style={[s.btn, !canInc && s.btnDisabled]}
        >
          <Text style={[s.btnText, !canInc && s.btnTextDisabled]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, color: T.ink, fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: T.ink,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.35 },
  btnText: { color: T.ink, fontSize: 20, fontWeight: '900', lineHeight: 22 },
  btnTextDisabled: { color: T.muted },
  value: {
    color: T.ink,
    fontSize: 18,
    fontWeight: '900',
    minWidth: 28,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
});
