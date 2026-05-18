import type { Post } from '@/lib/mdx';
import { PostCard } from './post-card';

interface Props {
  posts: Post[];
  emptyMessage?: string;
}

export function PostList({ posts, emptyMessage = 'Chưa có bài viết nào.' }: Props) {
  if (posts.length === 0) {
    return (
      <div className="ow-post-list py-16 text-center border border-dashed border-slate-200 rounded-sm">
        <p className="text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="ow-post-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
