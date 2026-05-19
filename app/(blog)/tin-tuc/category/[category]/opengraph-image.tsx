import { getAllCategories } from '@/lib/mdx';
import { createBlogCategoryOgImage } from '../../_helpers';
import { OG_SIZE } from '@/lib/og';

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
  return createBlogCategoryOgImage(cat?.name ?? slug);
}
