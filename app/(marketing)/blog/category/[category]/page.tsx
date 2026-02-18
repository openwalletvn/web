import type { Metadata } from 'next';
import { getAllCategories, getPostsByCategory } from '@/lib/mdx';
import { PostList } from '@/components/blog/post-list';
import { CategoryFilter } from '@/components/blog/category-filter';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const categories = getAllCategories();
  const cat = categories.find((c) => c.slug === slug);
  const displayName = cat?.name ?? slug;
  return {
    title: `${displayName} — Blog | OpenWallet`,
    description: `Bài viết về chủ đề "${displayName}" trên OpenWallet Blog.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const categories = getAllCategories();
  const cat = categories.find((c) => c.slug === slug);
  const displayName = cat?.name ?? slug;
  const posts = getPostsByCategory(slug);

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: displayName },
          ]}
        />

        <h1 className="text-4xl font-bold text-slate-900 mb-1">{displayName}</h1>
        <p className="text-slate-500 mb-8">
          {posts.length} bài viết trong chủ đề này
        </p>

        <div className="mb-6">
          <CategoryFilter categories={categories} activeSlug={slug} />
        </div>

        <PostList
          posts={posts}
          emptyMessage={`Chưa có bài viết nào trong chủ đề "${displayName}".`}
        />
      </div>
    </div>
  );
}
