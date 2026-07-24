import type { Player } from '../types';

/**
 * Reconcile an enriched player list against the current base roster (matched by id).
 * Existing enriched entries keep their game data (scores, answers, roles…),
 * newly added players get a default entry, removed players are dropped, and the
 * result follows the roster order.
 */
export function reconcilePlayerList<T extends { id: string }>(
  roster: Player[],
  existing: T[],
  create: (p: Player) => T,
): T[] {
  const byId = new Map(existing.map((e) => [e.id, e]));
  return roster.map((p) => {
    const found = byId.get(p.id);
    return found ? ({ ...found, ...p } as T) : create(p);
  });
}

/** True when both lists contain exactly the same ids in the same order. */
export function samePlayerIds(a: { id: string }[], b: { id: string }[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((p, i) => p.id === b[i].id);
}

/**
 * Reconcile a per-player value array (parallel-indexed to `prevRoster`) onto a new
 * roster. Values follow their player by id; new players get `def`.
 */
export function reconcileParallel<V>(
  roster: Player[],
  prevRoster: Player[],
  prevArr: V[],
  def: V,
): V[] {
  const byId = new Map(prevRoster.map((p, i) => [p.id, prevArr[i]] as const));
  return roster.map((p) => {
    const v = byId.get(p.id);
    return v === undefined ? def : v;
  });
}
