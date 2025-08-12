import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

interface SettingsPanelProps {
  playersCount: number;
  currentUC: number;
  currentMW: number;
  maxImpostors: number;
  canStart: boolean;
  onChangeUC: (value: number) => void;
  onChangeMW: (value: number) => void;
  onStart: () => void;
  t: (key: string, opts?: any) => string;
}

export function SettingsPanel({
  playersCount,
  currentUC,
  currentMW,
  maxImpostors,
  canStart,
  onChangeUC,
  onChangeMW,
  onStart,
  t,
}: SettingsPanelProps) {
  const plannedImpostors = currentUC + currentMW;
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.box,
        { flex: 1, backgroundColor: theme.colors.background, borderColor: theme.colors.border },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {t('cameleon:settings.title')}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        {t('cameleon:settings.subtitle', { count: playersCount })}
      </Text>

      <Text style={[styles.info, { color: theme.colors.text.secondary }]}>
        {t('cameleon:counters.remainingImpostors', { count: plannedImpostors })} · Max{' '}
        {maxImpostors}
      </Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text.primary }]}>
          {t('cameleon:settings.undercover')}
        </Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={() => onChangeUC(Math.max(0, currentUC - 1))}
            style={[
              styles.stepperBtn,
              { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.stepperBtnText, { color: theme.colors.text.primary }]}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.stepperValue, { color: theme.colors.text.primary }]}>
            {currentUC}
          </Text>
          <TouchableOpacity
            onPress={() => onChangeUC(currentUC + 1)}
            style={[
              styles.stepperBtn,
              { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.stepperBtnText, { color: theme.colors.text.primary }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text.primary }]}>
          {t('cameleon:settings.mrWhite')}
        </Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={() => onChangeMW(Math.max(0, currentMW - 1))}
            style={[
              styles.stepperBtn,
              { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.stepperBtnText, { color: theme.colors.text.primary }]}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.stepperValue, { color: theme.colors.text.primary }]}>
            {currentMW}
          </Text>
          <TouchableOpacity
            onPress={() => onChangeMW(currentMW + 1)}
            style={[
              styles.stepperBtn,
              { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.stepperBtnText, { color: theme.colors.text.primary }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryBtn,
          { backgroundColor: theme.colors.primary },
          !canStart && styles.btnDisabled,
        ]}
        onPress={onStart}
        disabled={!canStart}
      >
        <Text style={[styles.primaryBtnText, { color: theme.colors.text.white }]}>
          {t('cameleon:actions.reveal')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: 12, borderWidth: 1, margin: 16, padding: 16 },
  btnDisabled: { opacity: 0.5 },
  info: { fontSize: 13, marginBottom: 12, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600' },
  primaryBtn: { alignItems: 'center', borderRadius: 12, marginTop: 8, paddingVertical: 14 },
  primaryBtnText: { fontSize: 16, fontWeight: 'bold' },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepper: { alignItems: 'center', flexDirection: 'row' },
  stepperBtn: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  stepperBtnText: { fontSize: 20 },
  stepperValue: { fontSize: 16, textAlign: 'center', width: 40 },
  subtitle: { fontSize: 14, marginBottom: 8, textAlign: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
});
