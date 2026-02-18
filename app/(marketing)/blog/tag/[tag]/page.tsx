import type { Metadata } from 'next';
import { getAllTags, getPostsByTag } from '@/lib/mdx';
import { PostList } from '@/components/blog/post-list';
import { TagList } from '@/components/blog/tag-list';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

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
  const displayName = found?.name ?? slug;
  return {
    title: `#${displayName} — Blog | OpenWallet`,
    description: `Bài viết được gắn thẻ "${displayName}" trên OpenWallet Blog.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag: slug } = await params;
  const tags = getAllTags();
  const found = tags.find((t) => t.slug === slug);
  const displayName = found?.name ?? slug;
  const posts = getPostsByTag(slug);

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: `#${displayName}` },
          ]}
        />

        <h1 className="text-4xl font-bold text-slate-900 mb-1">
          <span className="text-slate-400 font-normal">#</span>
          {displayName}
        </h1>
        <p className="text-slate-500 mb-8">
          {posts.length} bài viết với thẻ này
        </p>

        <PostList
          posts={posts}
          emptyMessage={`Chưa có bài viết nào với thẻ "${displayName}".`}
        />

        {tags.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Các thẻ khác
            </h2>
            <TagList tags={tags} activeSlug={slug} />
          </div>
        )}
      </div>
    </div>
  );
}
