const HEX = '0123456789abcdef';

function randHex(length: number): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += HEX[Math.floor(Math.random() * 16)];
  }
  return out;
}

export function randomUUID(): string {
  const g = globalThis as { crypto?: { randomUUID?: () => string } };
  if (typeof g.crypto?.randomUUID === 'function') {
    return g.crypto.randomUUID();
  }
  return `${randHex(8)}-${randHex(4)}-4${randHex(3)}-${HEX[8 + Math.floor(Math.random() * 4)]}${randHex(3)}-${randHex(12)}`;
}
