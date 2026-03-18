'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
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

// Default cards shown when the user has no recent comparisons
const DEFAULT_CARD_IDS = ['sacombank-uniq', 'msb-visa-online'];

// ─── Inner page (needs Suspense boundary for useSearchParams) ─────────────────

function ComparePageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('ComparePage');

    const [cards, setCards] = useState<(SearchCard | null)[]>(() => Array(MAX_CARDS).fill(null));
    const [numSlots, setNumSlots] = useState(2);
    const [prefillDone, setPrefillDone] = useState(false);
    const [stickyVisible, setStickyVisible] = useState(false);

    const { recentCompares, removeCompare, addCompare } = useRecentCompares();
    const { lookup, load, initialized } = useCardSearch();
    const lastProcessedParam = useRef<string | undefined>(undefined);
    const lastSynced = useRef(searchParams.get('compare') ?? '');

    useEffect(() => { load(); }, [load]);

    // Process ?compare= URL param whenever it changes (or on first load)
    useEffect(() => {
        if (!initialized) return;
        const param = searchParams.get('compare') ?? '';
        if (lastProcessedParam.current === param) return;
        lastProcessedParam.current = param;

        if (param) {
            const ids = param.split(',').filter(Boolean).slice(0, MAX_CARDS);
            const next = Array<SearchCard | null>(MAX_CARDS).fill(null);
            ids.forEach((id, i) => { next[i] = lookup(id); });
            setCards(next);
            setNumSlots(Math.max(2, ids.length));
            lastSynced.current = param;
        } else if (lastProcessedParam.current === '') {
            // First load with no param: silent auto-load, no URL change
            const firstRecent = recentCompares[0];
            const ids = firstRecent
                ? (firstRecent.pair.includes(',') ? firstRecent.pair.split(',') : firstRecent.pair.split('-vs-'))
                : DEFAULT_CARD_IDS;
            const next = Array<SearchCard | null>(MAX_CARDS).fill(null);
            ids.forEach((id, i) => { next[i] = lookup(id); });
            lastSynced.current = ids.join(',');
            setCards(next);
            setNumSlots(Math.max(2, ids.length));
        }

        setPrefillDone(true);
    }, [initialized, lookup, searchParams, recentCompares]);

    // Derived: non-null selected card IDs joined for URL/fetch key
    const selectedKey = cards.filter((c): c is SearchCard => c !== null).map((c) => c.id).join(',');
    const selectedCount = cards.filter(Boolean).length;

    // Sync URL — clear when < 2, update when ≥ 2
    useEffect(() => {
        if (!prefillDone) return;
        if (selectedCount < 2) {
            if (lastSynced.current !== '') {
                lastSynced.current = '';
                lastProcessedParam.current = '';
                router.replace('/so-sanh', { scroll: false });
            }
            return;
        }
        if (!selectedKey || selectedKey === lastSynced.current) return;
        lastSynced.current = selectedKey;
        lastProcessedParam.current = selectedKey;
        router.replace(`/so-sanh?compare=${selectedKey}`, { scroll: false });
    }, [selectedKey, selectedCount, prefillDone, router]);

    // Per-ID card cache — fetch on demand, never re-fetch
    const [cardCache, setCardCache] = useState<Record<string, Card>>({});
    const fetchingIds = useRef<Set<string>>(new Set());
    useEffect(() => {
        cards.filter((c): c is SearchCard => c !== null).forEach(({ id }) => {
            if (cardCache[id] || fetchingIds.current.has(id)) return;
            fetchingIds.current.add(id);
            getCard(id)
                .then((card) => setCardCache((prev) => ({ ...prev, [id]: card })))
                .catch(() => { })
                .finally(() => fetchingIds.current.delete(id));
        });
    }, [cards, cardCache]);

    // Slot-aligned array — length always equals numSlots
    const slotCards: (Card | null)[] = Array.from({ length: numSlots }, (_, i) => {
        const id = cards[i]?.id;
        return id ? (cardCache[id] ?? null) : null;
    });

    const isLoading = cards.filter(Boolean).some((c) => !cardCache[c!.id]);

    // Save to recent only when sticky header visible + ≥ 2 valid cards
    const lastSavedKey = useRef('');
    useEffect(() => {
        if (!stickyVisible) return;
        const validCards = slotCards.filter((c): c is Card => c !== null);
        if (validCards.length < 2) return;
        const key = validCards.map((c) => c.id).join(',');
        if (key === lastSavedKey.current) return;
        lastSavedKey.current = key;
        addCompare(key);
    }, [stickyVisible, slotCards, addCompare]);

    function setCard(i: number, card: SearchCard | null) {
        setCards((prev) => { const next = [...prev]; next[i] = card; return next; });
    }

    function removeCard(i: number) {
        // Collapse the slot if it's the last extra one
        if (i === numSlots - 1 && numSlots > 2) setNumSlots((n) => n - 1);
        setCards((prev) => {
            const next = [...prev];
            for (let j = i; j < MAX_CARDS - 1; j++) next[j] = next[j + 1];
            next[MAX_CARDS - 1] = null;
            return next;
        });
    }

    const allActiveSlotsFilled = cards.slice(0, numSlots).every(Boolean);

    return (
        <div className="px-4 py-12">
            <div className="max-w-[980px] mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('title')}</h1>

                {/* Card picker */}
                <div className="flex items-center gap-2">
                    {Array.from({ length: numSlots }, (_, i) => {
                        const card = cards[i];
                        const isExtraSlot = i >= 2;
                        const excludeIds = cards
                            .filter((c, j): c is SearchCard => c !== null && j !== i)
                            .map((c) => c.id);
                        return (
                            <div key={i} className="relative" style={{ width: `${100 / MAX_CARDS}%` }}>
                                {isExtraSlot && (
                                    <button
                                        type="button"
                                        onClick={() => removeCard(i)}
                                        className="absolute -top-1.5 -right-1.5 z-10 w-4 h-4 flex items-center justify-center bg-slate-200 hover:bg-red-100 hover:text-red-400 rounded-full text-slate-400 transition-colors"
                                        title="Bỏ cột này"
                                    >
                                        <IconX size={8} />
                                    </button>
                                )}
                                <CardSearchInput
                                    value={card}
                                    onChange={(c) => c ? setCard(i, c) : removeCard(i)}
                                    excludeIds={excludeIds}
                                    underline
                                />
                            </div>
                        );
                    })}
                    {numSlots < MAX_CARDS && allActiveSlotsFilled && (
                        <button
                            type="button"
                            onClick={() => setNumSlots(numSlots + 1)}
                            title="Thêm thẻ để so sánh"
                            className="w-5 h-5 shrink-0 flex items-center justify-center border border-dashed border-slate-300 rounded-full text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors"
                        >
                            <IconPlus size={10} />
                        </button>
                    )}
                </div>

                {/* Compare table — shown when ≥ 2 cards selected, always numSlots columns */}
                {selectedCount >= 2 && (
                    <div className="mt-10">
                        {isLoading ? (
                            <p className="text-sm text-slate-500">{t('loading')}</p>
                        ) : (
                            <CompareTemplate cards={slotCards} onStickyChange={setStickyVisible} />
                        )}
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
