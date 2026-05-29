import { T } from './theme';

type IconProps = { size?: number };

export function IconCameleon({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="28" cy="32" rx="22" ry="5" fill={T.ink} />
      <path d="M12 32 Q14 14 28 16 Q42 14 44 32" fill={T.ink} />
      <rect x="14" y="26" width="28" height="4" rx="2" fill={T.lemon} />
      <circle cx="48" cy="44" r="10" fill="none" stroke={T.ink} strokeWidth="3.5" />
      <line x1="41" y1="51" x2="32" y2="60" stroke={T.ink} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconGaucheDroite({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M4 32 L20 18 V26 H30 V38 H20 V46 Z" fill={T.cobalt} stroke={T.ink} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M60 32 L44 18 V26 H34 V38 H44 V46 Z" fill={T.tomato} stroke={T.ink} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPurete({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="14" rx="14" ry="4" fill="none" stroke={T.lemon} strokeWidth="3" />
      <path d="M14 30 L18 20 L22 30 Z" fill={T.tomato} stroke={T.ink} strokeWidth="2" />
      <path d="M42 30 L46 20 L50 30 Z" fill={T.tomato} stroke={T.ink} strokeWidth="2" />
      <circle cx="32" cy="40" r="18" fill={T.paper} stroke={T.ink} strokeWidth="2.5" />
      <circle cx="26" cy="38" r="2.5" fill={T.ink} />
      <circle cx="38" cy="38" r="2.5" fill={T.ink} />
      <path d="M26 47 Q32 52 38 47" stroke={T.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function IconParanoia({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="22" fill={T.lemon} stroke={T.ink} strokeWidth="2.5" />
      <circle cx="32" cy="32" r="16" fill="none" stroke={T.ink} strokeWidth="1.5" strokeDasharray="2 3" />
      <text x="32" y="40" fontFamily="system-ui" fontSize="22" fontWeight="900" textAnchor="middle" fill={T.ink}>?</text>
      <ellipse cx="48" cy="14" rx="10" ry="6" fill={T.paper} stroke={T.ink} strokeWidth="2" />
      <circle cx="48" cy="14" r="3" fill={T.ink} />
    </svg>
  );
}

export function IconMedusa({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M16 26 Q12 14 17 7" stroke={T.mint} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="17" cy="6" r="2.5" fill={T.mint} />
      <path d="M26 22 Q24 10 28 4" stroke={T.mint} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="3" r="2.5" fill={T.mint} />
      <path d="M38 22 Q40 10 36 4" stroke={T.mint} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="36" cy="3" r="2.5" fill={T.mint} />
      <path d="M48 26 Q52 14 47 7" stroke={T.mint} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="47" cy="6" r="2.5" fill={T.mint} />
      <ellipse cx="32" cy="38" rx="22" ry="14" fill={T.paper} stroke={T.ink} strokeWidth="2.5" />
      <circle cx="32" cy="38" r="8" fill={T.cobalt} />
      <circle cx="32" cy="38" r="4" fill={T.ink} />
      <circle cx="34" cy="36" r="2" fill="#fff" />
    </svg>
  );
}

export function IconApero({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="22" y="6" width="24" height="36" rx="4" fill={T.pink} stroke={T.ink} strokeWidth="2.5" transform="rotate(10 34 24)" />
      <rect x="16" y="10" width="24" height="36" rx="4" fill={T.paper} stroke={T.ink} strokeWidth="2.5" />
      <text x="28" y="26" fontFamily="system-ui" fontSize="11" fontWeight="900" textAnchor="middle" fill={T.tomato}>♥</text>
      <text x="28" y="40" fontFamily="system-ui" fontSize="14" fontWeight="900" textAnchor="middle" fill={T.ink}>7</text>
    </svg>
  );
}

export function IconCasting({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M27 12 L12 56 H52 L37 12Z" fill={T.orange} opacity="0.3" />
      <rect x="22" y="2" width="20" height="13" rx="4" fill={T.ink} />
      <ellipse cx="32" cy="15" rx="7" ry="2.5" fill={T.orange} />
      <path d="M32 28 L34.8 36.2 H43 L36.4 41.2 L38.8 49.5 L32 44.3 L25.2 49.5 L27.6 41.2 L21 36.2 H29.2Z" fill={T.lemon} stroke={T.ink} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRedFlag({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="12" y="8" width="4" height="50" rx="2" fill={T.ink} />
      <path d="M16 12 H50 C50 12 43 20 50 28 H16 Z" fill={T.red} stroke={T.ink} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="14" cy="8" r="3.5" fill={T.lemon} stroke={T.ink} strokeWidth="2" />
    </svg>
  );
}
