import type {Metadata} from 'next';
import {getAllPosts, getAllCategories, getAllTags} from '@/lib/mdx';
import {PostList} from '@/components/blog/post-list';
import {CategoryFilter} from '@/components/blog/category-filter';
import {TagList} from '@/components/blog/tag-list';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Tin tức'},
];

export async function generateMetadata(): Promise<Metadata> {
    const posts = getAllPosts();
    const {metadata} = buildCollectionPageMeta({
        title: 'Blog - Kiến thức tài chính cá nhân | OpenWallet',
        description: 'Hướng dẫn quản lý thẻ ngân hàng, tối ưu điểm thưởng và kiến thức tài chính cá nhân dành cho người Việt.',
        url: '/tin-tuc',
        items: posts.map((p) => ({name: p.frontmatter.title, url: `/tin-tuc/${p.slug}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function BlogPage() {
    const posts = getAllPosts();
    const categories = getAllCategories();
    const tags = getAllTags();

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: 'Blog - Kiến thức tài chính cá nhân | OpenWallet',
        description: 'Hướng dẫn quản lý thẻ ngân hàng, tối ưu điểm thưởng và kiến thức tài chính cá nhân dành cho người Việt.',
        url: '/tin-tuc',
        items: posts.map((p) => ({name: p.frontmatter.title, url: `/tin-tuc/${p.slug}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    return (
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <Breadcrumbs items={breadcrumbItems}/>

                <h1 className="mb-1">Tin tức</h1>
                <p className="text-text-muted mb-8">Kiến thức tài chính cá nhân, hướng dẫn sử dụng thẻ và mẹo quản lý chi tiêu.</p>

                {categories.length > 0 && (
                    <div className="mb-6">
                        <CategoryFilter categories={categories}/>
                    </div>
                )}

                <PostList posts={posts} emptyMessage='Chưa có bài viết nào. Quay lại sớm nhé!'/>

                {tags.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-label text-text-muted mb-3">
                            Chủ đề
                        </h2>
                        <TagList tags={tags}/>
                    </div>
                )}
            </div>
        </div>
    );
}
