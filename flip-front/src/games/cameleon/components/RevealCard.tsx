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
import { T } from '../../../constants/flipTokens';

interface RevealCardProps {
  name: string;
  roleLabel: string;
  secretWord: string | null;
  onNext: () => void;
  t: TFunction;
}

export function RevealCard({ name, roleLabel, secretWord, onNext, t }: RevealCardProps) {
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
      <View style={styles.cardOuter}>
        {/* FRONT — handoff screen: dark background */}
        <Animated.View style={[styles.face, styles.frontFace, frontStyle]}>
          {/* Player initial avatar */}
          <View style={styles.playerAvatar}>
            <Text style={styles.playerAvatarText}>{name[0]?.toUpperCase() ?? '?'}</Text>
          </View>

          <Text style={styles.handoffTitle}>{name},</Text>
          <Text style={styles.handoffSubtitle}>passe le tel</Text>

          <Text style={styles.handoffHint}>Trouve un coin discret avant d'appuyer.</Text>

          <TouchableOpacity
            style={[styles.revealBtn, isAnimating && styles.btnDisabled]}
            onPress={handleFlip}
            disabled={isAnimating}
            activeOpacity={0.85}
          >
            <Text style={styles.revealBtnText}>
              {t('cameleon:actions.reveal', 'Révéler mon rôle')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* BACK — role reveal */}
        <Animated.View style={[styles.face, styles.backFace, backStyle]}>
          {secretWord === null ? (
            /* Cameleon reveal */
            <View style={styles.backContent}>
              <View style={styles.cameleonBadge}>
                <Text style={styles.cameleonBadgeText}>TU ES LE CAMÉLÉON</Text>
              </View>
              <View style={styles.cameleonCard}>
                <Text style={styles.cameleonCardLabel}>CATÉGORIE</Text>
                <Text style={styles.cameleonCardRole}>{roleLabel}</Text>
                <Text style={styles.cameleonCardHint}>
                  Tu ne connais pas le mot. Bluff comme tu peux : un indice plausible, pas trop
                  précis.
                </Text>
              </View>
            </View>
          ) : (
            /* Word reveal */
            <View style={styles.backContent}>
              <Text style={styles.wordCategory}>{roleLabel.toUpperCase()}</Text>
              <View style={styles.wordCard}>
                <Text style={styles.wordText}>{secretWord}</Text>
              </View>
              <Text style={styles.wordHint}>Donne un indice ni trop évident, ni trop vague.</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.nextBtn, isAnimating && styles.btnDisabled]}
            onPress={handleFlip}
            disabled={isAnimating}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>
              {t('common:buttons.continue', "J'ai vu — suivant")}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 16 },

  cardOuter: {
    width: '100%',
    height: 420,
    maxWidth: 400,
    position: 'relative',
  },

  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: T.rLg,
    borderWidth: 2,
    borderColor: T.ink,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.ink,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },

  frontFace: {
    backgroundColor: T.ink,
  },

  backFace: {
    backgroundColor: T.paper,
  },

  // Front content
  playerAvatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: T.tomato,
    borderWidth: 2,
    borderColor: T.paper,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: T.tomato,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  playerAvatarText: { color: '#fff', fontSize: 32, fontWeight: '900' },

  handoffTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1.2,
    textAlign: 'center',
  },
  handoffSubtitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1.2,
    textAlign: 'center',
    marginBottom: 14,
  },
  handoffHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
    marginBottom: 28,
  },

  revealBtn: {
    backgroundColor: T.lemon,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignSelf: 'stretch',
    alignItems: 'center',
    shadowColor: T.lemon,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  revealBtnText: { color: T.ink, fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },

  // Back content
  backContent: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },

  cameleonBadge: {
    backgroundColor: T.tomato,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
    transform: [{ rotate: '-3deg' }],
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  cameleonBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  cameleonCard: {
    backgroundColor: T.ink,
    borderRadius: T.rMd,
    borderWidth: 2,
    borderColor: T.ink,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  cameleonCardLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  cameleonCardRole: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  cameleonCardHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },

  wordCategory: {
    color: T.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  wordCard: {
    backgroundColor: T.lemon,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 24,
    paddingHorizontal: 28,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: T.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  wordText: {
    color: T.ink,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2,
    textAlign: 'center',
    lineHeight: 56,
  },
  wordHint: {
    color: T.inkSoft,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
    marginBottom: 8,
  },

  nextBtn: {
    backgroundColor: T.ink,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignSelf: 'stretch',
    alignItems: 'center',
    shadowColor: T.mint,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  nextBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },

  btnDisabled: { opacity: 0.4 },
});
