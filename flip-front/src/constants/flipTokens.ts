// Fl!p Design System — Pop risograph, warm cream, bold accents
// Direction: fond crème chaud, accents vifs, ombre offset chunky

import { Platform, ViewStyle } from 'react-native';

export const T = {
  // Backgrounds
  bg: '#F5EFE3',
  bgAlt: '#EDE5D2',
  paper: '#FBF7EC',
  ink: '#181613',
  inkSoft: '#3A342A',
  muted: '#8B8273',

  // Accent palette — risograph
  tomato: '#FF5B3A',
  cobalt: '#4482FF', // was #2447FF — brightened for readability on backgrounds
  lemon: '#FFD23F',
  mint: '#4FCB8A',
  violet: '#9B5BFF',
  pink: '#FF8FB1',
  teal: '#00C4AE', // Paranoïa
  crimson: '#FF2D55', // future (Red Flag)
  sky: '#5BC8FF', // future
  lime: '#C4F034', // future

  // Game-specific
  chameleonAccent: '#4FCB8A',
  gaucheDroiteAccent: '#FFD23F',
  pureteAccent: '#9B5BFF',
  paranoiaAccent: '#00C4AE',
  castingMagenta: '#D633C9',
  bombAccent: '#FF7A1A',
  bombAccentDark: '#D6610C',

  // Radii
  rXs: 8,
  rSm: 14,
  rMd: 22,
  rLg: 32,
  rXl: 44,
} as const;

// #RGB / #RRGGBB + opacity -> rgba(), for the CSS-style colors boxShadow expects.
const rgba = (color: string, opacity: number): string => {
  if (opacity >= 1) return color;
  const hex = color.replace('#', '');
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;
  if (full.length !== 6) return color;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Offset shadow helper — hard chunky shadow, identical on iOS and Android.
// iOS honours shadowOffset/shadowRadius directly. Android ignores them and only
// draws `elevation`, which is a blurred grey drop shadow — the opposite of the
// risograph look — so it gets a `boxShadow` (RN 0.76+) and no elevation.
// `size` is the offset in px — a number for the usual square offset, or [x, y].
export const offsetShadow = (
  size: number | [number, number] = 4,
  color: string = T.ink,
  opacity = 1,
): ViewStyle => {
  const [x, y] = typeof size === 'number' ? [size, size] : size;
  return Platform.select({
    android: {
      boxShadow: [{ offsetX: x, offsetY: y, blurRadius: 0, color: rgba(color, opacity) }],
    },
    default: {
      shadowColor: color,
      shadowOffset: { width: x, height: y },
      shadowOpacity: opacity as number,
      shadowRadius: 0,
    },
  }) as ViewStyle;
};

// Cancels an offsetShadow (disabled buttons, flattened cards).
export const noShadow = Platform.select({
  android: { boxShadow: [] },
  default: { shadowOpacity: 0 },
}) as ViewStyle;

// Card style: 2px border + offset shadow
export const cardStyle = (bg = T.paper, radius = T.rLg) => ({
  backgroundColor: bg,
  borderWidth: 2,
  borderColor: T.ink,
  borderRadius: radius,
  ...offsetShadow(5),
});

// Button base: chunky with border + offset shadow
export const buttonBase = (bg: string, radius = T.rMd) => ({
  backgroundColor: bg,
  borderWidth: 2,
  borderColor: T.ink,
  borderRadius: radius,
  ...offsetShadow(4),
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  flexDirection: 'row' as const,
});
