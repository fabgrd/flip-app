import {
  ENTITLEMENTS,
  Entitlement,
  EntitlementsSnapshot,
  LocalOverrides,
  RemoteFlags,
  SubscriptionState,
} from './types';

const emptyEntitlementMap = (): Record<Entitlement, boolean> =>
  ENTITLEMENTS.reduce(
    (acc, e) => {
      acc[e] = false;
      return acc;
    },
    {} as Record<Entitlement, boolean>,
  );

export function resolveSnapshot(
  subscription: SubscriptionState,
  remote: RemoteFlags,
  overrides: LocalOverrides,
  options: { allowOverrides: boolean },
): Omit<EntitlementsSnapshot, 'ready'> {
  const entitlements = emptyEntitlementMap();

  subscription.entitlements.forEach((e) => {
    entitlements[e] = true;
  });

  if (remote.entitlements) {
    (Object.entries(remote.entitlements) as [Entitlement, boolean | undefined][]).forEach(
      ([e, v]) => {
        if (typeof v === 'boolean') entitlements[e] = v;
      },
    );
  }

  if (options.allowOverrides) {
    (Object.entries(overrides) as [Entitlement, boolean | undefined][]).forEach(([e, v]) => {
      if (typeof v === 'boolean') entitlements[e] = v;
    });
  }

  return {
    tier: subscription.tier,
    entitlements,
    variants: remote.variants ?? {},
    subscription,
  };
}
