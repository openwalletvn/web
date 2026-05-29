import type {Metadata} from 'next';
import { redirect } from 'next/navigation';
import { getRelatedCardsForMany, getIntents } from '@/lib/api';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';

export const metadata: Metadata = {
    title: buildTitle(SECTION_TITLES.compare),
};
import { CompareSection } from '@/components/compare/compare-section';
import { CompareSuggestedCards } from '@/components/compare/compare-suggested-cards';
import { getTool } from '@/lib/tools';

const DEFAULT_CARD_IDS = ['sacombank-uniq', 'msb-visa-online'];

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
        <div className="px-4 py-12">
            <div className="max-w-[980px] mx-auto">
                <h1 className="mb-8">So sánh thẻ</h1>
                <CompareSection intentMap={intentMap} />
            </div>
            <div className="ow-container">
                <CompareSuggestedCards cards={suggestedCards} />
            </div>
        </div>
    );
}
