import {
  AsyncStorageOverridesAdapter,
  BetaSubscriptionAdapter,
  LocalRemoteConfigAdapter,
  MockSubscriptionAdapter,
  NoopOverridesAdapter,
} from './adapters';
import { LocalOverridesAdapter, RemoteConfigAdapter, SubscriptionAdapter } from './adapters/types';

export interface EntitlementsAdapters {
  subscription: SubscriptionAdapter;
  remoteConfig: RemoteConfigAdapter;
  overrides: LocalOverridesAdapter;
}

const IS_BETA = process.env.APP_VARIANT === 'beta';

let cached: EntitlementsAdapters | null = null;

export function getDefaultAdapters(): EntitlementsAdapters {
  if (!cached) {
    cached = {
      subscription: IS_BETA ? new BetaSubscriptionAdapter() : new MockSubscriptionAdapter('free'),
      remoteConfig: new LocalRemoteConfigAdapter(),
      overrides: __DEV__ ? new AsyncStorageOverridesAdapter() : new NoopOverridesAdapter(),
    };
  }
  return cached;
}
