import type {Metadata} from 'next';
import {buildBreadcrumbJsonLd, type BreadcrumbItem} from './breadcrumb';

const BASE_URL = 'https://openwallet.vn';

export interface CollectionItem {
    name: string;
    url: string;
}

export interface CollectionPageMetaInput {
    title: string;
    description: string;
    url: string;
    items: CollectionItem[];
    breadcrumbItems: BreadcrumbItem[];
}

export interface CollectionPageMeta {
    metadata: Metadata;
    jsonLd: object;
    breadcrumbItems: BreadcrumbItem[];
}

export function buildCollectionPageMeta({
    title,
    description,
    url,
    items,
    breadcrumbItems,
}: CollectionPageMetaInput): CollectionPageMeta {
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                name: title,
                description,
                url: fullUrl,
            },
            {
                '@type': 'ItemList',
                itemListElement: items.map((item, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.name,
                    url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
                })),
            },
            buildBreadcrumbJsonLd(breadcrumbItems),
        ],
    };

    return {
        metadata: {
            title,
            description,
            alternates: {canonical: fullUrl},
            openGraph: {title, description, url: fullUrl},
            twitter: {title, description},
        },
        jsonLd,
        breadcrumbItems,
    };
}
