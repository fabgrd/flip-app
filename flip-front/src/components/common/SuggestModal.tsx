import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { GAMES } from '../../config/games.config';
import { T } from '../../constants/flipTokens';
import { FlatChunkyButton } from './FlatChunkyButton';

export function SuggestButton() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    const game = selectedGameId ? GAMES.find((g) => g.id === selectedGameId) : null;
    const gameName = game ? t(game.titleKey) : t('settings:suggest.allGames');
    const subject = encodeURIComponent(t('settings:suggest.emailSubject', { game: gameName }));
    const body = encodeURIComponent(
      t('settings:suggest.emailBody', { game: gameName, suggestion: text.trim() }),
    );
    Linking.openURL(`mailto:hello@flipgame.app?subject=${subject}&body=${body}`);
    setSubmitted(true);
  };

  const handleClose = () => {
    setVisible(false);
    setSelectedGameId(null);
    setText('');
    setSubmitted(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.triggerRow} onPress={() => setVisible(true)} activeOpacity={0.85}>
        <View style={styles.triggerIcon}>
          <Text style={styles.triggerEmoji}>💡</Text>
        </View>
        <View style={styles.triggerTextWrap}>
          <Text style={styles.triggerLabel}>{t('settings:suggest.label')}</Text>
          <Text style={styles.triggerHint}>{t('settings:suggest.hint')}</Text>
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
            <View style={[styles.cardHeader, { backgroundColor: T.lemon }]}>
              <Text style={styles.cardTitle}>{t('settings:suggest.title')}</Text>
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
                <Text style={styles.successTitle}>{t('settings:suggest.successTitle')}</Text>
                <Text style={styles.successDesc}>{t('settings:suggest.successDesc')}</Text>
                <FlatChunkyButton
                  size="sm"
                  color={T.ink}
                  textColor="#fff"
                  style={styles.doneBtn}
                  onPress={handleClose}
                >
                  {t('settings:suggest.close')}
                </FlatChunkyButton>
              </View>
            ) : (
              <ScrollView
                contentContainerStyle={styles.formContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.sectionLabel}>{t('settings:suggest.gameLabel')}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.gameChips}
                >
                  {GAMES.map((game) => {
                    const active = selectedGameId === game.id;
                    return (
                      <TouchableOpacity
                        key={game.id}
                        style={[styles.gameChip, active && styles.gameChipActive]}
                        onPress={() => setSelectedGameId(active ? null : game.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.gameChipText, active && styles.gameChipTextActive]}>
                          {t(game.titleKey)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
                  {t('settings:suggest.questionLabel')}
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={text}
                  onChangeText={setText}
                  placeholder={t('settings:suggest.placeholder')}
                  placeholderTextColor={T.muted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  returnKeyType="done"
                  blurOnSubmit
                  onSubmitEditing={() => Keyboard.dismiss()}
                />

                <FlatChunkyButton
                  size="sm"
                  color={text.trim() ? T.ink : T.muted}
                  textColor="#fff"
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                  disabled={!text.trim()}
                >
                  {t('settings:suggest.submit')}
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
    backgroundColor: T.lemon,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerEmoji: { fontSize: 18 },
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
  cardTitle: { color: T.ink, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  closeBtnText: { color: T.ink, fontSize: 13, fontWeight: '900' },

  formContent: { padding: 18, gap: 8 },

  sectionLabel: {
    color: T.ink,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  gameChips: { gap: 8, paddingBottom: 4 },
  gameChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: T.rSm,
    borderWidth: 2,
    borderColor: T.ink,
    backgroundColor: T.bg,
  },
  gameChipActive: { backgroundColor: T.ink },
  gameChipText: { color: T.ink, fontSize: 13, fontWeight: '800' },
  gameChipTextActive: { color: '#fff' },

  textInput: {
    backgroundColor: T.bg,
    borderWidth: 2,
    borderColor: T.ink,
    borderRadius: T.rMd,
    padding: 14,
    fontSize: 15,
    color: T.ink,
    minHeight: 100,
    fontWeight: '500',
  },

  submitBtn: { alignSelf: 'center', minWidth: 200, marginTop: 8 },

  successContent: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  successEmoji: { fontSize: 48 },
  successTitle: {
    color: T.ink,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  successDesc: {
    color: T.inkSoft,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  doneBtn: { marginTop: 8, minWidth: 180 },
});
