import { TFunction } from 'i18next';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { PopModal } from '../../../components/common/PopModal';
import { useTheme } from '../../../contexts/ThemeContext';

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
  const { theme } = useTheme();
  return (
    <PopModal
      visible={visible}
      title={t('cameleon:mrWhite.guessTitle')}
      name={name}
      avatar={avatar}
    >
      <Text style={[styles.prompt, { color: theme.colors.text.secondary }]}>
        {t('cameleon:mrWhite.guessPrompt')}
      </Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.colors.border, color: theme.colors.text.primary },
        ]}
        value={guess}
        onChangeText={onChangeGuess}
        placeholder={t('cameleon:mrWhite.placeholder')}
        placeholderTextColor={theme.colors.text.light}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
      <TouchableOpacity
        style={[
          styles.primaryBtn,
          { backgroundColor: theme.colors.primary },
          guess.trim().length === 0 && styles.btnDisabled,
        ]}
        onPress={onSubmit}
        disabled={guess.trim().length === 0}
      >
        <Text style={[styles.primaryBtnText, { color: theme.colors.text.white }]}>
          {t('cameleon:actions.submit')}
        </Text>
      </TouchableOpacity>
    </PopModal>
  );
}

const styles = StyleSheet.create({
  btnDisabled: { opacity: 0.5 },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
    minWidth: 220,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryBtn: { alignItems: 'center', borderRadius: 12, marginTop: 8, paddingVertical: 14 },
  primaryBtnText: { fontSize: 16, fontWeight: 'bold' },
  prompt: { fontSize: 15, marginTop: 8, textAlign: 'center' },
});
