import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getAllTags, getPostsByTag} from '@/lib/mdx';
import {PostList} from '@/components/blog/post-list';
import {TagList} from '@/components/blog/tag-list';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
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
        description: `Bài viết được gắn thẻ "${displayName}" trên OpenWallet Blog.`,
        url: `/tin-tuc/tag/${slug}`,
        items: posts.map((p) => ({name: p.frontmatter.title, url: `/tin-tuc/${p.slug}`})),
        breadcrumbItems: [
            {label: 'Trang chủ', href: '/'},
            {label: 'Tin tức', href: '/tin-tuc'},
            {label: `#${displayName}`},
        ],
    });
    return metadata;
}

export default async function TagPage({params}: Props) {
    const {tag: slug} = await params;
    const [t] = await Promise.all([
        getTranslations('BlogPage'),
    ]);

    const tags = getAllTags();
    const found = tags.find((tag) => tag.slug === slug);
    const displayName = found?.name ?? slug;
    const posts = getPostsByTag(slug);

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: `#${displayName} - Blog | OpenWallet`,
        description: `Bài viết được gắn thẻ "${displayName}" trên OpenWallet Blog.`,
        url: `/tin-tuc/tag/${slug}`,
        items: posts.map((p) => ({name: p.frontmatter.title, url: `/tin-tuc/${p.slug}`})),
        breadcrumbItems: [
            {label: 'Trang chủ', href: '/'},
            {label: 'Tin tức', href: '/tin-tuc'},
            {label: `#${displayName}`},
        ],
    });

    return (
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <Breadcrumbs items={breadcrumbItems}/>

                <h1 className="text-4xl font-bold text-slate-900 mb-1">
                    <span className="text-slate-500 font-normal">#</span>
                    {displayName}
                </h1>
                <p className="text-slate-500 mb-8">{t('tag_count', {count: posts.length})}</p>

                <PostList posts={posts} emptyMessage={t('tag_empty', {name: displayName})}/>

                {tags.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                            {t('other_tags')}
                        </h2>
                        <TagList tags={tags} activeSlug={slug}/>
                    </div>
                )}
            </div>
        </div>
    );
}
