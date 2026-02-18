import { createOgImage, OG_SIZE } from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createOgImage({
    title: 'Blog',
    description:
      'Hướng dẫn quản lý thẻ ngân hàng, tối ưu điểm thưởng và kiến thức tài chính cá nhân dành cho người Việt.',
  });
}
