import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllTags, getPostsByTag } from '@/lib/mdx';
import { PostList } from '@/components/blog/post-list';
import { TagList } from '@/components/blog/tag-list';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { createBlogTagMetadata } from '../../_helpers';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: slug } = await params;
  const tags = getAllTags();
  const found = tags.find((t) => t.slug === slug);
  return createBlogTagMetadata(found?.name ?? slug);
}

export default async function TagPage({ params }: Props) {
  const { tag: slug } = await params;
  const [t, breadcrumbs] = await Promise.all([
    getTranslations('BlogPage'),
    getTranslations('Breadcrumbs'),
  ]);

  const tags = getAllTags();
  const found = tags.find((tag) => tag.slug === slug);
  const displayName = found?.name ?? slug;
  const posts = getPostsByTag(slug);

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: breadcrumbs('home'), href: '/' },
            { label: breadcrumbs('blog'), href: '/blog' },
            { label: `#${displayName}` },
          ]}
        />

        <h1 className="text-4xl font-bold text-slate-900 mb-1">
          <span className="text-slate-400 font-normal">#</span>
          {displayName}
        </h1>
        <p className="text-slate-500 mb-8">{t('tag_count', { count: posts.length })}</p>

        <PostList posts={posts} emptyMessage={t('tag_empty', { name: displayName })} />

        {tags.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {t('other_tags')}
            </h2>
            <TagList tags={tags} activeSlug={slug} />
          </div>
        )}
      </div>
    </div>
  );
}
