import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {MDXRemote} from 'next-mdx-remote/rsc';
import {getTranslations} from 'next-intl/server';
import {getAllPosts, getPostBySlug, getRelatedPosts, extractHeadings} from '@/lib/mdx';
import {RelatedPosts} from '@/components/blog/related-posts';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {BlogToc} from '@/components/blog/blog-toc';
import {AiBadge} from '@/components/blog/ai-badge';
import {SidebarRelatedCards} from '@/components/blog/sidebar-related-cards';
import {mdxComponents} from '@/components/blog/mdx-components';
import {remarkAutoLink} from '@/lib/remark-auto-link';
import remarkGfm from 'remark-gfm';
import {buildBlogPostPageMeta} from '@/lib/page-meta/blog-post';

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

    const [t] = await Promise.all([
        getTranslations('BlogPage'),
    ]);

    const {jsonLd, breadcrumbItems} = buildBlogPostPageMeta(post);
    const related = getRelatedPosts(post);
    const {frontmatter, content, readingTime, tagSlugs} = post;
    const headings = extractHeadings(content);
    const cardSlugs = frontmatter.card_slugs ?? [];

    return (
        <div className="px-4 py-12">
            {process.env.NODE_ENV === 'development' && (
                <a
                    href={`http://localhost:3004/blog/${slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="fixed bottom-5 right-5 z-50 px-3 py-1.5 rounded bg-gray-900 text-white text-xs font-medium shadow-lg hover:bg-gray-700 transition-colors"
                >
                    ✏️ Edit images
                </a>
            )}
            <div className="max-w-container mx-auto">
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <Breadcrumbs items={breadcrumbItems}/>

                <div className="flex gap-10 items-start">
                    {/* ── Main content ── */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <header className="mb-10">
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                <Link
                                    href={`/tin-tuc/category/${post.categorySlug}`}
                                    className="text-sm font-medium px-2.5 py-1 border border-dashed border-brand-blue text-brand-blue rounded-sm hover:bg-blue-50/60 transition-colors"
                                >
                                    {frontmatter.category}
                                </Link>
                                <span className="text-sm text-slate-500">{readingTime}</span>
                                {frontmatter.ai_generated && <AiBadge size="md"/>}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
                                {frontmatter.title}
                            </h1>

                            <p className="text-lg text-slate-500 leading-relaxed mb-5">
                                {frontmatter.description}
                            </p>

                            <div
                                className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4">
                                <div className="flex items-center gap-3">
                                    {frontmatter.author && (
                                        <span className="text-sm text-slate-600 font-medium">{frontmatter.author}</span>
                                    )}
                                    <time className="text-sm text-slate-500" dateTime={frontmatter.date}>
                                        {new Date(frontmatter.date).toLocaleDateString('vi-VN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </time>
                                </div>

                                {frontmatter.tags.length > 0 && (
                                    <div className="flex gap-1.5 flex-wrap justify-end">
                                        {frontmatter.tags.map((tag, i) => (
                                            <Link
                                                key={tagSlugs[i]}
                                                href={`/tin-tuc/tag/${tagSlugs[i]}`}
                                                className="text-xs px-2 py-0.5 border border-dashed border-slate-200 text-slate-500 rounded-sm hover:border-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </header>

                        {/* Content */}
                        <article
                            className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:text-brand-red prose-code:before:content-none prose-code:after:content-none prose-li:text-slate-700 prose-hr:border-dashed prose-hr:border-slate-200 prose-table:text-sm prose-th:text-slate-700 prose-th:bg-slate-50 prose-td:text-slate-600">
                            <MDXRemote
                                source={content}
                                components={mdxComponents}
                                options={{mdxOptions: {remarkPlugins: [remarkGfm, remarkAutoLink]}}}
                            />
                        </article>

                        {/* Divider */}
                        <div className="border-t border-dashed border-slate-200 my-12"/>

                        {/* Related posts */}
                        {related.length > 0 && <RelatedPosts posts={related}/>}

                        {/* Back link */}
                        <div className="mt-10">
                            <Link
                                href="/tin-tuc"
                                className="inline-block px-6 py-2.5 border border-dashed border-slate-300 rounded-sm font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors text-sm"
                            >
                                {t('back')}
                            </Link>
                        </div>
                    </div>

                    {/* ── Sidebar ── */}
                    <aside className="w-56 shrink-0 hidden lg:flex flex-col sticky top-24 self-start">
                        <BlogToc headings={headings}/>
                        {cardSlugs.length > 0 && <SidebarRelatedCards cardSlugs={cardSlugs}/>}
                    </aside>
                </div>
            </div>
        </div>
    );
}
