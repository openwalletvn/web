import { createOgImage, OG_SIZE } from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createOgImage({
    title: 'Ngan hang',
    description: 'Danh sach ngan hang Viet Nam tren Open Wallet.',
  });
}
