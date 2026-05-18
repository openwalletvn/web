import type { Post } from '@/lib/mdx';
import { PostCard } from './post-card';

interface Props {
  posts: Post[];
}

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="ow-related-posts">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Bài viết liên quan</h2>
      <div className="border-t border-dashed border-slate-300 mt-1 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
