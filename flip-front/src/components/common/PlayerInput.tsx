import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants';
import { useTranslation } from 'react-i18next';

interface PlayerInputProps {
    onAddPlayer: (name: string) => boolean;
    maxPlayers: number;
    currentPlayerCount: number;
}

export function PlayerInput({ onAddPlayer, maxPlayers, currentPlayerCount }: PlayerInputProps) {
    const [playerName, setPlayerName] = useState('');
    const { t } = useTranslation();
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
            <Text style={styles.title}>{t('labels.addPlayer')}</Text>

            <View style={[styles.inputContainer, isMaxReached && styles.inputDisabled]}>
                <TextInput
                    style={styles.input}
                    placeholder={t('labels.playerName')}
                    placeholderTextColor={Colors.text.light}
                    value={playerName}
                    onChangeText={setPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                    maxLength={20}
                    editable={!isMaxReached}
                />

                <TouchableOpacity
                    style={[styles.addButton, isMaxReached && styles.addButtonDisabled]}
                    onPress={handleAddPlayer}
                    disabled={isMaxReached || !playerName.trim()}
                >
                    <Ionicons
                        name="add"
                        size={24}
                        color={isMaxReached || !playerName.trim() ? Colors.text.light : Colors.text.white}
                    />
                </TouchableOpacity>
            </View>

            {isMaxReached && (
                <Text style={styles.limitText}>
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
        color: Colors.text.primary,
        marginBottom: 12,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
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
        color: Colors.text.primary,
        paddingVertical: 16,
    },

    addButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },

    addButtonDisabled: {
        backgroundColor: Colors.surface,
    },

    limitText: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginTop: 8,
        textAlign: 'center',
        fontStyle: 'italic',
    },
}); 