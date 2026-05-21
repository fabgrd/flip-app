import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { T } from '../../constants/flipTokens';
import { useDrinksMode } from '../../hooks';
import { usePaywall } from '../../paywall';

interface DrinkModeToggleProps {
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

export function DrinkModeToggle({
  accentColor = T.tomato,
  style,
  compact = false,
}: DrinkModeToggleProps) {
  const { t } = useTranslation();
  const drinks = useDrinksMode();
  const { open: openPaywall } = usePaywall();

  const handleToggle = (value: boolean) => {
    if (!drinks.available) {
      openPaywall('drinks_mode');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    drinks.setEnabled(value);
  };

  const handleRowPress = () => {
    if (!drinks.available) openPaywall('drinks_mode');
  };

  return (
    <TouchableOpacity
      activeOpacity={drinks.available ? 1 : 0.85}
      disabled={drinks.available}
      onPress={handleRowPress}
      style={[styles.card, compact && styles.cardCompact, style]}
    >
      <View style={[styles.iconWrap, { backgroundColor: accentColor }]}>
        <MaterialCommunityIcons name="glass-mug-variant" size={18} color="#fff" />
      </View>
      <View style={styles.textWrap}>
        <View style={styles.labelLine}>
          <Text style={styles.label}>{t('settings:drinks.label')}</Text>
          {!drinks.available && (
            <View style={styles.proBadge}>
              <Feather name="lock" size={9} color="#fff" />
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
        </View>
        {!compact && (
          <Text style={styles.description} numberOfLines={2}>
            {drinks.available ? t('settings:drinks.description') : t('settings:drinks.lockedHint')}
          </Text>
        )}
      </View>
      <Switch
        value={drinks.enabled}
        onValueChange={handleToggle}
        trackColor={{ false: T.bgAlt, true: accentColor }}
        thumbColor={T.ink}
        ios_backgroundColor={T.bgAlt}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    padding: 14,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardCompact: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: T.rMd,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1, gap: 2 },
  labelLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { color: T.ink, fontSize: 15, fontWeight: '900', letterSpacing: -0.2 },
  description: { color: T.inkSoft, fontSize: 11, lineHeight: 15 },
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
