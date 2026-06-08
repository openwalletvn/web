import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {MDXRemote} from 'next-mdx-remote/rsc';
import {getAllPosts, getPostBySlug, getRelatedPosts} from '@/lib/mdx';
import {RelatedPosts} from '@/components/blog/related-posts';
import {OwButton} from '@/components/ow-ui/ow-button';
import {OwBadge} from '@/components/ow-ui/ow-badge';
import {SidebarRelatedCards} from '@/components/blog/sidebar-related-cards';
import {mdxComponents} from '@/components/blog/mdx-components';
import {remarkAutoLink} from '@/lib/remark-auto-link';
import remarkGfm from 'remark-gfm';
import {buildBlogPostPageMeta} from '@/lib/page-meta/blog-post';
import {fmtIsoDateLong} from '@/lib/utils';
import {IconArrowLeft, IconPencil} from '@tabler/icons-react';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((p) => ({slug: p.slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug} = await params;
    const post = getPostBySlug(slug);
    if (!post) return {title: 'Không tìm thấy | OpenWallet'};
    const {metadata} = buildBlogPostPageMeta(post);
    return metadata;
}

export default async function BlogPostPage({params}: Props) {
    const {slug} = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const {jsonLd, breadcrumbItems} = buildBlogPostPageMeta(post);
    const related = getRelatedPosts(post);
    const {frontmatter, content} = post;
    const cardSlugs = frontmatter.card_slugs ?? [];

    return (
        <div className="ow-container md:pt-16 md:pb-32 pt-8 pb-14">
            {process.env.NODE_ENV === 'development' && (
                <a
                    href={`http://localhost:3004/blog/${slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="fixed bottom-5 right-5 z-50 px-3 py-1.5 rounded bg-gray-900 text-white text-xs font-medium shadow-lg hover:bg-gray-700 transition-colors"
                >
                    <IconPencil size={14}/> Edit images
                </a>
            )}

            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>

            {/* Invisible breadcrumb — JSON-LD only, visually hidden */}
            <nav aria-label="breadcrumb" className="sr-only">
                {breadcrumbItems.map((item, i) => (
                    <span key={i}>{item.label}</span>
                ))}
            </nav>

            <div className="max-w-3xl mx-auto">
                {/* Header — centered 3 lines */}
                <header className="text-center mb-10">
                    <div className="mb-3 flex items-center justify-center gap-2">
                        <OwBadge href={`/tin-tuc/category/${post.categorySlug}`}>
                            {frontmatter.category}
                        </OwBadge>
                    </div>

                    <h1 className="mb-3">{frontmatter.title}</h1>

                    <time className="text-body-sm text-text-muted" dateTime={frontmatter.date}>
                        {fmtIsoDateLong(frontmatter.date)}
                        {frontmatter.updated && frontmatter.updated !== frontmatter.date && (
                            <span className="text-text-subtle"> · Cập nhật: {fmtIsoDateLong(frontmatter.updated)}</span>
                        )}
                    </time>
                </header>

                {/* Featured image */}
                {frontmatter.cover_image && (
                    <div className="ow-post-featured-image mb-10 overflow-hidden ow-rounded-small lg:-mx-20">
                        <Image
                            src={frontmatter.cover_image}
                            alt={frontmatter.title}
                            width={900}
                            height={500}
                            className="w-full object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Content */}
                <article
                    className="prose prose-slate max-w-none prose-headings:font-normal prose-headings:text-text-primary prose-p:text-text-muted prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-code:text-primary prose-code:before:content-none prose-code:after:content-none prose-li:text-text-muted prose-hr:border-dashed prose-hr:border-border prose-table:text-sm prose-th:text-text-muted prose-th:bg-bg-light prose-td:text-text-muted">
                    <MDXRemote
                        source={content}
                        components={mdxComponents}
                        options={{mdxOptions: {remarkPlugins: [remarkGfm, remarkAutoLink]}}}
                    />
                </article>

                <div className="border-t border-dashed border-slate-200 my-12"/>

                {cardSlugs.length > 0 && (
                    <div className="mb-10">
                        <SidebarRelatedCards cardSlugs={cardSlugs}/>
                    </div>
                )}

                {related.length > 0 && <RelatedPosts posts={related}/>}

                <div className="mt-10">
                    <OwButton asChild color="outline" size="sm">
                        <Link href="/tin-tuc"><IconArrowLeft size={16}/> Về trang Blog</Link>
                    </OwButton>
                </div>
            </div>
        </div>
    );
}
