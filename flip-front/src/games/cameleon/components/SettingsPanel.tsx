import { TFunction } from 'i18next';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChunkyButton } from '../../../components/common/ChunkyButton';
import { DrinkModeToggle } from '../../../components/common/DrinkModeToggle';
import { ThemeGrid } from '../../../components/common/ThemeGrid';
import { T } from '../../../constants/flipTokens';
import { CAMELEON_THEME_OPTIONS } from '../constants';
import type { CameleonTheme } from '../types';

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

interface SettingsPanelProps {
  playersCount: number;
  currentUC: number;
  currentMW: number;
  selectedThemes: CameleonTheme[];
  maxImpostors: number;
  canStart: boolean;
  onChangeUC: (value: number) => void;
  onChangeMW: (value: number) => void;
  onToggleTheme: (theme: CameleonTheme) => void;
  isThemeAllowed: (theme: CameleonTheme) => boolean;
  onRequestUnlock: (theme: CameleonTheme) => void;
  onStart: () => void;
  t: TFunction;
}

export function SettingsPanel({
  playersCount,
  currentUC,
  currentMW,
  selectedThemes,
  canStart,
  onChangeUC,
  onChangeMW,
  onToggleTheme,
  isThemeAllowed,
  onRequestUnlock,
  onStart,
  t,
}: SettingsPanelProps) {
  const stepperMetrics = { height: 38, radius: T.rSm, paddingH: 0, fontSize: 20 };
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <DrinkModeToggle accentColor={T.mint} style={{ marginBottom: 12 }} />

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

      <View style={styles.stepperRow}>
        <View style={styles.stepperCol}>
          <Text style={styles.sectionLabel}>{t('cameleon:settings.undercover', 'Undercover')}</Text>
          <View style={styles.stepperCard}>
            <ChunkyButton
              size="sm"
              square
              color={T.bg}
              textColor={T.ink}
              shadowColor={T.ink}
              metrics={stepperMetrics}
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
              metrics={stepperMetrics}
              onPress={() => onChangeUC(currentUC + 1)}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </ChunkyButton>
          </View>
        </View>

        <View style={styles.stepperCol}>
          <Text style={styles.sectionLabel}>{t('cameleon:settings.mrWhite', 'Mr White')}</Text>
          <View style={styles.stepperCard}>
            <ChunkyButton
              size="sm"
              square
              color={T.bg}
              textColor={T.ink}
              shadowColor={T.ink}
              metrics={stepperMetrics}
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
              metrics={stepperMetrics}
              onPress={() => onChangeMW(currentMW + 1)}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </ChunkyButton>
          </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>{t('cameleon:settings.themes', 'Thèmes')}</Text>
      <ThemeGrid<CameleonTheme>
        options={CAMELEON_THEME_OPTIONS.map((opt) => ({
          value: opt.value,
          label: t(opt.labelKey),
          emoji: THEME_META[opt.value].emoji,
        }))}
        isActive={(v) =>
          v === 'random'
            ? selectedThemes.includes('random')
            : !selectedThemes.includes('random') && selectedThemes.includes(v)
        }
        isAllowed={isThemeAllowed}
        onSelect={onToggleTheme}
        onLockedPress={onRequestUnlock}
      />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: T.rMd,
    borderWidth: 2,
    borderColor: T.ink,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  statValue: { color: T.ink, fontSize: 26, fontWeight: '900', letterSpacing: -1 },
  statLabel: {
    color: T.inkSoft,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  sectionLabel: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  stepperRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  stepperCol: { flex: 1 },
  stepperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  stepBtnText: { color: T.ink, fontSize: 20, fontWeight: '900', lineHeight: 22 },
  stepValue: { color: T.ink, fontSize: 22, fontWeight: '900', width: 36, textAlign: 'center' },

  startBtn: { marginTop: 20 },
});
