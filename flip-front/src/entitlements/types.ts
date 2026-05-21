export const ENTITLEMENTS = [
  'drinks_mode',
  'spicy_content',
  'hardcore_content',
  'extra_questions',
  'premium_themes',
  'unlimited_players',
] as const;

export type Entitlement = (typeof ENTITLEMENTS)[number];

export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionState {
  tier: SubscriptionTier;
  entitlements: readonly Entitlement[];
  activeUntil?: string;
  source: 'mock' | 'iap' | 'restored' | 'unknown';
}

export type RemoteFlags = Readonly<{
  entitlements?: Partial<Record<Entitlement, boolean>>;
  variants?: Readonly<Record<string, unknown>>;
}>;

export type LocalOverrides = Readonly<Partial<Record<Entitlement, boolean>>>;

export interface EntitlementsSnapshot {
  ready: boolean;
  tier: SubscriptionTier;
  entitlements: Readonly<Record<Entitlement, boolean>>;
  variants: Readonly<Record<string, unknown>>;
  subscription: SubscriptionState;
}

export interface EntitlementsAPI extends EntitlementsSnapshot {
  has: (e: Entitlement) => boolean;
  variant: <T>(key: string, fallback: T) => T;
  refresh: () => Promise<void>;
}
