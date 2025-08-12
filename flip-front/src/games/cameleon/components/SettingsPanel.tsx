import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../../constants';
import { useTheme } from '../../../contexts/ThemeContext';

interface SettingsPanelProps {
    playersCount: number;
    currentUC: number;
    currentMW: number;
    maxImpostors: number;
    canStart: boolean;
    onChangeUC: (value: number) => void;
    onChangeMW: (value: number) => void;
    onStart: () => void;
    t: (key: string, opts?: any) => string;
}

export function SettingsPanel({ playersCount, currentUC, currentMW, maxImpostors, canStart, onChangeUC, onChangeMW, onStart, t }: SettingsPanelProps) {
    const plannedImpostors = currentUC + currentMW;
    const { theme } = useTheme();
    return (
        <View style={[styles.box, { flex: 1, backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{t('cameleon:settings.title')}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>{t('cameleon:settings.subtitle', { count: playersCount })}</Text>

            <Text style={[styles.info, { color: theme.colors.text.secondary }]}>{t('cameleon:counters.remainingImpostors', { count: plannedImpostors })} · Max {maxImpostors}</Text>

            <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.text.primary }]}>{t('cameleon:settings.undercover')}</Text>
                <View style={styles.stepper}>
                    <TouchableOpacity onPress={() => onChangeUC(Math.max(0, currentUC - 1))} style={[styles.stepperBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                        <Text style={[styles.stepperBtnText, { color: theme.colors.text.primary }]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.stepperValue, { color: theme.colors.text.primary }]}>{currentUC}</Text>
                    <TouchableOpacity onPress={() => onChangeUC(currentUC + 1)} style={[styles.stepperBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                        <Text style={[styles.stepperBtnText, { color: theme.colors.text.primary }]}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.text.primary }]}>{t('cameleon:settings.mrWhite')}</Text>
                <View style={styles.stepper}>
                    <TouchableOpacity onPress={() => onChangeMW(Math.max(0, currentMW - 1))} style={[styles.stepperBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                        <Text style={[styles.stepperBtnText, { color: theme.colors.text.primary }]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.stepperValue, { color: theme.colors.text.primary }]}>{currentMW}</Text>
                    <TouchableOpacity onPress={() => onChangeMW(currentMW + 1)} style={[styles.stepperBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                        <Text style={[styles.stepperBtnText, { color: theme.colors.text.primary }]}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }, !canStart && styles.btnDisabled]} onPress={onStart} disabled={!canStart}>
                <Text style={[styles.primaryBtnText, { color: theme.colors.text.white }]}>{t('cameleon:actions.reveal')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    box: { margin: 16, padding: 16, borderRadius: 12, borderWidth: 1 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 14, marginBottom: 8, textAlign: 'center' },
    info: { fontSize: 13, marginBottom: 12, textAlign: 'center' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    label: { fontSize: 16, fontWeight: '600' },
    stepper: { flexDirection: 'row', alignItems: 'center' },
    stepperBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    stepperBtnText: { fontSize: 20 },
    stepperValue: { width: 40, textAlign: 'center', fontSize: 16 },
    primaryBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    primaryBtnText: { fontSize: 16, fontWeight: 'bold' },
    btnDisabled: { opacity: 0.5 },
}); 