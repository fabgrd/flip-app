import { Entitlement, SubscriptionState } from '../types';
import { SubscriptionAdapter, Unsubscribe } from './types';

const mergeStates = (states: readonly SubscriptionState[]): SubscriptionState => {
  const set = new Set<Entitlement>();
  let tier: SubscriptionState['tier'] = 'free';
  let source: SubscriptionState['source'] = 'unknown';
  for (const s of states) {
    s.entitlements.forEach((e) => set.add(e));
    if (s.tier === 'premium') {
      tier = 'premium';
      source = s.source;
    }
  }
  return { tier, entitlements: Array.from(set), source };
};

export class CompositeSubscriptionAdapter implements SubscriptionAdapter {
  private listeners = new Set<(s: SubscriptionState) => void>();

  private latest: SubscriptionState[];

  constructor(private adapters: readonly SubscriptionAdapter[]) {
    this.latest = adapters.map(() => ({
      tier: 'free' as const,
      entitlements: [],
      source: 'unknown' as const,
    }));
    adapters.forEach((adapter, i) => {
      adapter.subscribe((state) => {
        this.latest[i] = state;
        const merged = mergeStates(this.latest);
        this.listeners.forEach((l) => l(merged));
      });
    });
  }

  async get(): Promise<SubscriptionState> {
    const results = await Promise.all(this.adapters.map((a) => a.get()));
    this.latest = results.slice();
    return mergeStates(results);
  }

  subscribe(listener: (state: SubscriptionState) => void): Unsubscribe {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
