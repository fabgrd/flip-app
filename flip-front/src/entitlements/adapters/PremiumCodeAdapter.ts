import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceId } from '../../lib/deviceId';
import { supabase } from '../../lib/supabase';
import { Entitlement, SubscriptionState } from '../types';
import { SubscriptionAdapter, Unsubscribe } from './types';

const CODE_KEY = '@flip_premium_code';
const CACHE_KEY = '@flip_premium_code_cache';

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

const premiumState = (): SubscriptionState => ({
  tier: 'premium',
  entitlements: ALL_GRANTS,
  source: 'restored',
});

export class PremiumCodeAdapter implements SubscriptionAdapter {
  private state: SubscriptionState = freeState();

  private listeners = new Set<(s: SubscriptionState) => void>();

  private currentCode: string | null = null;

  async get(): Promise<SubscriptionState> {
    if (this.state.tier === 'free' && this.state.source === 'unknown') {
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
    const code = await AsyncStorage.getItem(CODE_KEY);
    if (!code) {
      this.setState(freeState('restored'));
      return;
    }

    const cached = await AsyncStorage.getItem(CACHE_KEY);

    try {
      const device = await getDeviceId();
      const { data, error } = await supabase.rpc('check_premium_code', {
        p_code: code,
        p_device: device,
      });

      if (error) throw error;

      const ok = data === true;
      const next = ok ? premiumState() : freeState('restored');
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next));
      this.setState(next);
      this.currentCode = ok ? code : null;
    } catch {
      if (cached) {
        try {
          this.setState(JSON.parse(cached) as SubscriptionState);
        } catch {
          this.setState(freeState('restored'));
        }
      } else {
        this.setState(freeState('restored'));
      }
    }
  }

  async redeem(code: string): Promise<{ success: true } | { success: false; reason: string }> {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return { success: false, reason: 'empty' };

    const device = await getDeviceId();
    const { data, error } = await supabase.rpc('claim_premium_code', {
      p_code: trimmed,
      p_device: device,
    });

    if (error) return { success: false, reason: 'network' };

    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.success) {
      return { success: false, reason: row?.reason ?? 'unknown' };
    }

    await AsyncStorage.setItem(CODE_KEY, trimmed);
    const next = premiumState();
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next));
    this.setState(next);
    this.currentCode = trimmed;
    return { success: true };
  }

  async clearCode(): Promise<void> {
    await AsyncStorage.multiRemove([CODE_KEY, CACHE_KEY]);
    this.currentCode = null;
    this.setState(freeState('restored'));
  }

  private setState(next: SubscriptionState): void {
    this.state = next;
    this.listeners.forEach((l) => l(next));
  }
}
