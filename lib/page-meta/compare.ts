import type { Metadata } from 'next';
import type { Card } from '@/lib/api';
import { buildBreadcrumbJsonLd, type BreadcrumbItem } from './breadcrumb';
import type { CompareFrontmatter } from '@/lib/compare-mdx';

const BASE_URL = 'https://openwallet.vn';

export interface ComparePageMeta {
    metadata: Metadata;
    jsonLd: object;
    breadcrumbItems: BreadcrumbItem[];
}

export function buildComparePageMeta(
    cardA: Card,
    cardB: Card,
    frontmatter?: CompareFrontmatter,
): ComparePageMeta {
    const title = frontmatter?.title ?? `So sánh ${cardA.name} vs ${cardB.name} | Open Wallet`;
    const description =
        frontmatter?.description ??
        `So sánh chi tiết ${cardA.name} và ${cardB.name}: phí thường niên, mạng thanh toán, ưu đãi và nhiều hơn nữa.`;
    const url = `${BASE_URL}/so-sanh/${cardA.id}-vs-${cardB.id}`;

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Trang chủ', href: '/' },
        { label: 'So sánh thẻ', href: '/so-sanh' },
        { label: `${cardA.name} vs ${cardB.name}` },
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                name: title,
                description,
                url,
                inLanguage: 'vi-VN',
            },
            buildBreadcrumbJsonLd(breadcrumbItems),
        ],
    };

    return {
        metadata: {
            title,
            description,
            openGraph: { title, description },
            twitter: { title, description },
        },
        jsonLd,
        breadcrumbItems,
    };
}
