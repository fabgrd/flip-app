export const T = {
  bg: '#F5EFE3',
  bgAlt: '#EDE5D2',
  paper: '#FBF7EC',
  ink: '#181613',
  inkSoft: '#3A342A',
  muted: '#8B8273',
  tomato: '#FF5B3A',
  cobalt: '#2447FF',
  lemon: '#FFD23F',
  mint: '#4FCB8A',
  violet: '#9B5BFF',
  pink: '#FF8FB1',
  orange: '#FF8C42',
  red: '#E63946',
} as const;

export const fonts = {
  display: 'var(--font-display), system-ui, sans-serif',
  sans: 'var(--font-sans), system-ui, sans-serif',
  mono: 'var(--font-mono), monospace',
} as const;

export const bp = {
  mobile: '(max-width: 767px)',
  compact: '(max-width: 639px)',
} as const;

export const LIGHT_COLORS: readonly string[] = [T.lemon, T.pink, T.paper];
export const onColor = (bg: string) => (LIGHT_COLORS.includes(bg) ? T.ink : '#fff');
