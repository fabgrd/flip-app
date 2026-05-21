import { useCallback } from 'react';
import { Entitlement, useEntitlement } from '../entitlements';
import { usePaywall } from './PaywallContext';

export interface GatedFeatureAPI {
  canAccess: boolean;
  isPremium: boolean;
  ready: boolean;
  requestUnlock: () => void;
}

export function useGatedFeature(feature: Entitlement): GatedFeatureAPI {
  const { canAccess, isPremium, ready } = useEntitlement(feature);
  const { open } = usePaywall();

  const requestUnlock = useCallback(() => {
    open(feature);
  }, [open, feature]);

  return { canAccess, isPremium, ready, requestUnlock };
}
