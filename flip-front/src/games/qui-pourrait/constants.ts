export const QUI_POURRAIT_ACCENT = '#FF3D77'; // rose vif — interrogatoire / ragots
export const QUI_POURRAIT_ACCENT_DARK = '#D11E59';

export type QuiPourraitTheme = 'daily' | 'party' | 'love' | 'wtf' | 'hot' | 'trash';

export interface QuiPourraitThemeOption {
  value: QuiPourraitTheme;
  emoji: string;
  color: string;
}

export const QUI_POURRAIT_THEME_OPTIONS: readonly QuiPourraitThemeOption[] = [
  { value: 'daily', emoji: '📅', color: '#5BC8FF' },
  { value: 'party', emoji: '🥳', color: '#FFD23F' },
  { value: 'love', emoji: '💘', color: '#FF8FB1' },
  { value: 'wtf', emoji: '🤪', color: '#9B5BFF' },
  { value: 'hot', emoji: '🔥', color: '#FF5B3A' },
  { value: 'trash', emoji: '😈', color: '#181613' },
];

export const QUI_POURRAIT_DEFAULT_THEMES: readonly QuiPourraitTheme[] = [
  'daily',
  'party',
  'love',
  'wtf',
];
