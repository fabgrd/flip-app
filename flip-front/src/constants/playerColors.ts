import { T } from './flipTokens';

export const PLAYER_COLORS = ['tomato', 'cobalt', 'lemon', 'mint', 'violet', 'pink'] as const;
export const LIGHT_COLORS = ['lemon', 'pink'] as const;

export function getPlayerColorName(index: number) {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

export function getPlayerBgColor(index: number): string {
  const key = getPlayerColorName(index);
  return (T as Record<string, string>)[key] ?? T.tomato;
}

export function getPlayerTextColor(index: number): string {
  return (LIGHT_COLORS as readonly string[]).includes(getPlayerColorName(index)) ? T.ink : '#fff';
}
