import type { Post } from '@/lib/mdx';
import { OwPostList } from '@/components/owui/ow-post-list';

interface Props {
    posts: Post[];
}

export function RelatedPosts({ posts }: Props) {
    if (posts.length === 0) return null;

    return (
        <div className="ow-related-posts">
            <OwPostList posts={posts} title="Bài viết liên quan" />
        </div>
    );
}
