import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { T } from '../../constants/flipTokens';
import { getPremiumCodeAdapter, useEntitlements } from '../../entitlements';
import {
  purchasePlan,
  restorePurchasesRC,
  type RcPlanId,
} from '../../lib/revenuecat';
import { getPaywallContent } from '../../paywall/paywallContent';
import { PaywallPlanId } from '../../paywall/types';
import {
  BeerMugIcon,
  PaywallDifficultyIcon,
  PaywallGamesIcon,
  PaywallQuestionsIcon,
  PaywallThemesIcon,
} from '../icons';
import { DotBackground } from './DotBackground';
import { RedeemCodeModal } from './RedeemCodeModal';

const BENEFIT_ICONS: Record<string, React.ReactNode> = {
  games: <PaywallGamesIcon size={28} />,
  drink: <BeerMugIcon size={28} />,
  difficulty: <PaywallDifficultyIcon size={28} />,
  themes: <PaywallThemesIcon size={28} />,
  questions: <PaywallQuestionsIcon size={28} />,
};

export interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
}

interface PlanDef {
  id: PaywallPlanId;
  price: string;
  period: string;
  perWeek?: string;
  discountLabel?: string;
}

const PLANS: readonly PlanDef[] = [
  { id: 'weekly', price: '2,99 €', period: '/sem' },
  { id: 'monthly', price: '4,99 €', period: '/mois', perWeek: '1,15 €', discountLabel: '−62%' },
  { id: 'annual', price: '29,99 €', period: '/an', perWeek: '0,58 €', discountLabel: '−80%' },
];

function CrownIcon({ size = 48 }: { size?: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      300,
      withRepeat(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      ),
    );
    return () => cancelAnimation(translateY);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View style={[{ alignItems: 'center', marginBottom: 4 }, animStyle]}>
      <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <Path
          d="M6 36h36V20l-9 6-9-12-9 12-9-6v16z"
          fill={T.lemon}
          stroke={T.ink}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <Rect
          x="6"
          y="34"
          width="36"
          height="6"
          rx="1"
          fill={T.lemon}
          stroke={T.ink}
          strokeWidth="2.5"
        />
        <Circle cx="15" cy="14" r="3" fill={T.lemon} stroke={T.ink} strokeWidth="2" />
        <Circle cx="33" cy="14" r="3" fill={T.lemon} stroke={T.ink} strokeWidth="2" />
        <Circle cx="24" cy="8" r="3" fill={T.tomato} stroke={T.ink} strokeWidth="2" />
      </Svg>
    </Animated.View>
  );
}

