import { TFunction } from 'i18next';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChunkyButton } from '../../../components/common/ChunkyButton';
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
        <ChunkyButton
          size="sm"
          square
          color={T.bg}
          textColor={T.ink}
          shadowColor={T.ink}
          metrics={{ height: 52, radius: T.rSm, paddingH: 0, fontSize: 26 }}
          onPress={() => onChangeUC(Math.max(0, currentUC - 1))}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </ChunkyButton>
        <Text style={styles.stepValue}>{currentUC}</Text>
        <ChunkyButton
          size="sm"
          square
          color={T.bg}
          textColor={T.ink}
          shadowColor={T.ink}
          metrics={{ height: 52, radius: T.rSm, paddingH: 0, fontSize: 26 }}
          onPress={() => onChangeUC(currentUC + 1)}
        >
          <Text style={styles.stepBtnText}>+</Text>
        </ChunkyButton>
      </View>

      {/* Mr White stepper */}
      <Text style={styles.sectionLabel}>{t('cameleon:settings.mrWhite', 'Mr White')}</Text>
      <View style={styles.stepperCard}>
        <ChunkyButton
          size="sm"
          square
          color={T.bg}
          textColor={T.ink}
          shadowColor={T.ink}
          metrics={{ height: 52, radius: T.rSm, paddingH: 0, fontSize: 26 }}
          onPress={() => onChangeMW(Math.max(0, currentMW - 1))}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </ChunkyButton>
        <Text style={styles.stepValue}>{currentMW}</Text>
        <ChunkyButton
          size="sm"
          square
          color={T.bg}
          textColor={T.ink}
          shadowColor={T.ink}
          metrics={{ height: 52, radius: T.rSm, paddingH: 0, fontSize: 26 }}
          onPress={() => onChangeMW(currentMW + 1)}
        >
          <Text style={styles.stepBtnText}>+</Text>
        </ChunkyButton>
      </View>

      {/* Start button */}
      <ChunkyButton
        full
        size="md"
        color={T.ink}
        textColor="#fff"
        shadowColor={T.tomato}
        metrics={{ fontSize: 18 }}
        onPress={onStart}
        disabled={!canStart}
        style={styles.startBtn}
      >
        {t('cameleon:actions.start', 'Distribuer les rôles')}
      </ChunkyButton>
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
  stepBtnText: { color: T.ink, fontSize: 26, fontWeight: '900', lineHeight: 30 },
  stepValue: { color: T.ink, fontSize: 28, fontWeight: '900', width: 52, textAlign: 'center' },

  startBtn: { marginTop: 4 },
});
