import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants';
import { useTheme } from '../../../contexts/ThemeContext';

interface ActionBarProps {
    isVote: boolean;
    selectedForElimination?: string | null;
    onConfirmElimination: () => void;
    onBeginVote: () => void;
    t: (key: string, opts?: any) => string;
}

export function ActionBar({ isVote, selectedForElimination, onConfirmElimination, onBeginVote, t }: ActionBarProps) {
    const { theme } = useTheme();
    return (
        <View style={styles.container}>
            {isVote ? (
                <TouchableOpacity
                    style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }, !selectedForElimination && styles.btnDisabled]}
                    onPress={onConfirmElimination}
                    disabled={!selectedForElimination}
                >
                    <Text style={[styles.primaryBtnText, { color: theme.colors.text.white }]}>{t('cameleon:actions.eliminate')}</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary }]} onPress={onBeginVote}>
                    <Text style={[styles.secondaryBtnText, { color: theme.colors.primary }]}>{t('cameleon:actions.goToVote')}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 16 },
    primaryBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    primaryBtnText: { fontSize: 16, fontWeight: 'bold' },
    secondaryBtn: { marginTop: 8, borderWidth: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    secondaryBtnText: { fontSize: 16, fontWeight: '600' },
    btnDisabled: { opacity: 0.5 },
}); 