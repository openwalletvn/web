import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {getIntents, getRelatedCardsForMany} from '@/lib/api';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';
import {CompareSection} from '@/components/compare/compare-section';
import {CompareSuggestedCards} from '@/components/compare/compare-suggested-cards';
import {getTool} from '@/lib/tools';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';

export const metadata: Metadata = {
    title: buildTitle(SECTION_TITLES.compare),
};

const DEFAULT_CARD_IDS = ['sacombank-uniq', 'msb-visa-online'];

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'So sánh thẻ'},
];

export default async function ComparePage({
    searchParams,
}: {
    searchParams: Promise<{ compare?: string }>;
}) {
    const { compare } = await searchParams;
    if (compare) {
        const ids = compare.split(',').filter(Boolean).slice(0, 3);
        if (ids.length >= 2) {
            redirect(`${getTool('Card Battle').href}/${ids.join('-vs-')}`);
        }
    }

    const [suggestedCards, allIntents] = await Promise.all([
        getRelatedCardsForMany(DEFAULT_CARD_IDS).catch(() => []),
        getIntents().catch(() => []),
    ]);
    const intentMap = new Map(allIntents.map((i) => [i.slug, i]));
    return (
        <MarketingPageShell title="So sánh thẻ" breadcrumbItems={BREADCRUMB_ITEMS}>
            <CompareSection intentMap={intentMap} />
            <CompareSuggestedCards cards={suggestedCards} />
        </MarketingPageShell>
    );
}
