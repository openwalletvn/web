import { createOgImage, OG_SIZE } from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
    return createOgImage({
        title: 'So Sánh Thẻ Tín Dụng',
        description: 'So sánh phí, ưu đãi và tính năng thẻ ngân hàng Việt Nam.',
    });
}
