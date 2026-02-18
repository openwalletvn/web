import { getAllCategories } from '@/lib/mdx';
import { createOgImage, OG_SIZE } from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map(({ slug }) => ({ category: slug }));
}

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const categories = getAllCategories();
  const cat = categories.find((c) => c.slug === slug);
  const displayName = cat?.name ?? slug;

  return createOgImage({
    title: displayName,
    description: `Bài viết về chủ đề "${displayName}" trên OpenWallet Blog.`,
  });
}
