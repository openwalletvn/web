import {createOgImage, OG_SIZE} from '@/lib/og';
import {getTranslations} from "next-intl/server";

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
    const t = await getTranslations('CardsPage');
    return createOgImage({
        title: t('type_credit'),
        description: t('meta_description'),
    });
}