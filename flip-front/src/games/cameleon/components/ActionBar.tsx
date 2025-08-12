import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants';

interface ActionBarProps {
    isVote: boolean;
    selectedForElimination?: string | null;
    onConfirmElimination: () => void;
    onBeginVote: () => void;
    t: (key: string, opts?: any) => string;
}

export function ActionBar({ isVote, selectedForElimination, onConfirmElimination, onBeginVote, t }: ActionBarProps) {
    return (
        <View style={styles.container}>
            {isVote ? (
                <TouchableOpacity
                    style={[styles.primaryBtn, !selectedForElimination && styles.btnDisabled]}
                    onPress={onConfirmElimination}
                    disabled={!selectedForElimination}
                >
                    <Text style={styles.primaryBtnText}>{t('cameleon:actions.eliminate')}</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.secondaryBtn} onPress={onBeginVote}>
                    <Text style={styles.secondaryBtnText}>{t('cameleon:actions.goToVote')}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 16 },
    primaryBtn: { backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    primaryBtnText: { color: Colors.text.white, fontSize: 16, fontWeight: 'bold' },
    secondaryBtn: { marginTop: 8, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    secondaryBtnText: { color: Colors.primary, fontSize: 16, fontWeight: '600' },
    btnDisabled: { opacity: 0.5 },
}); 