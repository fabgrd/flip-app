import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { PaywallModal } from '../components';
import { Entitlement } from '../entitlements';

interface PaywallAPI {
  open: (source?: Entitlement) => void;
  close: () => void;
  visible: boolean;
}

const PaywallContext = createContext<PaywallAPI | undefined>(undefined);

export function PaywallProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  const open = useCallback((source?: Entitlement) => {
    setVisible(true);
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[paywall] open', { source: source ?? 'generic' });
    }
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const api = useMemo<PaywallAPI>(() => ({ open, close, visible }), [open, close, visible]);

  return (
    <PaywallContext.Provider value={api}>
      {children}
      <PaywallModal visible={visible} onClose={close} />
    </PaywallContext.Provider>
  );
}

export function usePaywall(): PaywallAPI {
  const ctx = useContext(PaywallContext);
  if (!ctx) throw new Error('usePaywall must be used within a PaywallProvider');
  return ctx;
}
