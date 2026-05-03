import { TFunction } from 'i18next';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { PopModal } from '../../../components/common/PopModal';
import { T } from '../../../constants/flipTokens';

interface MrWhiteGuessModalProps {
  visible: boolean;
  name?: string;
  avatar?: string;
  guess: string;
  onChangeGuess: (g: string) => void;
  onSubmit: () => void;
  t: TFunction;
}

export function MrWhiteGuessModal({
  visible,
  name,
  avatar,
  guess,
  onChangeGuess,
  onSubmit,
  t,
}: MrWhiteGuessModalProps) {
  return (
    <PopModal
      visible={visible}
      title={t('cameleon:mrWhite.guessTitle')}
      name={name}
      avatar={avatar}
    >
      <Text style={styles.prompt}>{t('cameleon:mrWhite.guessPrompt')}</Text>
      <TextInput
        style={styles.input}
        value={guess}
        onChangeText={onChangeGuess}
        placeholder={t('cameleon:mrWhite.placeholder')}
        placeholderTextColor={T.muted}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
      <TouchableOpacity
        style={[styles.primaryBtn, guess.trim().length === 0 && styles.btnDisabled]}
        onPress={onSubmit}
        disabled={guess.trim().length === 0}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryBtnText}>{t('cameleon:actions.submit', 'Soumettre')}</Text>
      </TouchableOpacity>
    </PopModal>
  );
}

const styles = StyleSheet.create({
  prompt: { color: T.inkSoft, fontSize: 15, marginTop: 8, textAlign: 'center' },
  input: {
    backgroundColor: T.bg,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rSm,
    marginTop: 14,
    minWidth: 220,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: T.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: T.ink,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 28,
    shadowColor: T.mint,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: -0.3 },
  btnDisabled: { opacity: 0.4 },
});
