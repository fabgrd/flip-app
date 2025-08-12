import React from 'react';
import { Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { PopModal } from '../../../components/common/PopModal';
import { Colors } from '../../../constants';

interface MrWhiteGuessModalProps {
    visible: boolean;
    name?: string;
    avatar?: string;
    guess: string;
    onChangeGuess: (g: string) => void;
    onSubmit: () => void;
    t: (key: string, opts?: any) => string;
}

export function MrWhiteGuessModal({ visible, name, avatar, guess, onChangeGuess, onSubmit, t }: MrWhiteGuessModalProps) {
    return (
        <PopModal visible={visible} title={t('cameleon:mrWhite.guessTitle')} name={name} avatar={avatar}>
            <Text style={styles.prompt}>{t('cameleon:mrWhite.guessPrompt')}</Text>
            <TextInput
                style={styles.input}
                value={guess}
                onChangeText={onChangeGuess}
                placeholder={t('cameleon:mrWhite.placeholder')}
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
            />
            <TouchableOpacity style={[styles.primaryBtn, guess.trim().length === 0 && styles.btnDisabled]} onPress={onSubmit} disabled={guess.trim().length === 0}>
                <Text style={styles.primaryBtnText}>{t('cameleon:actions.submit')}</Text>
            </TouchableOpacity>
        </PopModal>
    );
}

const styles = StyleSheet.create({
    prompt: { fontSize: 15, color: Colors.text.secondary, textAlign: 'center', marginTop: 8 },
    input: { marginTop: 12, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, minWidth: 220, color: Colors.text.primary },
    primaryBtn: { backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    primaryBtnText: { color: Colors.text.white, fontSize: 16, fontWeight: 'bold' },
    btnDisabled: { opacity: 0.5 },
}); 