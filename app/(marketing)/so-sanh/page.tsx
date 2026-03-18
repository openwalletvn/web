'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CompareFallback } from '@/components/compare/compare-fallback';

export default function ComparePage() {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations('ComparePage');
    const [cardAId, setCardAId] = useState('');
    const [cardBId, setCardBId] = useState('');

    // When served as fallback shell for an unbuilt pair
    const segments = pathname.split('/').filter(Boolean);
    const pairSegment = segments[1]; // /so-sanh/[pair]

    if (pairSegment) {
        return <CompareFallback pair={pairSegment} />;
    }

    const handleCompare = () => {
        if (cardAId && cardBId) {
            router.push(`/so-sanh/${cardAId}-vs-${cardBId}`);
        }
    };

    return (
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('title')}</h1>
                <div className="flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-48">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {t('pick_card_a')}
                        </label>
                        <input
                            type="text"
                            value={cardAId}
                            onChange={(e) => setCardAId(e.target.value)}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                        />
                    </div>
                    <span className="text-slate-400 text-sm pb-2">{t('vs')}</span>
                    <div className="flex-1 min-w-48">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {t('pick_card_b')}
                        </label>
                        <input
                            type="text"
                            value={cardBId}
                            onChange={(e) => setCardBId(e.target.value)}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                        />
                    </div>
                    <button
                        onClick={handleCompare}
                        disabled={!cardAId || !cardBId}
                        className="px-6 py-2 bg-brand-red text-white rounded text-sm font-medium disabled:opacity-50"
                    >
                        {t('compare_button')}
                    </button>
                </div>
            </div>
        </div>
    );
}
