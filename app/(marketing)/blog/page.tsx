import type { Metadata } from 'next';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/mdx';
import { PostList } from '@/components/blog/post-list';
import { CategoryFilter } from '@/components/blog/category-filter';
import { TagList } from '@/components/blog/tag-list';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export const metadata: Metadata = {
  title: 'Blog — Kiến thức tài chính cá nhân | OpenWallet',
  description: 'Hướng dẫn quản lý thẻ ngân hàng, tối ưu điểm thưởng và kiến thức tài chính cá nhân dành cho người Việt.',
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Blog' }]} />

        <h1 className="text-4xl font-bold text-slate-900 mb-1">Blog</h1>
        <p className="text-slate-500 mb-8">
          Kiến thức tài chính cá nhân, hướng dẫn sử dụng thẻ và mẹo quản lý chi tiêu.
        </p>

        {categories.length > 0 && (
          <div className="mb-6">
            <CategoryFilter categories={categories} />
          </div>
        )}

        <PostList posts={posts} emptyMessage="Chưa có bài viết nào. Quay lại sớm nhé!" />

        {tags.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Chủ đề
            </h2>
            <TagList tags={tags} />
          </div>
        )}
      </div>
    </div>
  );
}
