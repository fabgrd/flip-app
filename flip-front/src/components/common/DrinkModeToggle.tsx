import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { T } from '../../constants/flipTokens';
import { useDrinksMode } from '../../hooks';
import { usePaywall } from '../../paywall';
import { BeerMugIcon } from '../icons/BeerMugIcon';
import { ToggleSwitch } from './ToggleSwitch';

interface DrinkModeToggleProps {
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function DrinkModeToggle({ accentColor = T.mint, style }: DrinkModeToggleProps) {
  const { t } = useTranslation();
  const drinks = useDrinksMode();
  const { open: openPaywall } = usePaywall();

  const handleToggle = () => {
    if (!drinks.available) {
      openPaywall('drinks_mode');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    drinks.setEnabled(!drinks.enabled);
  };

  const handleRowPress = () => {
    if (!drinks.available) openPaywall('drinks_mode');
  };

  return (
    <TouchableOpacity
      activeOpacity={drinks.available ? 1 : 0.85}
      disabled={drinks.available}
      onPress={handleRowPress}
      style={[s.card, style]}
    >
      <BeerMugIcon size={28} />
      <View style={s.labelWrap}>
        <Text style={s.label}>{t('settings:drinks.label', 'Gorgées')}</Text>
        {!drinks.available && (
          <View style={s.proBadge}>
            <Feather name="lock" size={9} color={T.lemon} />
            <Text style={s.proBadgeText}>VIP</Text>
          </View>
        )}
      </View>
      <ToggleSwitch
        on={drinks.enabled}
        onToggle={handleToggle}
        activeColor={accentColor}
        disabled={!drinks.available}
      />
    </TouchableOpacity>
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
  labelWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { color: T.ink, fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  proBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
});
