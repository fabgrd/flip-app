import AsyncStorage from '@react-native-async-storage/async-storage';

import { SubscriptionState, SubscriptionTier } from '../types';
import { SubscriptionAdapter, Unsubscribe } from './types';

const BETA_PREMIUM_KEY = '@flip_beta_premium';

const PREMIUM_ENTITLEMENTS: SubscriptionState['entitlements'] = [
  'drinks_mode',
  'spicy_content',
  'hardcore_content',
  'extra_questions',
  'premium_themes',
  'unlimited_players',
];

function buildState(isPremium: boolean): SubscriptionState {
  const tier: SubscriptionTier = isPremium ? 'premium' : 'free';
  return {
    tier,
    entitlements: isPremium ? PREMIUM_ENTITLEMENTS : [],
    source: 'mock',
  };
}

export class BetaSubscriptionAdapter implements SubscriptionAdapter {
  async get(): Promise<SubscriptionState> {
    const value = await AsyncStorage.getItem(BETA_PREMIUM_KEY);
    return buildState(value === 'true');
  }

  subscribe(_listener: (state: SubscriptionState) => void): Unsubscribe {
    return () => {};
  }
}

export async function setBetaPremium(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(BETA_PREMIUM_KEY, String(enabled));
}

export async function getBetaPremium(): Promise<boolean> {
  return (await AsyncStorage.getItem(BETA_PREMIUM_KEY)) === 'true';
}
