import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

// Public SDK keys — safe to ship, but read from env so each platform's key can be
// rotated without a code change. iOS keys start with `appl_`, Android with `goog_`.
const RC_API_KEY_IOS = process.env.EXPO_PUBLIC_RC_API_KEY_IOS ?? 'appl_JBwdoCBndaVCpUdoLSTAMPoCQrw';
const RC_API_KEY_ANDROID = process.env.EXPO_PUBLIC_RC_API_KEY_ANDROID ?? '';

export const RC_ENTITLEMENT_ID = 'flip-flop Pro';

export const RC_PACKAGE_IDS = {
  weekly: '$rc_weekly',
  monthly: '$rc_monthly',
  annual: '$rc_annual',
} as const;

export type RcPlanId = keyof typeof RC_PACKAGE_IDS;

let initialized = false;

export function initRevenueCat(): void {
  if (initialized) return;
  const isIos = Platform.OS === 'ios';
  const key = isIos ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
  // A placeholder or wrong-platform key makes Purchases.configure throw at startup,
  // so skip init instead — the app then runs with premium simply unavailable.
  const isPlaceholder = key.includes('REPLACE_ME') || /^(appl|goog)_x+$/.test(key);
  if (isPlaceholder || !key.startsWith(isIos ? 'appl_' : 'goog_')) return;
  Purchases.configure({ apiKey: key });
  initialized = true;
}

export function isRevenueCatReady(): boolean {
  return initialized;
}

export async function getCurrentPackages(): Promise<Partial<Record<RcPlanId, PurchasesPackage>>> {
  if (!initialized) return {};
  const offerings = await Purchases.getOfferings();
  const current = offerings.current;
  if (!current) return {};
  const out: Partial<Record<RcPlanId, PurchasesPackage>> = {};
  for (const [planId, rcId] of Object.entries(RC_PACKAGE_IDS) as [RcPlanId, string][]) {
    const pkg = current.availablePackages.find((p) => p.identifier === rcId);
    if (pkg) out[planId] = pkg;
  }
  return out;
}

export async function purchasePlan(planId: RcPlanId): Promise<CustomerInfo> {
  if (!initialized) throw new Error('revenuecat_not_ready');
  const packages = await getCurrentPackages();
  const pkg = packages[planId];
  if (!pkg) throw new Error(`package_not_found:${planId}`);
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return customerInfo;
}

export async function restorePurchasesRC(): Promise<CustomerInfo | null> {
  if (!initialized) return null;
  return Purchases.restorePurchases();
}

/**
 * Opens Apple's native In-App Purchase code redemption sheet (Offer Codes).
 * iOS only — the App Store handles the redemption, so this is the
 * App Store Review-compliant way to grant free/discounted access (guideline 3.1.1).
 * No-op on Android / when RevenueCat isn't ready.
 */
export function presentCodeRedemptionSheet(): void {
  if (!initialized || Platform.OS !== 'ios') return;
  Purchases.presentCodeRedemptionSheet();
}

export function hasActivePremium(info: CustomerInfo): boolean {
  return info.entitlements.active[RC_ENTITLEMENT_ID] !== undefined;
}

export function subscribeToCustomerInfo(listener: (info: CustomerInfo) => void): () => void {
  if (!initialized) return () => {};
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => Purchases.removeCustomerInfoUpdateListener(listener);
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!initialized) return null;
  return Purchases.getCustomerInfo();
}
