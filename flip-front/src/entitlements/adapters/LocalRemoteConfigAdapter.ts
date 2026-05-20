import { RemoteFlags } from '../types';
import { RemoteConfigAdapter, Unsubscribe } from './types';

export const DEFAULT_REMOTE_FLAGS: RemoteFlags = Object.freeze({
  entitlements: {},
  variants: {},
});

export class LocalRemoteConfigAdapter implements RemoteConfigAdapter {
  private flags: RemoteFlags;

  private listeners = new Set<(flags: RemoteFlags) => void>();

  constructor(initial: RemoteFlags = DEFAULT_REMOTE_FLAGS) {
    this.flags = initial;
  }

  async get(): Promise<RemoteFlags> {
    return this.flags;
  }

  subscribe(listener: (flags: RemoteFlags) => void): Unsubscribe {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setFlags(next: RemoteFlags): void {
    this.flags = next;
    this.listeners.forEach((l) => l(this.flags));
  }
}
