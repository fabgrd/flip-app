import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../../constants/flipTokens';
import { getPremiumCodeAdapter, useEntitlements } from '../../entitlements';

export interface RedeemCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RedeemCodeModal({ visible, onClose, onSuccess }: RedeemCodeModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { refresh } = useEntitlements();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const reset = () => {
    setCode('');
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);
    if (!code.trim()) {
      setError(t('paywall:redeem.errors.empty'));
      return;
    }
    setLoading(true);
    const adapter = getPremiumCodeAdapter();
    let result: { success: true } | { success: false; reason: string };
    try {
      result = await adapter.redeem(code);
    } catch {
      result = { success: false, reason: 'network' };
    }
    if (!mounted.current) return;
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      try {
        await refresh();
      } catch {
        /* noop */
      }
      setTimeout(() => {
        if (!mounted.current) return;
        onSuccess?.();
        onClose();
      }, 1200);
      return;
    }

    const key = `paywall:redeem.errors.${result.reason}`;
    const translated = t(key);
    setError(translated === key ? t('paywall:redeem.errors.unknown') : translated);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <Pressable
            style={[styles.card, { marginBottom: insets.bottom + 24 }]}
            onPress={(e) => e.stopPropagation()}
          >
          <Text style={styles.title}>{t('paywall:redeem.title')}</Text>
          <Text style={styles.subtitle}>{t('paywall:redeem.subtitle')}</Text>

          <TextInput
            style={styles.input}
            value={code}
            onChangeText={(v) => {
              setCode(v.toUpperCase());
              setError(null);
            }}
            placeholder={t('paywall:redeem.placeholder')}
            placeholderTextColor="rgba(255,255,255,0.3)"
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!loading && !success}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          {error && <Text style={styles.error}>{error}</Text>}
          {success && <Text style={styles.success}>{t('paywall:redeem.success')}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnGhost]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.btnGhostText}>{t('paywall:redeem.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, (loading || success) && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={loading || success}
            >
              {loading ? (
                <ActivityIndicator color={T.ink} />
              ) : (
                <Text style={styles.btnPrimaryText}>{t('paywall:redeem.submit')}</Text>
              )}
            </TouchableOpacity>
          </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#1A1613',
    borderRadius: T.rLg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4, marginBottom: 16 },
  input: {
    height: 52,
    borderRadius: T.rMd,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  error: { color: T.tomato, fontSize: 13, marginTop: 10, textAlign: 'center', fontWeight: '600' },
  success: { color: T.lemon, fontSize: 14, marginTop: 10, textAlign: 'center', fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: T.rMd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  btnGhostText: { color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 14 },
  btnPrimary: { backgroundColor: T.lemon, borderWidth: 2, borderColor: T.ink },
  btnPrimaryText: { color: T.ink, fontWeight: '900', fontSize: 15 },
  btnDisabled: { opacity: 0.6 },
});
