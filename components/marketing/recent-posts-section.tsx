import {getAllPosts} from '@/lib/mdx';
import {OwFeaturedPosts} from '@/components/ow-ui/ow-featured-posts';

export function RecentPostsSection() {
    const posts = getAllPosts().slice(0, 4);

    if (posts.length === 0) return null;

    return (
        <section className="ow-recent-posts-section md:py-16 py-12">
            <div className="ow-container">
              <OwFeaturedPosts allPosts={posts} title="Thông tin" variant="grid"/>
            </div>
        </section>
    );
}
