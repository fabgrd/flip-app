import { useCallback, useMemo } from 'react';
import { useEntitlements } from '../../entitlements';
import { usePaywall } from '../../paywall';
import { levelRequiredEntitlement, LEVEL_TIER } from './levelTiers';
import { LevelKey } from './types';

export interface PurityLevelAccess {
  isLevelAllowed: (level: LevelKey) => boolean;
  requestUnlockFor: (level: LevelKey) => void;
  highestAllowedLevel: LevelKey;
}

const LEVEL_ORDER: LevelKey[] = ['level1', 'level2', 'level3', 'level4', 'level5'];

export function usePurityLevelAccess(): PurityLevelAccess {
  const { has } = useEntitlements();
  const { open } = usePaywall();

  const isLevelAllowed = useCallback(
    (level: LevelKey) => {
      const req = levelRequiredEntitlement(level);
      return req === null || has(req);
    },
    [has],
  );

  const requestUnlockFor = useCallback(
    (level: LevelKey) => {
      const req = levelRequiredEntitlement(level);
      if (req) open(req);
    },
    [open],
  );

  const highestAllowedLevel = useMemo<LevelKey>(() => {
    for (let i = LEVEL_ORDER.length - 1; i >= 0; i -= 1) {
      const level = LEVEL_ORDER[i];
      if (isLevelAllowed(level)) return level;
    }
    return 'level1';
  }, [isLevelAllowed]);

  return { isLevelAllowed, requestUnlockFor, highestAllowedLevel };
}

export { LEVEL_TIER };
