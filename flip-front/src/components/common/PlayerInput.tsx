import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { T } from '../../constants/flipTokens';

interface PlayerInputProps {
  onAddPlayer: (name: string) => boolean;
  maxPlayers: number;
  currentPlayerCount: number;
}

export function PlayerInput({ onAddPlayer, maxPlayers, currentPlayerCount }: PlayerInputProps) {
  const [playerName, setPlayerName] = useState('');
  const { t } = useTranslation();

  const handleAdd = () => {
    const trimmed = playerName.trim();
    if (!trimmed) {
      Alert.alert(t('errors.playerNameRequired'));
      return;
    }
    if (currentPlayerCount >= maxPlayers) {
      Alert.alert(t('errors.playerLimitReached', { maxPlayers }));
      return;
    }
    const success = onAddPlayer(trimmed);
    if (success) {
      setPlayerName('');
    } else {
      Alert.alert(t('errors.playerNameAlreadyExists'));
    }
  };

  const isMaxReached = currentPlayerCount >= maxPlayers;
  const canAdd = !isMaxReached && playerName.trim().length > 0;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputRow, isMaxReached && styles.inputRowDisabled]}>
        <TextInput
          style={styles.input}
          placeholder="Prénom du joueur"
          placeholderTextColor={T.muted}
          value={playerName}
          onChangeText={setPlayerName}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          maxLength={20}
          editable={!isMaxReached}
        />
        <TouchableOpacity
          style={[styles.addBtn, !canAdd && styles.addBtnDisabled]}
          onPress={handleAdd}
          disabled={!canAdd}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>Ajouter +</Text>
        </TouchableOpacity>
      </View>
      {isMaxReached && (
        <Text style={styles.limitText}>{t('errors.playerLimitReached', { maxPlayers })}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 8 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    padding: 6,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  inputRowDisabled: { opacity: 0.5 },

  input: {
    flex: 1,
    color: T.ink,
    fontSize: 17,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  addBtn: {
    backgroundColor: T.ink,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rSm,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addBtnDisabled: { opacity: 0.4 },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '900' },

  limitText: {
    color: T.muted,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center',
  },
});
