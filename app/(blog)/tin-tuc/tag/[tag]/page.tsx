import type {Metadata} from 'next';
import {getAllTags, getPostsByTag} from '@/lib/mdx';
import {ROUTES} from '@/lib/routes';
import {PostList} from '@/components/blog/post-list';
import {TagList} from '@/components/blog/tag-list';
import {BlogPageShell} from '@/components/layout/blog-page-shell';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

interface Props {
 params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
 const tags = getAllTags();
 return tags.map(({slug}) => ({tag: slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
 const {tag: slug} = await params;
 const tags = getAllTags();
 const found = tags.find((t) => t.slug === slug);
 const displayName = found?.name ?? slug;
 const posts = getPostsByTag(slug);
 const {metadata} = buildCollectionPageMeta({
 title: `#${displayName} - Blog | OpenWallet`,
 description: `Bài viết được gắn thẻ"${displayName}" trên OpenWallet Blog.`,
 url: ROUTES.blogTag(slug),
 items: posts.map((p) => ({name: p.frontmatter.title, url: ROUTES.blogPost(p.slug)})),
 breadcrumbItems: [
 {label: 'Trang chủ', href: '/'},
 {label: 'Tin tức', href: ROUTES.blog},
 {label: `#${displayName}`},
 ],
 });
 return metadata;
}

export default async function TagPage({params}: Props) {
 const {tag: slug} = await params;

 const tags = getAllTags();
 const found = tags.find((tag) => tag.slug === slug);
 const displayName = found?.name ?? slug;
 const posts = getPostsByTag(slug);

 const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
 title: `#${displayName} - Blog | OpenWallet`,
 description: `Bài viết được gắn thẻ"${displayName}" trên OpenWallet Blog.`,
 url: ROUTES.blogTag(slug),
 items: posts.map((p) => ({name: p.frontmatter.title, url: ROUTES.blogPost(p.slug)})),
 breadcrumbItems: [
 {label: 'Trang chủ', href: '/'},
 {label: 'Tin tức', href: ROUTES.blog},
 {label: `#${displayName}`},
 ],
 });

    return (
        <BlogPageShell
            title={<><span className="text-text-muted font-normal">#</span>{displayName}</>}
            description={`${posts.length} bài viết với thẻ này`}
            breadcrumbItems={breadcrumbItems}
            jsonLd={jsonLd}
        >
            <PostList posts={posts} emptyMessage={`Chưa có bài viết nào với thẻ "${displayName}".`}/>

            {tags.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-label text-text-muted mb-3">
                        Các thẻ khác
                    </h2>
                    <TagList tags={tags} activeSlug={slug}/>
                </div>
            )}
        </BlogPageShell>
    );
}
