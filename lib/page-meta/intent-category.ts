import type { Metadata } from 'next';
import type { Card } from '@/lib/api';
import { buildCollectionPageMeta, type CollectionPageMeta } from './collection';
import { ROUTES } from '@/lib/routes';

export type IntentCategoryConfig = {
    title: string;
    description: string;
    url: string;
    personaSlug: string;
    rankingTitle: string;
    intro: string;
    faqs: Array<{ q: string; a: string }>;
};

const BREADCRUMB_BASE = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Thẻ', href: ROUTES.cards },
];

export function buildIntentCategoryMeta(
    config: IntentCategoryConfig,
    poolCards: Card[],
): CollectionPageMeta {
    return buildCollectionPageMeta({
        title: `${config.title} | Open Wallet`,
        description: config.description,
        url: config.url,
        items: poolCards.map((c) => ({ name: c.name, url: `/the/${c.id}` })),
        breadcrumbItems: [...BREADCRUMB_BASE, { label: config.title }],
    });
}

export async function generateIntentCategoryMetadata(
    config: IntentCategoryConfig,
    getPoolCards: () => Promise<Card[]>,
): Promise<Metadata> {
    const poolCards = await getPoolCards();
    return buildIntentCategoryMeta(config, poolCards).metadata;
}
