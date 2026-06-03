import {
  AsyncStorageOverridesAdapter,
  CompositeSubscriptionAdapter,
  LocalRemoteConfigAdapter,
  MockSubscriptionAdapter,
  NoopOverridesAdapter,
  PremiumCodeAdapter,
  RevenueCatAdapter,
} from './adapters';
import { LocalOverridesAdapter, RemoteConfigAdapter, SubscriptionAdapter } from './adapters/types';

export interface EntitlementsAdapters {
  subscription: SubscriptionAdapter;
  remoteConfig: RemoteConfigAdapter;
  overrides: LocalOverridesAdapter;
}

let cached: EntitlementsAdapters | null = null;
let premiumCodeAdapterRef: PremiumCodeAdapter | null = null;

export function getDefaultAdapters(): EntitlementsAdapters {
  if (!cached) {
    const premiumCode = new PremiumCodeAdapter();
    premiumCodeAdapterRef = premiumCode;
    cached = {
      subscription: new CompositeSubscriptionAdapter([
        new MockSubscriptionAdapter('free'),
        premiumCode,
        new RevenueCatAdapter(),
      ]),
      remoteConfig: new LocalRemoteConfigAdapter(),
      overrides: __DEV__ ? new AsyncStorageOverridesAdapter() : new NoopOverridesAdapter(),
    };
  }
  return cached;
}

export function getPremiumCodeAdapter(): PremiumCodeAdapter {
  if (!premiumCodeAdapterRef) getDefaultAdapters();
  return premiumCodeAdapterRef as PremiumCodeAdapter;
}
