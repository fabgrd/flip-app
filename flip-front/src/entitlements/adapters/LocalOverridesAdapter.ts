import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENTITLEMENTS, Entitlement, LocalOverrides } from '../types';
import { LocalOverridesAdapter, Unsubscribe } from './types';

const STORAGE_KEY = 'flip_entitlement_overrides';

const sanitize = (raw: unknown): LocalOverrides => {
  if (!raw || typeof raw !== 'object') return {};
  const valid = new Set<string>(ENTITLEMENTS);
  const result: Partial<Record<Entitlement, boolean>> = {};
  Object.entries(raw as Record<string, unknown>).forEach(([key, value]) => {
    if (valid.has(key) && typeof value === 'boolean') {
      result[key as Entitlement] = value;
    }
  });
  return result;
};

export class AsyncStorageOverridesAdapter implements LocalOverridesAdapter {
  private cache: LocalOverrides = {};

  private loaded = false;

  private listeners = new Set<(o: LocalOverrides) => void>();

  async get(): Promise<LocalOverrides> {
    if (!this.loaded) {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        this.cache = raw ? sanitize(JSON.parse(raw)) : {};
      } catch {
        this.cache = {};
      }
      this.loaded = true;
    }
    return this.cache;
  }

  async set(e: Entitlement, value: boolean | null): Promise<void> {
    await this.get();
    const next: Partial<Record<Entitlement, boolean>> = { ...this.cache };
    if (value === null) {
      delete next[e];
    } else {
      next[e] = value;
    }
    this.cache = next;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    this.listeners.forEach((l) => l(this.cache));
  }

  async clear(): Promise<void> {
    this.cache = {};
    await AsyncStorage.removeItem(STORAGE_KEY);
    this.listeners.forEach((l) => l(this.cache));
  }

  subscribe(listener: (overrides: LocalOverrides) => void): Unsubscribe {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export class NoopOverridesAdapter implements LocalOverridesAdapter {
  async get(): Promise<LocalOverrides> {
    return {};
  }

  async set(): Promise<void> {}

  async clear(): Promise<void> {}

  subscribe(): Unsubscribe {
    return () => {};
  }
}
