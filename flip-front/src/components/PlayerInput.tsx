import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
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
      // Feedback haptique lors de l'ajout réussi
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Alert.alert('Erreur', 'Ce prénom existe déjà ou est invalide');
    }
  };

  const canAddPlayer = currentPlayerCount < maxPlayers && inputValue.trim() !== '';

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            GlobalStyles.input,
            styles.input,
            isFocused && GlobalStyles.inputFocused
          ]}
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
          style={[
            styles.addButton,
            !canAddPlayer && styles.addButtonDisabled
          ]}
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
      
      <Text style={styles.counterText}>
        {currentPlayerCount}/{maxPlayers} joueurs
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  
  input: {
    flex: 1,
  },
  
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.button.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.button.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  addButtonDisabled: {
    backgroundColor: Colors.button.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  counterText: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'right',
    marginTop: 5,
  },
}); 