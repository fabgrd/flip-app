import { MockSubscriptionAdapter } from './adapters/MockSubscriptionAdapter';
import { getDefaultAdapters } from './defaults';
import { Entitlement, SubscriptionTier } from './types';

export function setDevTier(tier: SubscriptionTier): void {
  const { subscription } = getDefaultAdapters();
  if (subscription instanceof MockSubscriptionAdapter) {
    subscription.setTier(tier);
  }
}

export async function setDevOverride(e: Entitlement, value: boolean | null): Promise<void> {
  if (!__DEV__) return;
  const { overrides } = getDefaultAdapters();
  await overrides.set(e, value);
}

export async function clearDevOverrides(): Promise<void> {
  if (!__DEV__) return;
  const { overrides } = getDefaultAdapters();
  await overrides.clear();
}
