import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

interface ActionBarProps {
  isVote: boolean;
  selectedForElimination?: string | null;
  onConfirmElimination: () => void;
  onBeginVote: () => void;
  t: (key: string, opts?: any) => string;
}

export function ActionBar({
  isVote,
  selectedForElimination,
  onConfirmElimination,
  onBeginVote,
  t,
}: ActionBarProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      {isVote ? (
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            { backgroundColor: theme.colors.primary },
            !selectedForElimination && styles.btnDisabled,
          ]}
          onPress={onConfirmElimination}
          disabled={!selectedForElimination}
        >
          <Text style={[styles.primaryBtnText, { color: theme.colors.text.white }]}>
            {t('cameleon:actions.eliminate')}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.secondaryBtn,
            { backgroundColor: theme.colors.background, borderColor: theme.colors.primary },
          ]}
          onPress={onBeginVote}
        >
          <Text style={[styles.secondaryBtnText, { color: theme.colors.primary }]}>
            {t('cameleon:actions.goToVote')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btnDisabled: { opacity: 0.5 },
  container: { paddingBottom: 16, paddingHorizontal: 12, paddingTop: 8 },
  primaryBtn: { alignItems: 'center', borderRadius: 12, paddingVertical: 14 },
  primaryBtnText: { fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    paddingVertical: 12,
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '600' },
});
