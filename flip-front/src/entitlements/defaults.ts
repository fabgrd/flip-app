import {
  AsyncStorageOverridesAdapter,
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

let cached: EntitlementsAdapters | null = null;

export function getDefaultAdapters(): EntitlementsAdapters {
  if (!cached) {
    cached = {
      subscription: new MockSubscriptionAdapter('free'),
      remoteConfig: new LocalRemoteConfigAdapter(),
      overrides: __DEV__ ? new AsyncStorageOverridesAdapter() : new NoopOverridesAdapter(),
    };
  }
  return cached;
}
