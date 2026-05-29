import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import type { Card } from '@/lib/api';
import { buildCollectionPageMeta, type CollectionPageMeta } from './collection';
import { ROUTES } from '@/lib/routes';

export type BreadcrumbItem = { label: string; href?: string };

export type IntentCategoryConfig = {
    title: string;
    description: string;
    url: string;
    personaSlug: string;
    rankingTitle: string;
    intro: ReactNode;
    faqs: Array<{ q: string; a: ReactNode; aText?: string }>;
    breadcrumbItems?: BreadcrumbItem[];
};

const BREADCRUMB_BASE = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Thẻ', href: ROUTES.cards },
];

export function buildIntentCategoryMeta(
    config: IntentCategoryConfig,
    poolCards: Card[],
): CollectionPageMeta {
    const breadcrumbItems = config.breadcrumbItems ?? [...BREADCRUMB_BASE, { label: config.title }];
    return buildCollectionPageMeta({
        title: `${config.title} | OpenWallet`,
        description: config.description,
        url: config.url,
        items: poolCards.map((c) => ({ name: c.name, url: `/the/${c.id}` })),
        breadcrumbItems,
    });
}

export async function generateIntentCategoryMetadata(
    config: IntentCategoryConfig,
    getPoolCards: () => Promise<Card[]>,
): Promise<Metadata> {
    const poolCards = await getPoolCards();
    return buildIntentCategoryMeta(config, poolCards).metadata;
}