function PlanButton({
  plan,
  label,
  perWeekTemplate,
  selected,
  onPress,
}: {
  plan: PlanDef;
  label: string;
  perWeekTemplate: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[planStyles.row, selected && planStyles.rowSelected]}
    >
      <View style={[planStyles.radio, selected && planStyles.radioSelected]}>
        {selected && <View style={planStyles.radioInner} />}
      </View>

      <View style={planStyles.labelBlock}>
        <View style={planStyles.labelRow}>
          <Text style={[planStyles.label, selected && planStyles.labelSelected]}>{label}</Text>
          {plan.discountLabel && (
            <View style={planStyles.badge}>
              <Text style={planStyles.badgeText}>{plan.discountLabel}</Text>
            </View>
          )}
        </View>
        {plan.perWeek && (
          <Text style={planStyles.perWeek}>
            {perWeekTemplate.replace('{{price}}', plan.perWeek)}
          </Text>
        )}
      </View>

      <View style={planStyles.priceBlock}>
        <Text style={[planStyles.price, selected && planStyles.priceSelected]}>{plan.price}</Text>
        <Text style={planStyles.period}>{plan.period}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function PaywallModal({ visible, onClose }: PaywallModalProps) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  const content = useMemo(() => getPaywallContent(t), [t]);
  const { refresh } = useEntitlements();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr';
  const VITRINE_BASE = 'https://www.flip-flop.app';

  const [purchasing, setPurchasing] = useState(false);

  const handleRestore = async () => {
    try {
      await restorePurchasesRC();
      await getPremiumCodeAdapter().refresh();
      await refresh();
    } catch {
      /* noop */
    }
  };

  const handlePurchase = async () => {
    if (purchasing) return;
    setPurchasing(true);
    try {
      await purchasePlan(selectedPlan as RcPlanId);
      await refresh();
      onClose();
    } catch {
      /* user cancelled or error — silent for now */
    } finally {
      setPurchasing(false);
    }
  };

  const openExternal = (path: string) => {
    Linking.openURL(`${VITRINE_BASE}/${lang}${path}`).catch(() => {});
  };

  const [selectedPlan, setSelectedPlan] = useState<PaywallPlanId>(content.recommendedPlan);
  const [redeemVisible, setRedeemVisible] = useState(false);

  const planLabel = (id: PaywallPlanId) => t(`paywall:plans.${id}`);

  const isTrial = selectedPlan === 'weekly';
  const selectedPriceObj = PLANS.find((p) => p.id === selectedPlan);
  const ctaSubtext = (() => {
    const price = selectedPriceObj?.price ?? '';
    if (selectedPlan === 'weekly') return t('paywall:cta.subtextWeekly', { price });
    if (selectedPlan === 'monthly') return t('paywall:cta.subtextMonthly');
    return t('paywall:cta.subtextYearly');
  })();

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.03, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, []);
  const ctaPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <Animated.View entering={FadeIn.duration(200)} style={styles.screen}>
        <DotBackground color="#fff" opacity={0.03} gap={18} />

        <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
            <Text style={styles.closeX}>✕</Text>
          </Pressable>
        </View>

        <Animated.View
          entering={SlideInDown.springify().damping(18).stiffness(120)}
          exiting={SlideOutDown.duration(220)}
          style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}
        >
          <View style={styles.hero}>
            <CrownIcon size={48} />
            <Text style={styles.heroTitle}>
              <Text style={styles.heroTitleGold}>{content.title}</Text>
            </Text>
            <Text style={styles.heroSub}>{content.pitch}</Text>
          </View>

          <View style={styles.featuresCard}>
            {content.benefits.map((b, i) => (
              <View
                key={`${b.icon}-${i}`}
                style={[
                  styles.featureRow,
                  i < content.benefits.length - 1 && styles.featureRowBorder,
                ]}
              >
                <View style={styles.featureIconWrap}>
                  {BENEFIT_ICONS[b.icon] ?? null}
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{b.title}</Text>
                  <Text style={styles.featureSub}>{b.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.plansSection}>
            <Text style={styles.plansLabel}>{t('paywall:plans.label')}</Text>
            {PLANS.map((plan) => (
              <PlanButton
                key={plan.id}
                plan={plan}
                label={planLabel(plan.id)}
                perWeekTemplate={t('paywall:plans.perWeek', { price: '{{price}}' })}
                selected={selectedPlan === plan.id}
                onPress={() => setSelectedPlan(plan.id)}
              />
            ))}
          </View>

          <Animated.View style={ctaPulseStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.ctaBtn}
              onPress={handlePurchase}
              disabled={purchasing}
            >
              <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
                <Rect x="3" y="7" width="10" height="8" rx="2" fill={T.ink} />
                <Path
                  d="M5 7V5a3 3 0 0 1 6 0v2"
                  stroke={T.ink}
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={styles.ctaText}>
                {isTrial ? t('paywall:cta.trial') : t('paywall:cta.start')}
              </Text>
              {isTrial && (
                <View style={styles.ctaBadge}>
                  <Text style={styles.ctaBadgeText}>{t('paywall:cta.trialBadge')}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.ctaSubtext}>{ctaSubtext}</Text>

          <TouchableOpacity
            onPress={() => setRedeemVisible(true)}
            style={styles.redeemBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.redeemBtnIcon}>🎟️</Text>
            <Text style={styles.redeemBtnText}>{t('paywall:footer.redeem')}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerNote}>{t('paywall:footer.secure')}</Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={handleRestore}>
                <Text style={styles.footerLink}>{t('paywall:footer.restore')}</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>·</Text>
              <TouchableOpacity onPress={() => openExternal('/cgu')}>
                <Text style={styles.footerLink}>{t('paywall:footer.terms')}</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>·</Text>
              <TouchableOpacity onPress={() => openExternal('/privacy')}>
                <Text style={styles.footerLink}>{t('paywall:footer.privacy')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <RedeemCodeModal
          visible={redeemVisible}
          onClose={() => setRedeemVisible(false)}
          onSuccess={onClose}
        />
      </Animated.View>
    </Modal>
  );
}

const planStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: T.rMd,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: 8,
  },
  rowSelected: {
    borderColor: T.lemon,
    borderWidth: 2,
    backgroundColor: 'rgba(255,210,63,0.08)',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioSelected: { borderColor: T.lemon, backgroundColor: T.lemon },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: T.ink },
  labelBlock: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  label: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.2 },
  labelSelected: { color: '#fff' },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: T.tomato },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  perWeek: { fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 1 },
  priceBlock: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  price: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  priceSelected: { color: T.lemon },
  period: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#1A1613' },

  topBar: { paddingHorizontal: 20, alignItems: 'flex-end' },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: T.rSm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: { color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: '600' },

  sheet: { flex: 1, paddingHorizontal: 20, paddingTop: 4, justifyContent: 'space-between' },

  hero: { alignItems: 'center', paddingVertical: 4 },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -1.5,
    lineHeight: 42,
    marginBottom: 6,
  },
  heroTitleGold: { color: T.lemon },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  featuresCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: T.rMd,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 12,
  },
  featureRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  featureIconWrap: { width: 32, alignItems: 'center', justifyContent: 'center' },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '700', color: '#fff', letterSpacing: -0.2 },
  featureSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.38)',
    marginTop: 1,
    lineHeight: 14,
  },

  plansSection: { marginTop: 2 },
  plansLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginBottom: 10,
  },

  ctaBtn: {
    height: 62,
    borderRadius: T.rMd,
    backgroundColor: T.lemon,
    borderWidth: 2.5,
    borderColor: T.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: T.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    marginTop: 2,
  },
  ctaText: { fontSize: 18, fontWeight: '900', color: T.ink, letterSpacing: -0.3 },
  ctaBadge: {
    backgroundColor: T.ink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ctaBadgeText: { fontSize: 11, fontWeight: '800', color: T.lemon, letterSpacing: 0.2 },
  ctaSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
  },

  redeemBtn: {
    alignSelf: 'center',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: T.lemon,
    backgroundColor: 'rgba(255,210,63,0.08)',
  },
  redeemBtnIcon: { fontSize: 16 },
  redeemBtnText: {
    color: T.lemon,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  footer: { alignItems: 'center', gap: 4 },
  footerNote: { fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center' },
  footerLinks: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerLink: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.28)',
    textDecorationLine: 'underline',
  },
  footerDot: { fontSize: 11, color: 'rgba(255,255,255,0.18)' },
});
