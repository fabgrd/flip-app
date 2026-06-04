import { TFunction } from 'i18next';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChunkyButton } from '../../../components/common/ChunkyButton';
import { DrinkModeToggle } from '../../../components/common/DrinkModeToggle';
import { GameSetupCard, GameSetupSection } from '../../../components/common/GameSetupCard';
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
  onChangeUC: (value: number) => void;
  onChangeMW: (value: number) => void;
  onToggleTheme: (theme: CameleonTheme) => void;
  isThemeAllowed: (theme: CameleonTheme) => boolean;
  onRequestUnlock: (theme: CameleonTheme) => void;
  t: TFunction;
}

export function SettingsPanel({
  playersCount,
  currentUC,
  currentMW,
  selectedThemes,
  onChangeUC,
  onChangeMW,
  onToggleTheme,
  isThemeAllowed,
  onRequestUnlock,
  t,
}: SettingsPanelProps) {
  const stepperMetrics = { height: 38, radius: T.rSm, paddingH: 0, fontSize: 20 };
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
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

      <GameSetupCard accentColor={T.mint} title={t('common:labels.setup', 'Réglages').toUpperCase()}>
        <GameSetupSection label={t('cameleon:settings.impostors', 'Imposteurs')}>
          <View style={styles.stepperRow}>
            <View style={styles.stepperCol}>
              <Text style={styles.subLabel}>{t('cameleon:settings.undercover', 'Undercover')}</Text>
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
              <Text style={styles.subLabel}>{t('cameleon:settings.mrWhite', 'Mr White')}</Text>
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
          {currentUC + currentMW === 0 && (
            <Text style={styles.warningText}>
              {t(
                'cameleon:settings.needAtLeastOneImpostor',
                'Ajoute au moins 1 imposteur (Undercover ou Mr White) pour lancer la partie.',
              )}
            </Text>
          )}
        </GameSetupSection>
        <GameSetupSection label={t('cameleon:settings.themes', 'Thèmes')}>
          <ThemeGrid<CameleonTheme>
            options={CAMELEON_THEME_OPTIONS.map((opt) => ({
              value: opt.value,
              label: t(opt.labelKey),
              emoji: THEME_META[opt.value].emoji,
              color: opt.color,
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
        </GameSetupSection>
        <DrinkModeToggle accentColor={T.mint} inline />
      </GameSetupCard>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 20 },

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

  subLabel: {
    color: T.inkSoft,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  stepperRow: { flexDirection: 'row', gap: 10 },
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
  warningText: {
    marginTop: 10,
    color: '#C0392B',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  stepBtnText: { color: T.ink, fontSize: 20, fontWeight: '900', lineHeight: 22 },
  stepValue: { color: T.ink, fontSize: 22, fontWeight: '900', width: 36, textAlign: 'center' },

});
