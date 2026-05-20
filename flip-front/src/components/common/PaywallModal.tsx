import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../../constants/flipTokens';
import { DotBackground } from './DotBackground';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
}

type PlanId = 'annual' | 'monthly' | 'weekly';

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS: { id: PlanId; label: string; price: string; period: string; perWeek?: string; badge?: string }[] = [
  { id: 'annual', label: 'Annuel', price: '19,99 €', period: '/an', perWeek: '0,38 €/sem', badge: '−70%' },
  { id: 'monthly', label: 'Mensuel', price: '4,99 €', period: '/mois', perWeek: '1,15 €/sem' },
  { id: 'weekly', label: 'Hebdo', price: '2,99 €', period: '/sem' },
];

const FEATURES: { icon: string; text: string; sub: string }[] = [
  { icon: '🎮', text: 'Tous les jeux débloqués', sub: 'Caméléon, Pureté, Paranoïa + futurs jeux' },
  { icon: '🔥', text: 'Tous les modes de chaque jeu', sub: 'Hot, Hardcore, Politique… tous inclus' },
  { icon: '📚', text: '5 000+ questions', sub: 'Nouveau contenu exclusif chaque semaine' },
  { icon: '🎃', text: 'Thèmes exclusifs', sub: '18+, Halloween, Saint-Valentin, EVG/EVJF…' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CrownIcon({ size = 48 }: { size?: number }) {
  return (
    <View style={{ alignItems: 'center', marginBottom: 4 }}>
      <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <Path d="M6 36h36V20l-9 6-9-12-9 12-9-6v16z" fill={T.lemon} stroke={T.ink} strokeWidth="2.5" strokeLinejoin="round" />
        <Rect x="6" y="34" width="36" height="6" rx="1" fill={T.lemon} stroke={T.ink} strokeWidth="2.5" />
        <Circle cx="15" cy="14" r="3" fill={T.lemon} stroke={T.ink} strokeWidth="2" />
        <Circle cx="33" cy="14" r="3" fill={T.lemon} stroke={T.ink} strokeWidth="2" />
        <Circle cx="24" cy="8" r="3" fill={T.tomato} stroke={T.ink} strokeWidth="2" />
      </Svg>
    </View>
  );
}

function PlanButton({
  plan,
  selected,
  onPress,
}: {
  plan: (typeof PLANS)[number];
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[planStyles.row, selected && planStyles.rowSelected]}
    >
      {/* Radio */}
      <View style={[planStyles.radio, selected && planStyles.radioSelected]}>
        {selected && (
          <View style={planStyles.radioInner} />
        )}
      </View>

      {/* Label + perWeek */}
      <View style={planStyles.labelBlock}>
        <View style={planStyles.labelRow}>
          <Text style={[planStyles.label, selected && planStyles.labelSelected]}>{plan.label}</Text>
          {plan.badge && (
            <View style={planStyles.badge}>
              <Text style={planStyles.badgeText}>{plan.badge}</Text>
            </View>
          )}
        </View>
        {plan.perWeek && (
          <Text style={planStyles.perWeek}>soit {plan.perWeek}</Text>
        )}
      </View>

      {/* Price */}
      <View style={planStyles.priceBlock}>
        <Text style={[planStyles.price, selected && planStyles.priceSelected]}>{plan.price}</Text>
        <Text style={planStyles.period}>{plan.period}</Text>
      </View>
    </TouchableOpacity>
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
  radioSelected: {
    borderColor: T.lemon,
    backgroundColor: T.lemon,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.ink,
  },
  labelBlock: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  label: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.2 },
  labelSelected: { color: '#fff' },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: T.tomato,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  perWeek: { fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 1 },
  priceBlock: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  price: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  priceSelected: { color: T.lemon },
  period: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
});

// ─── Main component ───────────────────────────────────────────────────────────

export function PaywallModal({ visible, onClose }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('annual');
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <Animated.View entering={FadeIn.duration(200)} style={styles.screen}>
        <DotBackground color="#fff" opacity={0.03} gap={18} />

        {/* Close button */}
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
          {/* Hero */}
          <View style={styles.hero}>
            <CrownIcon size={48} />
            <Text style={styles.heroTitle}>
              Passe en{'\n'}
              <Text style={styles.heroTitleGold}>Fl!p VIP</Text>
            </Text>
            <Text style={styles.heroSub}>
              Débloque tout · Annule quand tu veux
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresCard}>
            {FEATURES.map((f, i) => (
              <View
                key={i}
                style={[
                  styles.featureRow,
                  i < FEATURES.length - 1 && styles.featureRowBorder,
                ]}
              >
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.text}</Text>
                  <Text style={styles.featureSub}>{f.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Plans */}
          <View style={styles.plansSection}>
            <Text style={styles.plansLabel}>CHOISIS TON PLAN</Text>
            {PLANS.map((plan) => (
              <PlanButton
                key={plan.id}
                plan={plan}
                selected={selectedPlan === plan.id}
                onPress={() => setSelectedPlan(plan.id)}
              />
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity activeOpacity={0.9} style={styles.ctaBtn}>
            <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
              <Rect x="3" y="7" width="10" height="8" rx="2" fill={T.ink} />
              <Path d="M5 7V5a3 3 0 0 1 6 0v2" stroke={T.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </Svg>
            <Text style={styles.ctaText}>Essayer gratuitement</Text>
            <View style={styles.ctaBadge}>
              <Text style={styles.ctaBadgeText}>7 jours offerts</Text>
            </View>
          </TouchableOpacity>

          {/* Footer links */}
          <View style={styles.footer}>
            <Text style={styles.footerNote}>Paiement sécurisé via App Store</Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Restaurer</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>·</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>CGV</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>·</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Confidentialité</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1A1613',
  },

  topBar: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
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
  closeX: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '600',
  },

  sheet: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
    justifyContent: 'space-between',
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -1.5,
    lineHeight: 42,
    marginBottom: 6,
  },
  heroTitleGold: {
    color: T.lemon,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  // Features card
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
  featureRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  featureIcon: { fontSize: 20, width: 26, textAlign: 'center' },
  featureText: { flex: 1 },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
  },
  featureSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.38)',
    marginTop: 1,
    lineHeight: 14,
  },

  // Plans
  plansSection: { marginTop: 2 },
  plansLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginBottom: 10,
  },

  // CTA
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
  ctaText: {
    fontSize: 18,
    fontWeight: '900',
    color: T.ink,
    letterSpacing: -0.3,
  },
  ctaBadge: {
    backgroundColor: T.ink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ctaBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: T.lemon,
    letterSpacing: 0.2,
  },

  // Footer
  footer: { alignItems: 'center', gap: 4 },
  footerNote: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerLink: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.28)',
    textDecorationLine: 'underline',
  },
  footerDot: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.18)',
  },
});
