import Image from 'next/image';

const RATIO = 2160 / 1080;

type Props = { size?: number };

export default function SiteLogo({ size = 48 }: Props) {
  const width = Math.round(size * RATIO);
  return (
    <Image
      src="/logo_banniere.webp"
      alt="Fl!p"
      width={width}
      height={size}
      priority
      style={{ display: 'block', height: size, width: 'auto', margin: '0 auto' }}
    />
  );
}
