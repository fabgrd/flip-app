import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { T } from '../../constants/flipTokens';
import { FlatChunkyButton } from './FlatChunkyButton';

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

  const scale = useSharedValue(1);
  const shouldPulse = !isMaxReached && playerName.trim().length === 0;

  useEffect(() => {
    if (shouldPulse) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.07, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ),
        -1,
        false,
      );
    } else {
      scale.value = withTiming(1, { duration: 150 });
    }
  }, [shouldPulse]);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputRow, isMaxReached && styles.inputRowDisabled]}>
        <TextInput
          style={styles.input}
          placeholder={t('common:labels.playerName')}
          placeholderTextColor={T.muted}
          value={playerName}
          onChangeText={setPlayerName}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          autoCorrect={false}
          maxLength={20}
          editable={!isMaxReached}
        />
        <Animated.View style={pulseStyle}>
          <FlatChunkyButton
            size="sm"
            color={T.tomato}
            textColor="#fff"
            onPress={handleAdd}
            disabled={!canAdd}
            style={styles.addBtn}
          >
            {t('common:buttons.addPlus')}
          </FlatChunkyButton>
        </Animated.View>
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

  addBtn: { marginRight: 0, marginBottom: 0 },

  limitText: {
    color: T.muted,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center',
  },
});
