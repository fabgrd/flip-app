import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { withRetry } from '../lib/retry';
import { EntitlementsAdapters, getDefaultAdapters } from './defaults';
import { resolveSnapshot } from './resolve';
import {
  Entitlement,
  EntitlementsAPI,
  EntitlementsSnapshot,
  LocalOverrides,
  RemoteFlags,
  SubscriptionState,
} from './types';

const initialSnapshot: EntitlementsSnapshot = {
  ready: false,
  tier: 'free',
  entitlements: {
    drinks_mode: false,
    spicy_content: false,
    hardcore_content: false,
    extra_questions: false,
    premium_themes: false,
    unlimited_players: false,
  },
  variants: {},
  subscription: { tier: 'free', entitlements: [], source: 'unknown' },
};

const EntitlementsContext = createContext<EntitlementsAPI | undefined>(undefined);

interface EntitlementsProviderProps {
  children: ReactNode;
  adapters?: EntitlementsAdapters;
  allowDevOverrides?: boolean;
}

export function EntitlementsProvider({
  children,
  adapters,
  allowDevOverrides = __DEV__,
}: EntitlementsProviderProps) {
  const adaptersRef = useRef<EntitlementsAdapters>(adapters ?? getDefaultAdapters());

  const subscriptionRef = useRef<SubscriptionState>(initialSnapshot.subscription);
  const remoteRef = useRef<RemoteFlags>({});
  const overridesRef = useRef<LocalOverrides>({});

  const [snapshot, setSnapshot] = useState<EntitlementsSnapshot>(initialSnapshot);

  const recompute = useCallback(() => {
    const next = resolveSnapshot(subscriptionRef.current, remoteRef.current, overridesRef.current, {
      allowOverrides: allowDevOverrides,
    });
    setSnapshot({ ...next, ready: true });
  }, [allowDevOverrides]);

  const refresh = useCallback(async () => {
    const { subscription, remoteConfig, overrides } = adaptersRef.current;
    const [sub, remote, ovr] = await Promise.all([
      withRetry(() => subscription.get(), { scope: 'entitlements.subscription' }),
      withRetry(() => remoteConfig.get(), { scope: 'entitlements.remoteConfig' }),
      // Local-only — no retry needed.
      overrides.get(),
    ]);
    subscriptionRef.current = sub;
    remoteRef.current = remote;
    overridesRef.current = ovr;
    recompute();
  }, [recompute]);

  useEffect(() => {
    const { subscription, remoteConfig, overrides } = adaptersRef.current;
    let cancelled = false;

    // withRetry already logs to Sentry on final failure.
    refresh().catch(() => {
      if (cancelled) return;
    });

    const unsubSub = subscription.subscribe((s) => {
      subscriptionRef.current = s;
      recompute();
    });
    const unsubRemote = remoteConfig.subscribe((f) => {
      remoteRef.current = f;
      recompute();
    });
    const unsubOverrides = overrides.subscribe((o) => {
      overridesRef.current = o;
      recompute();
    });

    return () => {
      cancelled = true;
      unsubSub();
      unsubRemote();
      unsubOverrides();
    };
  }, [recompute, refresh]);

  const api = useMemo<EntitlementsAPI>(() => {
    return {
      ...snapshot,
      has: (e: Entitlement) => snapshot.entitlements[e] === true,
      variant: <T,>(key: string, fallback: T): T => {
        const v = snapshot.variants[key];
        return v === undefined ? fallback : (v as T);
      },
      refresh,
    };
  }, [snapshot, refresh]);

  return <EntitlementsContext.Provider value={api}>{children}</EntitlementsContext.Provider>;
}

export function useEntitlements(): EntitlementsAPI {
  const ctx = useContext(EntitlementsContext);
  if (!ctx) {
    throw new Error('useEntitlements must be used within an EntitlementsProvider');
  }
  return ctx;
}
