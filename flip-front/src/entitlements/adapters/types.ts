import { Entitlement, LocalOverrides, RemoteFlags, SubscriptionState } from '../types';

export type Unsubscribe = () => void;

export interface SubscriptionAdapter {
  get(): Promise<SubscriptionState>;
  subscribe(listener: (state: SubscriptionState) => void): Unsubscribe;
}

export interface RemoteConfigAdapter {
  get(): Promise<RemoteFlags>;
  subscribe(listener: (flags: RemoteFlags) => void): Unsubscribe;
}

export interface LocalOverridesAdapter {
  get(): Promise<LocalOverrides>;
  set(e: Entitlement, value: boolean | null): Promise<void>;
  clear(): Promise<void>;
  subscribe(listener: (overrides: LocalOverrides) => void): Unsubscribe;
}
