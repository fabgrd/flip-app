import {
  AsyncStorageOverridesAdapter,
  CompositeSubscriptionAdapter,
  LocalRemoteConfigAdapter,
  MockSubscriptionAdapter,
  NoopOverridesAdapter,
  RevenueCatAdapter,
} from './adapters';
import { LocalOverridesAdapter, RemoteConfigAdapter, SubscriptionAdapter } from './adapters/types';

export interface EntitlementsAdapters {
  subscription: SubscriptionAdapter;
  remoteConfig: RemoteConfigAdapter;
  overrides: LocalOverridesAdapter;
}

let cached: EntitlementsAdapters | null = null;

export function getDefaultAdapters(): EntitlementsAdapters {
  if (!cached) {
    // Premium is granted exclusively via In-App Purchase (RevenueCat).
    // Free access for testers is handled through App Store Offer Codes,
    // redeemed via Apple's native sheet — no out-of-IAP unlock path (guideline 3.1.1).
    cached = {
      subscription: new CompositeSubscriptionAdapter([
        new MockSubscriptionAdapter('free'),
        new RevenueCatAdapter(),
      ]),
      remoteConfig: new LocalRemoteConfigAdapter(),
      overrides: __DEV__ ? new AsyncStorageOverridesAdapter() : new NoopOverridesAdapter(),
    };
  }
  return cached;
}
