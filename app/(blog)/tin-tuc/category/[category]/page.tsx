import type {Metadata} from 'next';
import {getAllCategories, getPostsByCategory} from '@/lib/mdx';
import {ROUTES} from '@/lib/routes';
import {PostList} from '@/components/blog/post-list';
import {CategoryFilter} from '@/components/blog/category-filter';
import {BlogPageShell} from '@/components/layout/blog-page-shell';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

interface Props {
 params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
 const categories = getAllCategories();
 return categories.map(({slug}) => ({category: slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
 const {category: slug} = await params;
 const categories = getAllCategories();
 const cat = categories.find((c) => c.slug === slug);
 const displayName = cat?.name ?? slug;
 const posts = getPostsByCategory(slug);
 const {metadata} = buildCollectionPageMeta({
 title: `${displayName} - Blog | OpenWallet`,
 description: `Bài viết về chủ đề"${displayName}" trên OpenWallet Blog.`,
 url: ROUTES.blogCategory(slug),
 items: posts.map((p) => ({name: p.frontmatter.title, url: ROUTES.blogPost(p.slug)})),
 breadcrumbItems: [
 {label: 'Trang chủ', href: '/'},
 {label: 'Tin tức', href: ROUTES.blog},
 {label: displayName},
 ],
 });
 return metadata;
}

export default async function CategoryPage({params}: Props) {
 const {category: slug} = await params;

 const categories = getAllCategories();
 const cat = categories.find((c) => c.slug === slug);
 const displayName = cat?.name ?? slug;
 const posts = getPostsByCategory(slug);

 const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
 title: `${displayName} - Blog | OpenWallet`,
 description: `Bài viết về chủ đề"${displayName}" trên OpenWallet Blog.`,
 url: ROUTES.blogCategory(slug),
 items: posts.map((p) => ({name: p.frontmatter.title, url: ROUTES.blogPost(p.slug)})),
 breadcrumbItems: [
 {label: 'Trang chủ', href: '/'},
 {label: 'Tin tức', href: ROUTES.blog},
 {label: displayName},
 ],
 });

    return (
        <BlogPageShell
            title={displayName}
            description={`${posts.length} bài viết trong chủ đề này`}
            breadcrumbItems={breadcrumbItems}
            jsonLd={jsonLd}
        >
            <div className="mb-6">
                <CategoryFilter categories={categories} activeSlug={slug}/>
            </div>

            <PostList posts={posts} emptyMessage={`Chưa có bài viết nào trong chủ đề "${displayName}".`}/>
        </BlogPageShell>
    );
}
