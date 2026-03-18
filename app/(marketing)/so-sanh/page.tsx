'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { IconPlus, IconX } from '@tabler/icons-react';
import type { SearchCard } from '@/lib/search-types';
import type { Card } from '@/lib/api';
import { getCard } from '@/lib/api';
import { CardSearchInput } from '@/components/compare/card-search-input';
import { RecentCompares } from '@/components/compare/recent-compares';
import { CompareTemplate } from '@/components/compare/compare-template';
import { useRecentCompares } from '@/lib/use-recent-compares';
import { useCardSearch } from '@/lib/use-card-search';

const MAX_CARDS = 3;

// ─── Card slot ────────────────────────────────────────────────────────────────

interface CardSlotProps {
    card: SearchCard | null;
    onChange: (c: SearchCard | null) => void;
    excludeIds: string[];
    onRemove?: () => void;
}

function CardSlot({ card, onChange, excludeIds, onRemove }: CardSlotProps) {
    return (
        <div className="relative min-w-0">
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
            <CardSearchInput
                value={card}
                onChange={onChange}
                excludeIds={excludeIds}
                underline
            />
        </div>
    );
}

// ─── Inner page (needs Suspense boundary for useSearchParams) ─────────────────

function ComparePageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('ComparePage');

    const [cards, setCards] = useState<(SearchCard | null)[]>(() => Array(MAX_CARDS).fill(null));
    const [numSlots, setNumSlots] = useState(2);
    const [showTable, setShowTable] = useState(false);
    const [prefillDone, setPrefillDone] = useState(false);

    const { recentCompares, removeCompare, addCompare } = useRecentCompares();
    const { lookup, load, initialized } = useCardSearch();
    const prefilled = useRef(false);
    // Initialise lastSynced from the current URL so we skip a redundant replace on load
    const lastSynced = useRef(searchParams.get('compare') ?? '');

    useEffect(() => { load(); }, [load]);

    // Pre-fill slots from ?compare=id1,id2[,...] once index is ready
    useEffect(() => {
        if (!initialized || prefilled.current) return;
        prefilled.current = true;
        const param = searchParams.get('compare');
        if (param) {
            const ids = param.split(',').filter(Boolean).slice(0, MAX_CARDS);
            const next = Array<SearchCard | null>(MAX_CARDS).fill(null);
            ids.forEach((id, i) => { next[i] = lookup(id); });
            setCards(next);
            setNumSlots(Math.max(2, ids.length));
            setShowTable(true);
            addCompare(ids.join(','));
        }
        setPrefillDone(true);
    }, [initialized, lookup, searchParams, addCompare]);

    // Derived: comma-separated IDs of currently selected cards
    const selectedKey = cards.filter((c): c is SearchCard => c !== null).map((c) => c.id).join(',');

    // Sync ?compare= URL whenever the table is visible and the selection changes
    useEffect(() => {
        if (!showTable || !prefillDone) return;
        if (!selectedKey || selectedKey === lastSynced.current) return;
        lastSynced.current = selectedKey;
        router.replace(`/so-sanh?compare=${selectedKey}`, { scroll: false });
    }, [selectedKey, showTable, prefillDone, router]);

    // Fetch full Card objects whenever the table is shown or the selection changes
    const [fullCards, setFullCards] = useState<Card[]>([]);
    const [loadingCards, setLoadingCards] = useState(false);
    const fetchedKey = useRef('');
    useEffect(() => {
        if (!showTable) {
            setFullCards([]);
            fetchedKey.current = '';
            return;
        }
        const ids = selectedKey.split(',').filter(Boolean);
        if (ids.length < 2 || selectedKey === fetchedKey.current) return;
        fetchedKey.current = selectedKey;
        setLoadingCards(true);
        Promise.all(ids.map((id) => getCard(id)))
            .then(setFullCards)
            .catch(() => setFullCards([]))
            .finally(() => setLoadingCards(false));
    }, [showTable, selectedKey]);

    function setCard(i: number, card: SearchCard | null) {
        setCards((prev) => { const next = [...prev]; next[i] = card; return next; });
    }

    function removeCard(i: number) {
        setCards((prev) => {
            const next = [...prev];
            for (let j = i; j < MAX_CARDS - 1; j++) next[j] = next[j + 1];
            next[MAX_CARDS - 1] = null;
            return next;
        });
    }

    function handleCompare() {
        addCompare(selectedKey);
        setShowTable(true);
    }

    const selectedCount = cards.filter(Boolean).length;

    return (
        <div className="px-4 py-12">
            <div className="max-w-[980px] mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('title')}</h1>

                {/* Fixed-width card columns — always MAX_CARDS wide */}
                <div className="flex">
                    {Array.from({ length: MAX_CARDS }, (_, i) => {
                        const card = cards[i];
                        const isActive = i < numSlots;
                        const isAdd = i === numSlots && numSlots < MAX_CARDS && cards[numSlots - 1] !== null;
                        const excludeIds = cards
                            .filter((c, j): c is SearchCard => c !== null && j !== i)
                            .map((c) => c.id);

                        return (
                            <div
                                key={i}
                                style={{ width: `${100 / MAX_CARDS}%` }}
                                className="px-1.5 first:pl-0 last:pr-0"
                            >
                                {isActive ? (
                                    <CardSlot
                                        card={card}
                                        onChange={(c) => setCard(i, c)}
                                        excludeIds={excludeIds}
                                        onRemove={card ? () => removeCard(i) : undefined}
                                    />
                                ) : isAdd ? (
                                    <button
                                        type="button"
                                        onClick={() => setNumSlots(i + 1)}
                                        className="w-full h-9 flex items-center justify-center border border-dashed border-slate-200 rounded-sm text-slate-300 hover:text-slate-400 hover:border-slate-300 transition-colors"
                                        title="Thêm thẻ để so sánh"
                                    >
                                        <IconPlus size={14} />
                                    </button>
                                ) : null}
                            </div>
                        );
                    })}
                </div>

                {/* Compare button */}
                <div className="mt-6">
                    <button
                        onClick={handleCompare}
                        disabled={selectedCount < 2}
                        className="px-6 py-2 bg-brand-red text-white rounded-sm text-sm font-medium disabled:opacity-50 transition-opacity"
                    >
                        {t('compare_button')}
                    </button>
                </div>

                {/* Compare table — shown only after button click or URL pre-fill */}
                {showTable && (
                    <div className="mt-10">
                        {loadingCards ? (
                            <p className="text-sm text-slate-500">{t('loading')}</p>
                        ) : fullCards.length >= 2 ? (
                            <CompareTemplate cards={fullCards} />
                        ) : null}
                    </div>
                )}

                <RecentCompares pairs={recentCompares} onRemove={removeCompare} />
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComparePage() {
    return (
        <Suspense>
            <ComparePageInner />
        </Suspense>
    );
}
