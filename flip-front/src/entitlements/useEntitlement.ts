import { useEntitlements } from './EntitlementsContext';
import { Entitlement } from './types';

export interface EntitlementResult {
  canAccess: boolean;
  isPremium: boolean;
  ready: boolean;
}

export function useEntitlement(e: Entitlement): EntitlementResult {
  const { has, tier, ready } = useEntitlements();
  return {
    canAccess: has(e),
    isPremium: tier === 'premium',
    ready,
  };
}
