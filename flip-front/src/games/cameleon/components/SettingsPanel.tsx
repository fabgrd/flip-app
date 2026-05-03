import { TFunction } from 'i18next';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { T } from '../../../constants/flipTokens';
import type { CameleonTheme } from '../types';

interface SettingsPanelProps {
  playersCount: number;
  currentUC: number;
  currentMW: number;
  selectedTheme: CameleonTheme;
  maxImpostors: number;
  canStart: boolean;
  onChangeUC: (value: number) => void;
  onChangeMW: (value: number) => void;
  onChangeTheme: (theme: CameleonTheme) => void;
  onStart: () => void;
  t: TFunction;
}

export function SettingsPanel({
  playersCount,
  currentUC,
  currentMW,
  canStart,
  onChangeUC,
  onChangeMW,
  onStart,
  t,
}: SettingsPanelProps) {
  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: T.paper }]}>
          <Text style={styles.statValue}>{playersCount}</Text>
          <Text style={styles.statLabel}>{t('cameleon:settings.players', 'Joueurs')}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: T.lemon }]}>
          <Text style={styles.statValue}>{currentUC + currentMW}</Text>
          <Text style={styles.statLabel}>{t('cameleon:settings.impostors', 'Imposteurs')}</Text>
        </View>
      </View>

      {/* Undercover stepper */}
      <Text style={styles.sectionLabel}>{t('cameleon:settings.undercover', 'Undercover')}</Text>
      <View style={styles.stepperCard}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChangeUC(Math.max(0, currentUC - 1))}
          activeOpacity={0.8}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepValue}>{currentUC}</Text>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChangeUC(currentUC + 1)}
          activeOpacity={0.8}
        >
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Mr White stepper */}
      <Text style={styles.sectionLabel}>{t('cameleon:settings.mrWhite', 'Mr White')}</Text>
      <View style={styles.stepperCard}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChangeMW(Math.max(0, currentMW - 1))}
          activeOpacity={0.8}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepValue}>{currentMW}</Text>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChangeMW(currentMW + 1)}
          activeOpacity={0.8}
        >
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Start button */}
      <TouchableOpacity
        style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
        onPress={onStart}
        disabled={!canStart}
        activeOpacity={0.85}
      >
        <Text style={styles.startBtnText}>
          {t('cameleon:actions.start', 'Distribuer les rôles')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: T.rMd,
    borderWidth: 2,
    borderColor: T.ink,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  statValue: { color: T.ink, fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  statLabel: {
    color: T.inkSoft,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  sectionLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  stepperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 22,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: T.rSm,
    borderWidth: 2,
    borderColor: T.ink,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { color: T.ink, fontSize: 26, fontWeight: '900', lineHeight: 30 },
  stepValue: { color: T.ink, fontSize: 28, fontWeight: '900', width: 52, textAlign: 'center' },

  startBtn: {
    backgroundColor: T.ink,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: T.tomato,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  startBtnDisabled: { opacity: 0.45 },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },
});
