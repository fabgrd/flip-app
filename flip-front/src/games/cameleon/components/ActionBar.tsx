import { TFunction } from 'i18next';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ChunkyButton } from '../../../components/common/ChunkyButton';
import { T } from '../../../constants/flipTokens';

interface ActionBarProps {
  isVote: boolean;
  selectedForElimination?: string | null;
  onConfirmElimination: () => void;
  onBeginVote: () => void;
  t: TFunction;
}

export function ActionBar({
  isVote,
  selectedForElimination,
  onConfirmElimination,
  onBeginVote,
  t,
}: ActionBarProps) {
  return (
    <View style={styles.container}>
      {isVote ? (
        <ChunkyButton
          full
          size="md"
          color={T.ink}
          textColor="#fff"
          shadowColor={T.tomato}
          metrics={{ fontSize: 17 }}
          onPress={onConfirmElimination}
          disabled={!selectedForElimination}
        >
          {t('cameleon:actions.eliminate', 'Valider le vote')}
        </ChunkyButton>
      ) : (
        <ChunkyButton
          full
          size="md"
          color={T.paper}
          textColor={T.ink}
          shadowColor={T.ink}
          metrics={{ fontSize: 17 }}
          onPress={onBeginVote}
        >
          {t('cameleon:actions.goToVote', 'Passer au vote')}
        </ChunkyButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: T.bg,
    borderTopWidth: 2,
    borderTopColor: `${T.ink}20`,
  },
});
