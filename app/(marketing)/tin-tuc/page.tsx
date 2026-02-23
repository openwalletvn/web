import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/mdx';
import { PostList } from '@/components/blog/post-list';
import { CategoryFilter } from '@/components/blog/category-filter';
import { TagList } from '@/components/blog/tag-list';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { createBlogIndexMetadata } from './_helpers';

export async function generateMetadata(): Promise<Metadata> {
  return createBlogIndexMetadata();
}

export default async function BlogPage() {
  const [t, breadcrumbs] = await Promise.all([
    getTranslations('BlogPage'),
    getTranslations('Breadcrumbs'),
  ]);

  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: breadcrumbs('home'), href: '/' }, { label: breadcrumbs('blog') }]} />

        <h1 className="text-4xl font-bold text-slate-900 mb-1">{t('title')}</h1>
        <p className="text-slate-500 mb-8">{t('subtitle')}</p>

        {categories.length > 0 && (
          <div className="mb-6">
            <CategoryFilter categories={categories} />
          </div>
        )}

        <PostList posts={posts} emptyMessage={t('empty')} />

        {tags.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {t('topics')}
            </h2>
            <TagList tags={tags} />
          </div>
        )}
      </div>
    </div>
  );
}
