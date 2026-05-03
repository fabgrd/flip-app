import { TFunction } from 'i18next';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { T } from '../../../constants/flipTokens';

interface ActionBarProps {
  isVote: boolean;
  selectedForElimination?: string | null;
  onConfirmElimination: () => void;
  onBeginVote: () => void;
  t: TFunction;
}

export function ActionBar({
  isVote,
  selectedForElimination,
  onConfirmElimination,
  onBeginVote,
  t,
}: ActionBarProps) {
  return (
    <View style={styles.container}>
      {isVote ? (
        <TouchableOpacity
          style={[styles.primaryBtn, !selectedForElimination && styles.btnDisabled]}
          onPress={onConfirmElimination}
          disabled={!selectedForElimination}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {t('cameleon:actions.eliminate', 'Valider le vote')}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.secondaryBtn} onPress={onBeginVote} activeOpacity={0.85}>
          <Text style={styles.secondaryBtnText}>
            {t('cameleon:actions.goToVote', 'Passer au vote')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: T.bg,
    borderTopWidth: 2,
    borderTopColor: `${T.ink}20`,
  },

  primaryBtn: {
    backgroundColor: T.ink,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: T.tomato,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },

  secondaryBtn: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  secondaryBtnText: { color: T.ink, fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },

  btnDisabled: { opacity: 0.4 },
});
