import React from 'react';
import { useEntitlements } from './EntitlementsContext';
import { Entitlement } from './types';

interface GateProps {
  requires: Entitlement | readonly Entitlement[];
  mode?: 'all' | 'any';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Gate({ requires, mode = 'all', fallback = null, children }: GateProps) {
  const { has, ready } = useEntitlements();
  if (!ready) return <>{fallback}</>;

  const list = Array.isArray(requires) ? requires : [requires as Entitlement];
  const granted = mode === 'all' ? list.every((e) => has(e)) : list.some((e) => has(e));

  return <>{granted ? children : fallback}</>;
}
