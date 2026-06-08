import Link from 'next/link';
import type {Post} from '@/lib/mdx';
import {resolvePosts} from '@/lib/mdx';
import {ROUTES} from '@/lib/routes';
import {fmtIsoDate} from '@/lib/utils';

function CategoryLink({category, categorySlug}: {category: string; categorySlug: string}) {
    return (
        <Link
            href={ROUTES.blogCategory(categorySlug)}
            className="text-text-accent font-medium hover:underline"
        >
            {category}
        </Link>
    );
}

function FeaturedMainCard({post}: {post: Post}) {
    return (
        <div className="group flex flex-col gap-3 h-full ow-rounded-small border border-border bg-white hover:border-border-dark hover:shadow-sm transition-all overflow-hidden">
            {post.frontmatter.cover_image ? (
                <Link href={ROUTES.blogPost(post.slug)} className="block aspect-[16/9] overflow-hidden bg-bg-muted">
                    <img
                        src={post.frontmatter.cover_image}
                        alt={post.frontmatter.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>
            ) : (
                <Link href={ROUTES.blogPost(post.slug)} className="block aspect-[16/9] bg-bg-warm"/>
            )}
            <div className="flex flex-col gap-2 px-4 pb-4">
                <div className="ow-post-category-date flex items-center gap-2 text-xs text-text-muted">
                    <CategoryLink category={post.frontmatter.category} categorySlug={post.categorySlug}/>
                    <span>·</span>
                    <span>{fmtIsoDate(post.frontmatter.date)}</span>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                </div>
                <Link href={ROUTES.blogPost(post.slug)}>
                    <h3 className="text-body font-semibold text-text-primary hover:text-text-accent transition-colors line-clamp-3">
                        {post.frontmatter.title}
                    </h3>
                </Link>
                <p className="text-body-sm text-text-muted line-clamp-2">
                    {post.frontmatter.description}
                </p>
            </div>
        </div>
    );
}

function FeaturedSideItem({post}: {post: Post}) {
    return (
        <div className="flex flex-col gap-1 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="flex items-center gap-2 text-xs text-text-muted">
                <CategoryLink category={post.frontmatter.category} categorySlug={post.categorySlug}/>
                <span>·</span>
                <span>{fmtIsoDate(post.frontmatter.date)}</span>
            </div>
            <Link
                href={ROUTES.blogPost(post.slug)}
                className="text-body font-medium text-text-primary hover:text-text-accent transition-colors line-clamp-2"
            >
                {post.frontmatter.title}
            </Link>
            <p className="text-body-sm text-text-muted line-clamp-2">
                {post.frontmatter.description}
            </p>
        </div>
    );
}

export function OwFeaturedPosts({allPosts, slugs, title}: {
    allPosts: Post[];
    slugs?: string[];
    title?: string;
}) {
    const posts = resolvePosts(allPosts, slugs);
    if (posts.length === 0) return null;

    const [featured, ...rest] = posts;

    return (
        <section className="ow-featured-posts flex flex-col gap-4">
            {title && <h2 className="text-ui text-text-primary">{title}</h2>}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 md:gap-x-6 gap-y-6">
                {/* Left: featured post */}
                <div className="md:col-span-7">
                    <FeaturedMainCard post={featured}/>
                </div>

                {/* Right: sidebar list */}
                {rest.length > 0 && (
                    <div className="md:col-span-5 flex flex-col gap-4 justify-start">
                        {rest.map((post) => (
                            <FeaturedSideItem key={post.slug} post={post}/>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
