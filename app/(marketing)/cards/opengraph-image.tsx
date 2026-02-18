import { createOgImage, OG_SIZE } from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createOgImage({
    title: 'The ngan hang',
    description: 'Kham pha the tin dung, the ghi no tu cac ngan hang Viet Nam.',
  });
}
