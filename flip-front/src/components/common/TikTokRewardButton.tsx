import { Feather, FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { T } from '../../constants/flipTokens';
import { supabase } from '../../lib/supabase';
import { FlatChunkyButton } from './FlatChunkyButton';

const LIKES_GOAL = 1000;

export function TikTokRewardButton() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [link, setLink] = useState('');
  const [handle, setHandle] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const canSubmit = link.trim().length > 0 && handle.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || sending) return;
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-suggestion', {
        body: {
          game: 'TikTok reward',
          suggestion: `Lien: ${link.trim()} — Contact: ${handle.trim()}`,
        },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (e) {
      Alert.alert(t('settings:tiktok.errorTitle'), t('settings:tiktok.errorDesc'));
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setLink('');
    setHandle('');
    setSubmitted(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.triggerRow}
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.triggerIcon}>
          <FontAwesome5 name="tiktok" size={20} color="#fff" />
        </View>
        <View style={styles.triggerTextWrap}>
          <Text style={styles.triggerLabel}>{t('settings:tiktok.label')}</Text>
          <Text style={styles.triggerHint}>{t('settings:tiktok.hint')}</Text>
        </View>
        <Feather name="chevron-right" size={18} color={T.muted} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          style={styles.overlay}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} />
          <Animated.View
            entering={ZoomIn.duration(200)}
            exiting={ZoomOut.duration(150)}
            style={styles.card}
          >
            <View style={[styles.cardHeader, { backgroundColor: T.ink }]}>
              <View style={styles.cardHeaderTitle}>
                <FontAwesome5 name="tiktok" size={18} color="#fff" />
                <Text style={styles.cardTitle}>{t('settings:tiktok.title')}</Text>
              </View>
              <FlatChunkyButton
                size="xs"
                square
                color={T.paper}
                textColor={T.ink}
                metrics={{ height: 30, radius: 9, paddingH: 0, fontSize: 13 }}
                onPress={handleClose}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </FlatChunkyButton>
            </View>

            {submitted ? (
              <View style={styles.successContent}>
                <Text style={styles.successEmoji}>🎉</Text>
                <Text style={styles.successTitle}>{t('settings:tiktok.successTitle')}</Text>
                <Text style={styles.successDesc}>{t('settings:tiktok.successDesc')}</Text>
                <FlatChunkyButton
                  size="sm"
                  color={T.ink}
                  textColor="#fff"
                  style={styles.doneBtn}
                  onPress={handleClose}
                >
                  {t('settings:tiktok.close')}
                </FlatChunkyButton>
              </View>
            ) : (
              <ScrollView
                contentContainerStyle={styles.formContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.rewardBanner}>
                  <Text style={styles.rewardBannerText}>{t('settings:tiktok.reward')}</Text>
                </View>

                <Text style={styles.pitch}>{t('settings:tiktok.pitch')}</Text>

                <View style={styles.steps}>
                  {[1, 2, 3].map((n) => (
                    <View key={n} style={styles.stepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeText}>{n}</Text>
                      </View>
                      <Text style={styles.stepText}>
                        {t(`settings:tiktok.steps.${n}`, { likes: LIKES_GOAL })}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
                  {t('settings:tiktok.linkLabel')}
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={link}
                  onChangeText={setLink}
                  placeholder={t('settings:tiktok.linkPlaceholder')}
                  placeholderTextColor={T.muted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  returnKeyType="next"
                />

                <Text style={[styles.sectionLabel, { marginTop: 14 }]}>
                  {t('settings:tiktok.handleLabel')}
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={handle}
                  onChangeText={setHandle}
                  placeholder={t('settings:tiktok.handlePlaceholder')}
                  placeholderTextColor={T.muted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  blurOnSubmit
                  onSubmitEditing={() => Keyboard.dismiss()}
                />

                <FlatChunkyButton
                  size="sm"
                  color={canSubmit ? T.ink : T.muted}
                  textColor="#fff"
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                  disabled={!canSubmit || sending}
                >
                  {sending ? <ActivityIndicator color="#fff" /> : t('settings:tiktok.submit')}
                </FlatChunkyButton>
              </ScrollView>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  triggerIcon: {
    width: 36,
    height: 36,
    borderRadius: T.rSm,
    backgroundColor: T.ink,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerTextWrap: { flex: 1, gap: 2 },
  triggerLabel: { color: T.ink, fontSize: 16, fontWeight: '900' },
  triggerHint: { color: T.inkSoft, fontSize: 12, lineHeight: 16 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24,22,19,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: T.paper,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rLg,
    width: '100%',
    maxHeight: '85%',
    overflow: 'hidden',
    shadowColor: T.ink,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: T.ink,
  },
  cardHeaderTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  closeBtnText: { color: T.ink, fontSize: 13, fontWeight: '900' },

  formContent: { padding: 18, gap: 8 },

  rewardBanner: {
    alignSelf: 'flex-start',
    backgroundColor: T.lemon,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  rewardBannerText: { color: T.ink, fontSize: 13, fontWeight: '900', letterSpacing: -0.2 },

  pitch: { color: T.inkSoft, fontSize: 14, lineHeight: 20, marginTop: 4 },

  steps: { gap: 10, marginTop: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  stepText: { flex: 1, color: T.ink, fontSize: 14, fontWeight: '600', lineHeight: 18 },

  sectionLabel: {
    color: T.ink,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  textInput: {
    backgroundColor: T.bg,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    padding: 14,
    fontSize: 15,
    color: T.ink,
    fontWeight: '500',
  },

  submitBtn: { alignSelf: 'center', minWidth: 200, marginTop: 16 },

  successContent: { alignItems: 'center', padding: 32, gap: 12 },
  successEmoji: { fontSize: 48 },
  successTitle: {
    color: T.ink,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  successDesc: { color: T.inkSoft, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  doneBtn: { marginTop: 8, minWidth: 180 },
});
