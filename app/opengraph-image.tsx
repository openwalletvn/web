import {createOgImage, OG_SIZE} from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return createOgImage({
      title: 'Open Wallet',
      description: 'Nguồn dữ liệu thẻ ngân hàng Việt Nam mã nguồn mở.',
  });
}
