import { getTranslations } from 'next-intl/server';
import { CompareSection } from '@/components/compare/compare-section';

export default async function ComparePage() {
    const t = await getTranslations('ComparePage');
    return (
        <div className="px-4 py-12">
            <div className="max-w-[980px] mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('title')}</h1>
                <CompareSection />
            </div>
        </div>
    );
}
