import {getAllPosts} from '@/lib/mdx';
import {PostCard} from '@/components/blog/post-card';

export function RecentPostsSection() {
    const posts = getAllPosts().slice(0, 3);

    if (posts.length === 0) return null;

    return (
        <section className="ow-recent-posts-section py-12 bg-bg-light">
            <div className="ow-container">
                <div className="mb-6">
                    <h2>Kiến thức tài chính</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map((post) => (
                        <PostCard key={post.slug} post={post}/>
                    ))}
                </div>
            </div>
        </section>
    );
}
