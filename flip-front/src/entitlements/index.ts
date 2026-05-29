export { EntitlementsProvider, useEntitlements } from './EntitlementsContext';
export { useEntitlement } from './useEntitlement';
export type { EntitlementResult } from './useEntitlement';
export { Gate } from './Gate';
export { ENTITLEMENTS } from './types';
export type {
  Entitlement,
  EntitlementsAPI,
  EntitlementsSnapshot,
  RemoteFlags,
  SubscriptionState,
  SubscriptionTier,
  LocalOverrides,
} from './types';
export { getDefaultAdapters, getPremiumCodeAdapter } from './defaults';
export type { EntitlementsAdapters } from './defaults';
export { setDevTier, setDevOverride, clearDevOverrides } from './devTools';
