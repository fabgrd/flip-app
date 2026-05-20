import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { PaywallModal } from '../components';
import { Entitlement } from '../entitlements';

interface PaywallAPI {
  open: (feature?: Entitlement) => void;
  close: () => void;
  current: Entitlement | null;
  visible: boolean;
}

const PaywallContext = createContext<PaywallAPI | undefined>(undefined);

export function PaywallProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<Entitlement | null>(null);

  const open = useCallback((feature?: Entitlement) => {
    const next = feature ?? null;
    setCurrent(next);
    setVisible(true);
    // eslint-disable-next-line no-console
    if (__DEV__) console.log('[paywall] open', { feature: next });
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const api = useMemo<PaywallAPI>(
    () => ({ open, close, current, visible }),
    [open, close, current, visible],
  );

  return (
    <PaywallContext.Provider value={api}>
      {children}
      <PaywallModal visible={visible} feature={current} onClose={close} />
    </PaywallContext.Provider>
  );
}

export function usePaywall(): PaywallAPI {
  const ctx = useContext(PaywallContext);
  if (!ctx) throw new Error('usePaywall must be used within a PaywallProvider');
  return ctx;
}
