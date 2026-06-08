import Link from 'next/link';
import type {Post} from '@/lib/mdx';
import {ROUTES} from '@/lib/routes';
import {fmtIsoDate} from '@/lib/utils';

export function OwPostList({posts, title = 'Tất cả bài viết'}: {
    posts: Post[];
    title?: string;
}) {
    if (posts.length === 0) {
        return (
            <section className="ow-post-list flex flex-col gap-4">
                <h2 className="heading-3">{title}</h2>
                <p className="text-body-sm text-text-muted py-8 text-center">Chưa có bài viết nào.</p>
            </section>
        );
    }

    return (
        <section className="ow-post-list flex flex-col gap-4">
            <h2 className="heading-3">{title}</h2>
            <div>
                {/* Header row */}
                <div
                    className="hidden sm:grid grid-cols-12 gap-4 py-3 border-y border-border text-sm text-text-muted font-medium uppercase tracking-wide">
                    <span className="col-span-2">Ngày</span>
                    <span className="col-span-3">Danh mục</span>
                    <span className="col-span-7">Bài viết</span>
                </div>

                {/* Post rows */}
                <div className="divide-y divide-border">
                    {posts.map((post) => (
                        <div
                            key={post.slug}
                            className="grid grid-cols-12 gap-1 sm:gap-4 items-start py-3"
                        >
                            <span className="col-span-12 sm:col-span-2 text-body-sm text-text-muted sm:pt-0.5">
                                {fmtIsoDate(post.frontmatter.date)}
                            </span>
                            <Link
                                href={ROUTES.blogCategory(post.categorySlug)}
                                className="sm:col-span-3 text-body-sm text-text-accent font-medium truncate sm:pt-0.5 hover:underline"
                            >
                                {post.frontmatter.category}
                            </Link>
                            <Link
                                href={ROUTES.blogPost(post.slug)}
                                className="col-span-12 sm:col-span-7 text-body font-medium text-text-primary hover:text-text-accent transition-colors line-clamp-2"
                            >
                                {post.frontmatter.title}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
