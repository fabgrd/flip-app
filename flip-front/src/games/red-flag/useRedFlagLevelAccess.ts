import { useCallback, useMemo } from 'react';
import { useEntitlements } from '../../entitlements';
import { usePaywall } from '../../paywall';
import { RF_LEVEL_KEYS } from './constants';
import { rfLevelRequiredEntitlement } from './levelTiers';
import { RFLevelKey } from './types';

export interface RFLevelAccess {
  isLevelAllowed: (level: RFLevelKey) => boolean;
  requestUnlockFor: (level: RFLevelKey) => void;
  highestAllowedLevel: RFLevelKey;
}

export function useRedFlagLevelAccess(): RFLevelAccess {
  const { has } = useEntitlements();
  const { open } = usePaywall();

  const isLevelAllowed = useCallback(
    (level: RFLevelKey) => {
      const req = rfLevelRequiredEntitlement(level);
      return req === null || has(req);
    },
    [has],
  );

  const requestUnlockFor = useCallback(
    (level: RFLevelKey) => {
      const req = rfLevelRequiredEntitlement(level);
      if (req) open(req);
    },
    [open],
  );

  const highestAllowedLevel = useMemo<RFLevelKey>(() => {
    for (let i = RF_LEVEL_KEYS.length - 1; i >= 0; i -= 1) {
      const level = RF_LEVEL_KEYS[i];
      if (isLevelAllowed(level)) return level;
    }
    return 'soft';
  }, [isLevelAllowed]);

  return { isLevelAllowed, requestUnlockFor, highestAllowedLevel };
}
