'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { IconPlus, IconX } from '@tabler/icons-react';
import type { SearchCard } from '@/lib/search-types';
import { CompareFallback } from '@/components/compare/compare-fallback';
import { CardSearchInput } from '@/components/compare/card-search-input';
import { RecentCompares } from '@/components/compare/recent-compares';
import { useRecentCompares } from '@/lib/use-recent-compares';
import { useCardSearch } from '@/lib/use-card-search';

// ─── Card slot ────────────────────────────────────────────────────────────────

interface CardSlotProps {
    card: SearchCard | null;
    onChange: (c: SearchCard | null) => void;
    excludeIds: string[];
    onRemove?: () => void;
}

function CardSlot({ card, onChange, excludeIds, onRemove }: CardSlotProps) {
    return (
        <div className="relative flex flex-col gap-0 min-w-0">
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute -top-2 -right-2 z-10 w-5 h-5 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full text-slate-500 transition-colors"
                    aria-label="Xoá"
                >
                    <IconX size={10} />
                </button>
            )}
            {/* Image placeholder */}
            <div className="relative border border-dashed border-slate-300 rounded-sm bg-slate-50 aspect-[16/10] overflow-hidden">
                {card?.image_url && (
                    <img
                        src={card.image_url}
                        alt={card.name}
                        className="absolute inset-0 w-full h-full object-contain p-3"
                    />
                )}
            </div>
            {/* Underline search input */}
            <CardSearchInput
                value={card}
                onChange={onChange}
                excludeIds={excludeIds}
                underline
            />
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComparePage() {
    const router = useRouter();
    const t = useTranslations('ComparePage');

    const [cardA, setCardA] = useState<SearchCard | null>(null);
    const [cardB, setCardB] = useState<SearchCard | null>(null);
    const [cardC, setCardC] = useState<SearchCard | null>(null);
    const [showThird, setShowThird] = useState(false);

    // Capture initial URL on mount — NOT reactive, so replaceState won't trigger re-checks
    const initialPairRef = useRef<string | null>(null);
    const [initialPair, setInitialPair] = useState<string | null>(null);
    useEffect(() => {
        const segs = window.location.pathname.split('/').filter(Boolean);
        const pair = segs[1] ?? null;
        initialPairRef.current = pair;
        setInitialPair(pair);
    }, []);

    const { recentCompares, removeCompare } = useRecentCompares();
    const { lookup, load, initialized } = useCardSearch();
    const prefilled = useRef(false);

    // Load search index on mount
    useEffect(() => { load(); }, [load]);

    // Pre-fill slots from URL once index is ready (3-card URLs only —
    // 2-card URLs are handled by CompareFallback below)
    useEffect(() => {
        if (!initialized || prefilled.current) return;
        const pair = initialPairRef.current;
        prefilled.current = true;
        if (!pair) return;
        const ids = pair.split('-vs-');
        if (ids.length < 3) return; // 2-card handled by CompareFallback
        if (ids[0]) setCardA(lookup(ids[0]));
        if (ids[1]) setCardB(lookup(ids[1]));
        if (ids[2]) { setCardC(lookup(ids[2])); setShowThird(true); }
    }, [initialized, lookup]);

    // Keep URL in sync for 3-card selections only
    useEffect(() => {
        if (!showThird || !cardA || !cardB || !cardC) return;
        const newUrl = `/so-sanh/${cardA.id}-vs-${cardB.id}-vs-${cardC.id}`;
        if (window.location.pathname !== newUrl) {
            window.history.replaceState(null, '', newUrl);
        }
    }, [cardA, cardB, cardC, showThird]);

    // Initial 2-card URL → show comparison result (uses captured initial URL, not reactive)
    if (initialPair && initialPair.split('-vs-').length === 2) {
        return <CompareFallback pair={initialPair} />;
    }

    const handleCompare = () => {
        if (cardA && cardB) {
            router.push(`/so-sanh/${cardA.id}-vs-${cardB.id}`);
        }
    };

    const excludeA = [cardB?.id, cardC?.id].filter((id): id is string => Boolean(id));
    const excludeB = [cardA?.id, cardC?.id].filter((id): id is string => Boolean(id));
    const excludeC = [cardA?.id, cardB?.id].filter((id): id is string => Boolean(id));

    return (
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('title')}</h1>

                <div className="flex items-start gap-3">
                    {/* Slot A */}
                    <div className="flex-1 min-w-0">
                        <CardSlot card={cardA} onChange={setCardA} excludeIds={excludeA} />
                    </div>

                    <div className="text-xs font-medium text-slate-400 pt-[20%] shrink-0">vs</div>

                    {/* Slot B */}
                    <div className="flex-1 min-w-0">
                        <CardSlot card={cardB} onChange={setCardB} excludeIds={excludeB} />
                    </div>

                    {showThird ? (
                        <>
                            <div className="text-xs font-medium text-slate-400 pt-[20%] shrink-0">vs</div>
                            {/* Slot C */}
                            <div className="flex-1 min-w-0">
                                <CardSlot
                                    card={cardC}
                                    onChange={setCardC}
                                    excludeIds={excludeC}
                                    onRemove={() => { setCardC(null); setShowThird(false); }}
                                />
                            </div>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowThird(true)}
                            className="shrink-0 mt-[18%] p-2 text-slate-400 hover:text-slate-600 border border-dashed border-slate-300 hover:border-slate-400 rounded-sm transition-colors"
                            title="Thêm thẻ thứ ba"
                        >
                            <IconPlus size={15} />
                        </button>
                    )}
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleCompare}
                        disabled={!cardA || !cardB}
                        className="px-6 py-2 bg-brand-red text-white rounded-sm text-sm font-medium disabled:opacity-50 transition-opacity"
                    >
                        {t('compare_button')}
                    </button>
                </div>

                <RecentCompares pairs={recentCompares} onRemove={removeCompare} />
            </div>
        </div>
    );
}
