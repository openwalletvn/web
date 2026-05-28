import type { Metadata } from 'next';
import type { Card } from '@/lib/api';
import { buildCollectionPageMeta, type CollectionPageMeta } from './collection';

export type IntentCategoryConfig = {
    title: string;
    description: string;
    url: string;
    intentSlug: string;
    rankingTitle: string;
    intro: string;
    faqs: Array<{ q: string; a: string }>;
    filterFn: (card: Card) => boolean;
};

const BREADCRUMB_BASE = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Thẻ', href: '/the' },
];

export function buildIntentCategoryMeta(
    config: IntentCategoryConfig,
    cards: Card[],
): CollectionPageMeta {
    return buildCollectionPageMeta({
        title: `${config.title} | Open Wallet`,
        description: config.description,
        url: config.url,
        items: cards.filter(config.filterFn).map((c) => ({ name: c.name, url: `/the/${c.id}` })),
        breadcrumbItems: [...BREADCRUMB_BASE, { label: config.title }],
    });
}

export async function generateIntentCategoryMetadata(
    config: IntentCategoryConfig,
    getCards: () => Promise<Card[]>,
): Promise<Metadata> {
    const allCards = await getCards();
    return buildIntentCategoryMeta(config, allCards).metadata;
}
