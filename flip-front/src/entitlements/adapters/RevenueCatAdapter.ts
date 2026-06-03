import {
  getCustomerInfo,
  hasActivePremium,
  isRevenueCatReady,
  subscribeToCustomerInfo,
} from '../../lib/revenuecat';
import { Entitlement, SubscriptionState } from '../types';
import { SubscriptionAdapter, Unsubscribe } from './types';

const ALL_GRANTS: readonly Entitlement[] = [
  'drinks_mode',
  'spicy_content',
  'hardcore_content',
  'extra_questions',
  'premium_themes',
  'unlimited_players',
];

const freeState = (source: SubscriptionState['source'] = 'unknown'): SubscriptionState => ({
  tier: 'free',
  entitlements: [],
  source,
});

const premiumState = (activeUntil?: string): SubscriptionState => ({
  tier: 'premium',
  entitlements: ALL_GRANTS,
  source: 'iap',
  activeUntil,
});

export class RevenueCatAdapter implements SubscriptionAdapter {
  private state: SubscriptionState = freeState();

  private listeners = new Set<(s: SubscriptionState) => void>();

  private rcUnsub: (() => void) | null = null;

  private fetched = false;

  constructor() {
    this.rcUnsub = subscribeToCustomerInfo((info) => {
      const active = info.entitlements.active['flip-flop Pro'];
      this.setState(active ? premiumState(active.expirationDate ?? undefined) : freeState('iap'));
    });
  }

  async get(): Promise<SubscriptionState> {
    if (!this.fetched) {
      this.fetched = true;
      await this.refresh();
    }
    return this.state;
  }

  subscribe(listener: (s: SubscriptionState) => void): Unsubscribe {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async refresh(): Promise<void> {
    if (!isRevenueCatReady()) {
      this.setState(freeState('unknown'));
      return;
    }
    try {
      const info = await getCustomerInfo();
      if (!info) {
        this.setState(freeState('iap'));
        return;
      }
      if (hasActivePremium(info)) {
        const active = info.entitlements.active['flip-flop Pro'];
        this.setState(premiumState(active?.expirationDate ?? undefined));
      } else {
        this.setState(freeState('iap'));
      }
    } catch {
      this.setState(freeState('unknown'));
    }
  }

  private setState(next: SubscriptionState): void {
    this.state = next;
    this.listeners.forEach((l) => l(next));
  }
}
