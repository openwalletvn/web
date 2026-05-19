import { getRelatedCardsForMany, getIntents } from '@/lib/api';
import { CompareSection } from '@/components/compare/compare-section';
import { CompareSuggestedCards } from '@/components/compare/compare-suggested-cards';

const DEFAULT_CARD_IDS = ['sacombank-uniq', 'msb-visa-online'];

export default async function ComparePage() {
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
            <div className="max-w-container mx-auto">
                <CompareSuggestedCards cards={suggestedCards} />
            </div>
        </div>
    );
}
