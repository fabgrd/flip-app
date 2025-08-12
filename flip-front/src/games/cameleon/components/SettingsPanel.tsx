import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../../constants';

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
    return (
        <View style={[styles.box, { flex: 1 }]}>
            <Text style={styles.title}>{t('cameleon:settings.title')}</Text>
            <Text style={styles.subtitle}>{t('cameleon:settings.subtitle', { count: playersCount })}</Text>

            <Text style={styles.info}>{t('cameleon:counters.remainingImpostors', { count: plannedImpostors })} · Max {maxImpostors}</Text>

            <View style={styles.row}>
                <Text style={styles.label}>{t('cameleon:settings.undercover')}</Text>
                <View style={styles.stepper}>
                    <TouchableOpacity onPress={() => onChangeUC(Math.max(0, currentUC - 1))} style={styles.stepperBtn}>
                        <Text style={styles.stepperBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{currentUC}</Text>
                    <TouchableOpacity onPress={() => onChangeUC(currentUC + 1)} style={styles.stepperBtn}>
                        <Text style={styles.stepperBtnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>{t('cameleon:settings.mrWhite')}</Text>
                <View style={styles.stepper}>
                    <TouchableOpacity onPress={() => onChangeMW(Math.max(0, currentMW - 1))} style={styles.stepperBtn}>
                        <Text style={styles.stepperBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{currentMW}</Text>
                    <TouchableOpacity onPress={() => onChangeMW(currentMW + 1)} style={styles.stepperBtn}>
                        <Text style={styles.stepperBtnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={[styles.primaryBtn, !canStart && styles.btnDisabled]} onPress={onStart} disabled={!canStart}>
                <Text style={styles.primaryBtnText}>{t('cameleon:actions.reveal')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    box: { margin: 16, padding: 16, backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1, borderColor: '#EDEDED' },
    title: { fontSize: 18, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 14, color: Colors.text.secondary, marginBottom: 8, textAlign: 'center' },
    info: { fontSize: 13, color: Colors.text.secondary, marginBottom: 12, textAlign: 'center' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    label: { fontSize: 16, color: Colors.text.primary, fontWeight: '600' },
    stepper: { flexDirection: 'row', alignItems: 'center' },
    stepperBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E0E0E0' },
    stepperBtnText: { fontSize: 20, color: Colors.text.primary },
    stepperValue: { width: 40, textAlign: 'center', fontSize: 16, color: Colors.text.primary },
    primaryBtn: { backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    primaryBtnText: { color: Colors.text.white, fontSize: 16, fontWeight: 'bold' },
    btnDisabled: { opacity: 0.5 },
}); 