import {createOgImage, OG_SIZE} from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
    return createOgImage({
        title: 'Ngân hàng',
        description: 'Danh sách tất cả các ngân hàng Việt Nam trên Open Wallet.',
    });
}