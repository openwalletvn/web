import type {Metadata} from 'next';
import type {Post} from '@/lib/mdx';
import {buildBreadcrumbJsonLd, type BreadcrumbItem} from './breadcrumb';
import {BASE_URL} from './constants';
import {ROUTES} from '@/lib/routes';

export interface BlogPostPageMeta {
    metadata: Metadata;
    jsonLd: object;
    breadcrumbItems: BreadcrumbItem[];
}

export function buildBlogPostPageMeta(post: Post): BlogPostPageMeta {
    const {frontmatter, slug, categorySlug} = post;
    const title = `${frontmatter.title} | OpenWallet Blog`;
    const url = `${BASE_URL}/tin-tuc/${slug}`;

    const breadcrumbItems: BreadcrumbItem[] = [
        {label: 'Trang chủ', href: '/'},
        {label: 'Tin tức', href: ROUTES.blog},
        {label: frontmatter.category, href: ROUTES.blogCategory(categorySlug)},
        {label: frontmatter.title},
    ];

    const dateModified = frontmatter.updated ?? frontmatter.date;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BlogPosting',
                headline: frontmatter.title,
                description: frontmatter.description,
                datePublished: frontmatter.date,
                dateModified,
                url,
                inLanguage: 'vi-VN',
                author: {
                    '@type': 'Organization',
                    name: 'OpenWallet',
                    url: BASE_URL,
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'OpenWallet',
                    url: BASE_URL,
                },
            },
            buildBreadcrumbJsonLd(breadcrumbItems),
        ],
    };

    return {
        metadata: {
            title,
            description: frontmatter.description,
            openGraph: {
                title: frontmatter.title,
                description: frontmatter.description,
                type: 'article',
                publishedTime: frontmatter.date,
                tags: frontmatter.tags,
            },
            twitter: {
                title: frontmatter.title,
                description: frontmatter.description,
            },
        },
        jsonLd,
        breadcrumbItems,
    };
}
