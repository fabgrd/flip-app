import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { T } from '../../constants/flipTokens';
import { getPaywallContent } from '../../paywall/paywallContent';
import { PaywallPlanId } from '../../paywall/types';
import { DotBackground } from './DotBackground';

export interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
}

interface PlanDef {
  id: PaywallPlanId;
  price: string;
  period: string;
  perWeek?: string;
  withDiscount?: boolean;
}

const PLANS: readonly PlanDef[] = [
  { id: 'weekly', price: '2,99 €', period: '/sem' },
  { id: 'monthly', price: '4,99 €', period: '/mois', perWeek: '1,15 €' },
  { id: 'annual', price: '19,99 €', period: '/an', perWeek: '0,38 €', withDiscount: true },
];

function CrownIcon({ size = 48 }: { size?: number }) {
  return (
    <View style={{ alignItems: 'center', marginBottom: 4 }}>
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
    </View>
  );
}

function PlanButton({
  plan,
  label,
  perWeekTemplate,
  discountLabel,
  selected,
  onPress,
}: {
  plan: PlanDef;
  label: string;
  perWeekTemplate: string;
  discountLabel: string;
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
          {plan.withDiscount && (
            <View style={planStyles.badge}>
              <Text style={planStyles.badgeText}>{discountLabel}</Text>
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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const content = useMemo(() => getPaywallContent(t), [t]);

  const [selectedPlan, setSelectedPlan] = useState<PaywallPlanId>(content.recommendedPlan);

  const planLabel = (id: PaywallPlanId) => t(`paywall:plans.${id}`);

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
                  <Feather name={b.icon as any} size={18} color="#fff" />
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
                discountLabel={t('paywall:plans.discount')}
                selected={selectedPlan === plan.id}
                onPress={() => setSelectedPlan(plan.id)}
              />
            ))}
          </View>

          <TouchableOpacity activeOpacity={0.9} style={styles.ctaBtn}>
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
            <Text style={styles.ctaText}>{t('paywall:cta.trial')}</Text>
            <View style={styles.ctaBadge}>
              <Text style={styles.ctaBadgeText}>{t('paywall:cta.trialBadge')}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerNote}>{t('paywall:footer.secure')}</Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>{t('paywall:footer.restore')}</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>·</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>{t('paywall:footer.terms')}</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>·</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>{t('paywall:footer.privacy')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
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
  featureIconWrap: { width: 26, alignItems: 'center' },
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
