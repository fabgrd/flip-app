// Fl!p Design System — Pop risograph, warm cream, bold accents
// Direction: fond crème chaud, accents vifs, ombre offset chunky

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
  cobalt: '#2447FF',
  lemon: '#FFD23F',
  mint: '#4FCB8A',
  violet: '#9B5BFF',
  pink: '#FF8FB1',

  // Game-specific
  chameleonAccent: '#4FCB8A',
  gaucheDroiteAccent: '#FFD23F',
  pureteAccent: '#9B5BFF',
  castingOrange: '#FF8C42',

  // Radii
  rXs: 8,
  rSm: 14,
  rMd: 22,
  rLg: 32,
  rXl: 44,
} as const;

// Offset shadow helper for iOS — hard chunky shadow
export const offsetShadow = (size = 4, color = T.ink) => ({
  shadowColor: color,
  shadowOffset: { width: size, height: size },
  shadowOpacity: 1 as number,
  shadowRadius: 0,
  elevation: 4,
});

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
