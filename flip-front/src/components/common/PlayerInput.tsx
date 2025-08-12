import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface PlayerInputProps {
    onAddPlayer: (name: string) => boolean;
    maxPlayers: number;
    currentPlayerCount: number;
}

export function PlayerInput({ onAddPlayer, maxPlayers, currentPlayerCount }: PlayerInputProps) {
    const [playerName, setPlayerName] = useState('');
    const { t } = useTranslation();
    const { theme } = useTheme();
    const handleAddPlayer = () => {
        const trimmedName = playerName.trim();

        if (!trimmedName) {
            Alert.alert(t('errors.playerNameRequired'));
            return;
        }

        if (currentPlayerCount >= maxPlayers) {
            Alert.alert(t('errors.playerLimitReached', { maxPlayers }));
            return;
        }

        const success = onAddPlayer(trimmedName);

        if (success) {
            setPlayerName('');
        } else {
            Alert.alert(t('errors.playerNameAlreadyExists'));
        }
    };

    const isMaxReached = currentPlayerCount >= maxPlayers;

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{t('labels.addPlayer')}</Text>

            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }, isMaxReached && styles.inputDisabled]}>
                <TextInput
                    style={[styles.input, { color: theme.colors.text.primary }]}
                    placeholder={t('labels.playerName')}
                    placeholderTextColor={theme.colors.text.light}
                    value={playerName}
                    onChangeText={setPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                    maxLength={20}
                    editable={!isMaxReached}
                />

                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: isMaxReached || !playerName.trim() ? theme.colors.button.disabled : theme.colors.primary }]}
                    onPress={handleAddPlayer}
                    disabled={isMaxReached || !playerName.trim()}
                >
                    <Ionicons
                        name="add"
                        size={24}
                        color={isMaxReached || !playerName.trim() ? theme.colors.text.light : theme.colors.text.white}
                    />
                </TouchableOpacity>
            </View>

            {isMaxReached && (
                <Text style={[styles.limitText, { color: theme.colors.text.secondary }]}>
                    {t('errors.playerLimitReached', { maxPlayers })}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingLeft: 16,
        paddingRight: 4,
        minHeight: 56,
    },

    inputDisabled: {
        opacity: 0.6,
    },

    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 16,
    },

    addButton: {
        borderRadius: 8,
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },

    limitText: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
        fontStyle: 'italic',
    },
}); 