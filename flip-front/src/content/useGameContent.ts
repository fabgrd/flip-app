import { useMemo } from 'react';
import { useEntitlements } from '../entitlements';
import { selectContent } from './selectContent';
import { ContentItem, ContentTier } from './types';

export interface UseGameContentOptions {
  tags?: readonly string[];
  maxTier?: ContentTier;
}

export function useGameContent<T extends ContentItem>(
  items: readonly T[],
  options: UseGameContentOptions = {},
): T[] {
  const { has } = useEntitlements();
  return useMemo(
    () => selectContent(items, { has, tags: options.tags, maxTier: options.maxTier }),
    [items, has, options.tags, options.maxTier],
  );
}
