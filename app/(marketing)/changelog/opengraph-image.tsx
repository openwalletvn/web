import {createOgImage, OG_SIZE} from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
    return createOgImage({
        title: 'Changelog',
        description: 'Những cập nhật mới nhất về tính năng, dữ liệu và cải tiến kỹ thuật của OpenWallet.',
    });
}
