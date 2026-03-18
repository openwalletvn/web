import { getTranslations } from 'next-intl/server';
import { getComparableCardIds } from '@/lib/api';
import { CompareSection } from '@/components/compare/compare-section';

const DEFAULT_CARD_IDS = ['sacombank-uniq', 'msb-visa-online'];

export default async function ComparePage() {
    const [t, fallbackCardIds] = await Promise.all([
        getTranslations('ComparePage'),
        getComparableCardIds(DEFAULT_CARD_IDS).catch(() => []),
    ]);
    return (
        <div className="px-4 py-12">
            <div className="max-w-[980px] mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('title')}</h1>
                <CompareSection fallbackCardIds={fallbackCardIds} />
            </div>
        </div>
    );
}
