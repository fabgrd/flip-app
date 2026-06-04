import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Avatar } from '../../../components/common/Avatar';
import { T } from '../../../constants/flipTokens';

interface RevealCardProps {
  name: string;
  color: string;
  roleLabel: string;
  secretWord: string | null;
  onNext: () => void;
  t: TFunction;
}

export function RevealCard({ name, color, roleLabel, secretWord, onNext, t }: RevealCardProps) {
  const [revealed, setRevealed] = useState(false);
  const frontOpacity = useSharedValue(1);
  const backOpacity = useSharedValue(0);

  const frontStyle = useAnimatedStyle(() => ({ opacity: frontOpacity.value }));
  const backStyle = useAnimatedStyle(() => ({ opacity: backOpacity.value }));

  const handleReveal = () => {
    frontOpacity.value = withTiming(0, { duration: 220 }, (finished) => {
      if (finished) {
        runOnJS(setRevealed)(true);
        backOpacity.value = withTiming(1, { duration: 220 });
      }
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* ── FRONT — handoff ── */}
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.face, styles.frontFace, frontStyle]}
          // @ts-ignore pointerEvents is valid on Animated.View
          pointerEvents={revealed ? 'none' : 'auto'}
        >
          <Avatar name={name} color={color} size={72} />

          <Text style={styles.handoffSubtitle}>{t('cameleon:reveal.handoffTo')}</Text>
          <Text style={styles.handoffTitle}>{name}</Text>
          <Text style={styles.handoffHint}>{t('cameleon:reveal.handoffHint')}</Text>

          <FlipButton color={T.lemon} textColor={T.ink} onPress={handleReveal}>
            {t('cameleon:reveal.revealRole')}
          </FlipButton>
        </Animated.View>

        {/* ── BACK — role reveal ── */}
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.face, styles.backFace, backStyle]}
          // @ts-ignore
          pointerEvents={revealed ? 'auto' : 'none'}
        >
          {secretWord === null ? (
            <View style={styles.backContent}>
              <View style={styles.mrWhiteBadge}>
                <Text style={styles.mrWhiteBadgeText}>{t('cameleon:reveal.youAreMrWhite')}</Text>
              </View>
              <View style={styles.wordCard}>
                <Text style={styles.wordText}>???</Text>
              </View>
              <Text style={styles.wordHint}>{t('cameleon:reveal.mrWhiteHint')}</Text>
            </View>
          ) : (
            <View style={styles.backContent}>
              <View style={styles.wordCard}>
                <Text style={styles.wordText}>{secretWord}</Text>
              </View>
              <Text style={styles.wordHint}>{t('cameleon:reveal.wordHint')}</Text>
            </View>
          )}

          <FlipButton color={T.ink} textColor="#fff" shadowColor={T.mint} onPress={onNext}>
            {t('cameleon:reveal.next')}
          </FlipButton>
        </Animated.View>
      </View>
    </View>
  );
}

// ── Bouton avec effet cartoon press (Pressable inline) ──
function FlipButton({
  onPress,
  color,
  textColor,
  shadowColor = T.ink,
  children,
}: {
  onPress: () => void;
  color: string;
  textColor: string;
  shadowColor?: string;
  children: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: color,
          shadowColor,
          shadowOffset: pressed ? { width: 0, height: 0 } : { width: 4, height: 4 },
          shadowOpacity: pressed ? 0 : 1,
          transform: pressed ? [{ translateX: 4 as number }, { translateY: 4 as number }] : [],
        },
      ]}
    >
      <Text style={[styles.btnText, { color: textColor }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 16 },

  card: {
    width: '100%',
    height: 420,
    maxWidth: 400,
    position: 'relative',
  },

  face: {
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
  frontFace: { backgroundColor: T.ink },
  backFace: { backgroundColor: T.paper },

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

  backContent: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },

  mrWhiteBadge: {
    backgroundColor: T.tomato,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
    transform: [{ rotate: '-3deg' }],
    shadowColor: T.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  mrWhiteBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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

  btn: {
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignSelf: 'stretch',
    alignItems: 'center',
    shadowRadius: 0,
    elevation: 4,
  },
  btnText: { fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
});
