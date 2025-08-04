import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, GlobalStyles } from '../constants';

interface PlayerInputProps {
  onAddPlayer: (name: string) => boolean;
  maxPlayers: number;
  currentPlayerCount: number;
}

export function PlayerInput({ onAddPlayer, maxPlayers, currentPlayerCount }: PlayerInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleAddPlayer = () => {
    const trimmedValue = inputValue.trim();

    if (trimmedValue === '') {
      Alert.alert('Erreur', 'Veuillez saisir un prénom');
      return;
    }

    if (currentPlayerCount >= maxPlayers) {
      Alert.alert('Limite atteinte', `Maximum ${maxPlayers} joueurs autorisés`);
      return;
    }

    const success = onAddPlayer(trimmedValue);

    if (success) {
      setInputValue('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Alert.alert('Erreur', 'Ce prénom existe déjà ou est invalide');
    }
  };

  const canAddPlayer = currentPlayerCount < maxPlayers && inputValue.trim() !== '';

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Ajouter un joueur..."
          placeholderTextColor={Colors.text.secondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleAddPlayer}
          maxLength={20}
          autoCorrect={false}
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={[styles.addButton, !canAddPlayer && styles.addButtonDisabled]}
          onPress={handleAddPlayer}
          disabled={!canAddPlayer}
        >
          <Ionicons
            name="add"
            size={24}
            color={canAddPlayer ? Colors.text.white : Colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.text.secondary,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  addButton: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: Colors.button.disabled,
  },
});
