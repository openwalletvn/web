import { getAllTags } from '@/lib/mdx';
import { createOgImage, OG_SIZE } from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ slug }) => ({ tag: slug }));
}

export default async function Image({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: slug } = await params;
  const tags = getAllTags();
  const found = tags.find((t) => t.slug === slug);
  const displayName = found?.name ?? slug;

  return createOgImage({
    title: `#${displayName}`,
    description: `Bài viết được gắn thẻ "${displayName}" trên OpenWallet Blog.`,
  });
}
