import { Entitlement, SubscriptionState, SubscriptionTier } from '../types';
import { SubscriptionAdapter, Unsubscribe } from './types';

const PREMIUM_GRANTS: readonly Entitlement[] = [
  'drinks_mode',
  'spicy_content',
  'hardcore_content',
  'extra_questions',
  'premium_themes',
  'unlimited_players',
];

const buildState = (tier: SubscriptionTier): SubscriptionState => ({
  tier,
  entitlements: tier === 'premium' ? PREMIUM_GRANTS : [],
  source: 'mock',
});

export class MockSubscriptionAdapter implements SubscriptionAdapter {
  private state: SubscriptionState;

  private listeners = new Set<(s: SubscriptionState) => void>();

  constructor(initialTier: SubscriptionTier = 'free') {
    this.state = buildState(initialTier);
  }

  async get(): Promise<SubscriptionState> {
    return this.state;
  }

  subscribe(listener: (state: SubscriptionState) => void): Unsubscribe {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setTier(tier: SubscriptionTier): void {
    this.state = buildState(tier);
    this.listeners.forEach((l) => l(this.state));
  }
}
