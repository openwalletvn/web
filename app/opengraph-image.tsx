import {createOgImage, OG_SIZE} from '@/lib/og';
import {getTranslations} from "next-intl/server";

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
    const [metadata, organization] = await Promise.all([
        getTranslations('metadata'),
        getTranslations('organization'),
    ]);
  return createOgImage({
      title: metadata('siteName'),
      description: organization('description'),
  });
}
