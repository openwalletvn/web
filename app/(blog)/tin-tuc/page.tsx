import type {Metadata} from 'next';
import {getAllPosts} from '@/lib/mdx';
import {ROUTES} from '@/lib/routes';
// import {PostList} from '@/components/blog/post-list';
// import {CategoryFilter} from '@/components/blog/category-filter';
import {BlogPageShell} from '@/components/layout/blog-page-shell';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {OwFeaturedPosts} from '@/components/ow-ui/ow-featured-posts';
import {OwPostList} from '@/components/ow-ui/ow-post-list';

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Tin tức'},
];

export async function generateMetadata(): Promise<Metadata> {
    const posts = getAllPosts();
    const {metadata} = buildCollectionPageMeta({
        title: 'Blog - Kiến thức tài chính cá nhân | OpenWallet',
        description: 'Hướng dẫn quản lý thẻ ngân hàng, tối ưu điểm thưởng và kiến thức tài chính cá nhân dành cho người Việt.',
        url: ROUTES.blog,
        items: posts.map((p) => ({name: p.frontmatter.title, url: ROUTES.blogPost(p.slug)})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function BlogPage() {
    const posts = getAllPosts();

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: 'Blog - Kiến thức tài chính cá nhân | OpenWallet',
        description: 'Hướng dẫn quản lý thẻ ngân hàng, tối ưu điểm thưởng và kiến thức tài chính cá nhân dành cho người Việt.',
        url: ROUTES.blog,
        items: posts.map((p) => ({name: p.frontmatter.title, url: ROUTES.blogPost(p.slug)})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    return (
        <BlogPageShell
            title="Tin tức"
            description="Kiến thức tài chính cá nhân, hướng dẫn sử dụng thẻ và mẹo quản lý chi tiêu."
            breadcrumbItems={breadcrumbItems}
            jsonLd={jsonLd}
        >
            <div className="flex flex-col gap-12">
                <OwFeaturedPosts allPosts={posts}/>
                <OwPostList posts={posts} title={`Tất cả bài viết (${posts.length})`}/>
            </div>
        </BlogPageShell>
    );
}
