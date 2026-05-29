import { TFunction } from 'i18next';
import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { ChunkyButton } from '../../../components/common/ChunkyButton';
import { PopModal } from '../../../components/common/PopModal';
import { T } from '../../../constants/flipTokens';

interface MrWhiteGuessModalProps {
  visible: boolean;
  name?: string;
  color?: string;
  guess: string;
  onChangeGuess: (g: string) => void;
  onSubmit: () => void;
  t: TFunction;
}

export function MrWhiteGuessModal({
  visible,
  name,
  color,
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
      color={color}
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
      <ChunkyButton
        size="sm"
        color={T.ink}
        textColor="#fff"
        shadowColor={T.mint}
        metrics={{ fontSize: 16 }}
        onPress={onSubmit}
        disabled={guess.trim().length === 0}
        style={styles.primaryBtn}
      >
        {t('cameleon:actions.submit', 'Soumettre')}
      </ChunkyButton>
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
  primaryBtn: { marginTop: 12 },
});
