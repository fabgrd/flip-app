import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';

const RC_API_KEY_IOS = 'appl_JBwdoCBndaVCpUdoLSTAMPoCQrw';
const RC_API_KEY_ANDROID = 'goog_REPLACE_ME';

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
  const key = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
  if (!key || key.endsWith('REPLACE_ME')) return;
  Purchases.configure({ apiKey: key });
  initialized = true;
}

export function isRevenueCatReady(): boolean {
  return initialized;
}

export async function getCurrentPackages(): Promise<
  Partial<Record<RcPlanId, PurchasesPackage>>
> {
  if (!initialized) return {};
  const offerings = await Purchases.getOfferings();
  const current = offerings.current;
  if (!current) return {};
  const out: Partial<Record<RcPlanId, PurchasesPackage>> = {};
  for (const [planId, rcId] of Object.entries(RC_PACKAGE_IDS) as [
    RcPlanId,
    string,
  ][]) {
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

export function hasActivePremium(info: CustomerInfo): boolean {
  return info.entitlements.active[RC_ENTITLEMENT_ID] !== undefined;
}

export function subscribeToCustomerInfo(
  listener: (info: CustomerInfo) => void,
): () => void {
  if (!initialized) return () => {};
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => Purchases.removeCustomerInfoUpdateListener(listener);
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!initialized) return null;
  return Purchases.getCustomerInfo();
}
