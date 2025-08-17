import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../../contexts/ThemeContext';

interface RevealCardProps {
  name: string;
  roleLabel: string;
  secretWord: string | null;
  onNext: () => void;
  t: TFunction;
}

export function RevealCard({ name, roleLabel, secretWord, onNext, t }: RevealCardProps) {
  const { theme } = useTheme();
  const rotation = useSharedValue(0);
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotation.value, [0, 1], [0, 180])}deg` }],
    backfaceVisibility: 'hidden',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotation.value, [0, 1], [180, 360])}deg` }],
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }));

  const handleFlip = () => {
    if (isAnimating) return;

    if (!flipped) {
      setIsAnimating(true);
      rotation.value = withTiming(1, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(setIsAnimating)(false);
          runOnJS(setFlipped)(true);
        }
      });
    } else {
      setIsAnimating(true);
      onNext();
      rotation.value = 0;
      setFlipped(false);
      setTimeout(() => setIsAnimating(false), 250);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
        ]}
      >
        <Animated.View style={[styles.faceContainer, frontStyle]}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            {t('cameleon:reveal.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            {t('cameleon:reveal.subtitle')}
          </Text>
          <Text style={[styles.name, { color: theme.colors.primary }]}>{name}</Text>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { backgroundColor: theme.colors.primary },
              isAnimating && styles.btnDisabled,
            ]}
            onPress={handleFlip}
            disabled={isAnimating}
          >
            <Text style={[styles.primaryBtnText, { color: theme.colors.text.white }]}>
              {t('cameleon:actions.reveal')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.faceContainer, backStyle]}>
          {secretWord === null ? (
            <>
              <Text style={[styles.mrWhiteLabel, { color: theme.colors.primary }]}>
                {roleLabel}
              </Text>
              <Text style={[styles.mrWhiteWarning, { color: theme.colors.text.secondary }]}>
                {t('cameleon:reveal.mrWhiteWarning')}
              </Text>
            </>
          ) : (
            <View
              style={[
                styles.wordBadge,
                { backgroundColor: theme.colors.secondary, borderColor: theme.colors.accent },
              ]}
            >
              <Text style={[styles.wordText, { color: theme.colors.text.white }]}>
                {secretWord}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { backgroundColor: theme.colors.primary },
              isAnimating && styles.btnDisabled,
            ]}
            onPress={handleFlip}
            disabled={isAnimating}
          >
            <Text style={[styles.primaryBtnText, { color: theme.colors.text.white }]}>
              {t('common:buttons.continue')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnDisabled: { opacity: 0.6 },
  card: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 5,
    height: 320,
    justifyContent: 'center',
    maxWidth: 460,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    width: '92%',
  },
  faceContainer: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    padding: 16,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  mrWhiteLabel: { fontSize: 24, fontWeight: '900', marginBottom: 6 },
  mrWhiteWarning: { fontSize: 16, marginBottom: 16, paddingHorizontal: 16, textAlign: 'center' },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  primaryBtn: { borderRadius: 12, marginTop: 8, paddingHorizontal: 20, paddingVertical: 12 },
  primaryBtnText: { fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 16, textAlign: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  wordBadge: {
    borderRadius: 16,
    borderWidth: 3,
    elevation: 6,
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingVertical: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    transform: [{ rotate: '-1.5deg' }],
  },
  wordText: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  wrapper: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
});
