import {createOgImage, OG_SIZE} from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
    return createOgImage({
        title: 'Thẻ ngân hàng',
        description: 'Danh sách tất cả các Thẻ ngân hàng Việt Nam trên OpenWallet.',
    });
}
