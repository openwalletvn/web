import { createOgImage, OG_SIZE } from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createOgImage({ title: 'The 2-trong-1', description: 'Open Wallet · The ngan hang Viet Nam' });
}
