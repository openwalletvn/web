'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { IconPlus, IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import type { SearchCard } from '@/lib/search-types';
import type { Card, Intent, CompareResult } from '@/lib/api';
import { getCard, compareCards } from '@/lib/api';
import {OwCardImage} from '@/components/ow-ui/ow-card-image';
import { CardSearchInput } from '@/components/compare/card-search-input';
import { CompareTable } from '@/components/compare/compare-table';
import { RecentCompares } from '@/components/compare/recent-compares';
import { useRecentCompares } from '@/lib/use-recent-compares';
import { useCardSearch } from '@/lib/use-card-search';
import { getTool } from '@/lib/tools';

const MAX_CARDS = 3;
const cardBattleHref = getTool('Card Battle').href;

// Default cards shown when the user has no recent comparisons and no defaultPair
const DEFAULT_CARD_IDS = ['sacombank-uniq', 'msb-visa-online'];

function parseIds(pair: string): string[] {
    return (pair.includes(',') ? pair.split(',') : pair.split('-vs-')).filter(Boolean);
}

import {colSpan} from './compare-col-span';

// ─── Loading skeleton matching CompareTemplate dimensions ────────────────────

function CompareTemplateSkeleton({ numSlots }: { numSlots: number }) {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-12 mb-8">
                {Array.from({ length: numSlots }, (_, i) => (
                    <div key={i} className={`${colSpan(numSlots, i)} flex flex-col gap-3`}>
                        <div className="flex items-end h-[200px]">
                            <div className="w-full max-w-[200px] aspect-[16/10] bg-slate-100 rounded-lg" />
                        </div>
                        <div className="h-5 w-2/3 bg-slate-100 rounded" />
                    </div>
                ))}
            </div>
            {[3, 4, 2].map((rowCount, s) => (
                <div key={s}>
                    <div className="mt-10 border-t border-slate-100 pt-5 mb-2">
                        <div className="h-3.5 w-14 bg-slate-100 rounded" />
                    </div>
                    {Array.from({ length: rowCount }, (_, r) => (
                        <div key={r} className="py-3">
                            <div className="h-3 w-20 bg-slate-100 rounded mb-1.5" />
                            <div className="grid grid-cols-12">
                                {Array.from({ length: numSlots }, (_, c) => (
                                    <div key={c} className={`${colSpan(numSlots, c)} h-7 w-16 bg-slate-100 rounded`} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

// ─── Compare display (card header + sticky + table) ──────────────────────────

interface CompareDisplayProps {
    cards: (Card | null)[];
    compareResult?: CompareResult | null;
    children?: React.ReactNode;
    onStickyChange?: (visible: boolean) => void;
    intentMap?: Map<string, Intent>;
}

function CompareDisplay({ cards, compareResult, children, onStickyChange, intentMap }: CompareDisplayProps) {
    const cardHeaderRef = useRef<HTMLDivElement>(null);
    const [showSticky, setShowSticky] = useState(false);

    useEffect(() => {
        const el = cardHeaderRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                const visible = !entry.isIntersecting;
                setShowSticky(visible);
                onStickyChange?.(visible);
            },
            { threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [onStickyChange]);

    return (
        <div className="ow-compare-display">
            <div className={cn('fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm transition-transform duration-200 ease-out', showSticky ? 'translate-y-0' : '-translate-y-full')}>
                <div className="ow-compare-display-sticky min-h-[80px] ow-container py-2 flex items-center">
                    <div className="grid grid-cols-12 w-full">
                        {cards.map((card, i) => (
                            <div key={card?.id ?? i} className={`${colSpan(cards.length, i)} flex items-center gap-2`}>
                                {card ? (
                                    <>
                                        <Link href={`/the/${card.id}`} className="block shrink-0">
                                            <OwCardImage card={card} tilt className="sm:h-[60px] h-[40px] w-auto" />
                                        </Link>
                                        <Link href={`/the/${card.id}`} className="sm:text-sm text-xs font-semibold text-slate-900 hover:text-brand-red transition-colors line-clamp-2">
                                            {card.name}
                                        </Link>
                                    </>
                                ) : (
                                    <div className="h-[60px] w-[96px] bg-slate-100 rounded-sm shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div ref={cardHeaderRef} className="grid grid-cols-12 mb-8">
                {cards.map((card, i) => (
                    <div key={card?.id ?? i} className={`${colSpan(cards.length, i)} flex flex-col gap-3`}>
                        {card ? (
                            <>
                                <div className="flex items-end sm:h-[200px] h-[120px]">
                                    <Link href={`/the/${card.id}`}>
                                        {card.image?.orientation === 'vertical' ? (
                                            <div className="sm:h-[200px] h-[120px] flex items-center">
                                                <OwCardImage card={card} tilt className="h-full w-auto" />
                                            </div>
                                        ) : (
                                            <div className="w-full sm:max-w-[200px] max-w-[100px]">
                                                <OwCardImage card={card} tilt className="w-full" />
                                            </div>
                                        )}
                                    </Link>
                                </div>
                                <Link href={`/the/${card.id}`} className="text-base font-semibold text-slate-900 hover:text-brand-red transition-colors">
                                    {card.name}
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-end sm:h-[200px] h-[120px]">
                                <div className="w-full sm:max-w-[200px] max-w-[100px] aspect-[16/10] bg-slate-100 rounded-lg" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <CompareTable cards={cards} compareResult={compareResult} intentMap={intentMap} />

            {children && (
                <div className="mt-12 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline">
                    {children}
                </div>
            )}
        </div>
    );
}

// ─── Inner (needs Suspense for useSearchParams) ───────────────────────────────

interface InnerProps {
    defaultPair?: string;
    children?: React.ReactNode;
    excludePair?: string;
    intentMap?: Map<string, Intent>;
    recordOnMount?: string;
}

function CompareSectionInner({ defaultPair, children, excludePair, intentMap, recordOnMount }: InnerProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [cards, setCards] = useState<(SearchCard | null)[]>(() => Array(MAX_CARDS).fill(null));
    const [numSlots, setNumSlots] = useState(2);
    const [prefillDone, setPrefillDone] = useState(false);
    const [stickyVisible, setStickyVisible] = useState(false);

    const { recentCompares, addCompare } = useRecentCompares();
    const { lookup, load, initialized } = useCardSearch();
    // Ref so the prefill effect can read the latest value without it being a dependency
    const recentComparesRef = useRef(recentCompares);
    recentComparesRef.current = recentCompares;

    useEffect(() => { load(); }, [load]);

    // Record pair visit on mount (replaces RecordCompareVisit component)
    useEffect(() => {
        if (recordOnMount) addCompare(recordOnMount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recordOnMount]);

    useEffect(() => {
        if (!initialized) return;

        // Only prefill from recent if there will still be visible entries after
        // (prefilling from entry[0] excludes it from the list, so need > 1 to show something)
        const recentEntry = !defaultPair && recentComparesRef.current.length > 1
            ? recentComparesRef.current[0]
            : undefined;
        const ids = defaultPair
            ? parseIds(defaultPair)
            : recentEntry
                ? parseIds(recentEntry.pair)
                : DEFAULT_CARD_IDS;
        const next = Array<SearchCard | null>(MAX_CARDS).fill(null);
        ids.forEach((id, i) => { next[i] = lookup(id); });
        setCards(next);
        setNumSlots(Math.max(2, ids.length));

        setPrefillDone(true);
    }, [initialized, lookup, defaultPair]);

    const selectedKey = cards.filter((c): c is SearchCard => c !== null).map((c) => c.id).join(',');
    const selectedCount = cards.filter(Boolean).length;

    // Navigate to pair URL when ≥2 cards selected
    const lastNavigatedKey = useRef('');
    useEffect(() => {
        if (!prefillDone || selectedCount < 2) return;
        const pairPath = `${cardBattleHref}/${cards
            .filter((c): c is SearchCard => c !== null)
            .map((c) => c.id)
            .join('-vs-')}`;
        if (pathname === pairPath || lastNavigatedKey.current === selectedKey) return;
        lastNavigatedKey.current = selectedKey;
        const onPairPage = pathname.startsWith(`${cardBattleHref}/`);
        if (onPairPage) {
            router.replace(pairPath);
        } else {
            router.push(pairPath);
        }
    }, [selectedKey, selectedCount, prefillDone, pathname, router, cards]);

    // Per-ID card cache
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

    const slotCards: (Card | null)[] = Array.from({ length: numSlots }, (_, i) => {
        const id = cards[i]?.id;
        return id ? (cardCache[id] ?? null) : null;
    });

    const isLoading = cards.filter(Boolean).some((c) => !cardCache[c!.id]);

    // Compare result — fetched once all slot cards are loaded
    const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
    const lastCompareKey = useRef('');
    useEffect(() => {
        const validIds = slotCards.filter((c): c is Card => c !== null).map((c) => c.id);
        if (validIds.length < 2 || isLoading) return;
        const key = validIds.join(',');
        if (key === lastCompareKey.current) return;
        lastCompareKey.current = key;
        compareCards(validIds).then(setCompareResult).catch(() => setCompareResult(null));
    }, [slotCards, isLoading]);

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
        <>
            {/* Card picker */}
            <div className="ow-compare-card-picker grid grid-cols-12 items-center gap-2">
                {Array.from({ length: numSlots }, (_, i) => {
                    const card = cards[i];
                    const isExtraSlot = i >= 2;
                    const excludeIds = cards
                        .filter((c, j): c is SearchCard => c !== null && j !== i)
                        .map((c) => c.id);
                    return (
                        <div key={i} className={`${colSpan(numSlots, i)} relative`}>
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

            {/* Compare table */}
            {!initialized || !prefillDone ? (
                <div className="mt-10">
                    <CompareTemplateSkeleton numSlots={numSlots} />
                </div>
            ) : selectedCount >= 2 ? (
                <div className="mt-10">
                    {isLoading ? (
                        <CompareTemplateSkeleton numSlots={numSlots} />
                    ) : (
                        <CompareDisplay cards={slotCards} compareResult={compareResult} onStickyChange={setStickyVisible} intentMap={intentMap}>
                            {children}
                        </CompareDisplay>
                    )}
                </div>
            ) : null}

            <RecentCompares excludePair={excludePair ?? selectedKey} />
        </>
    );
}

// ─── Public export ────────────────────────────────────────────────────────────

interface Props {
    defaultPair?: string;
    children?: React.ReactNode;
    excludePair?: string;
    intentMap?: Map<string, Intent>;
    recordOnMount?: string;
}

export function CompareSection({ defaultPair, children, excludePair, intentMap, recordOnMount }: Props) {
    return (
        <Suspense>
            <CompareSectionInner defaultPair={defaultPair} excludePair={excludePair} intentMap={intentMap} recordOnMount={recordOnMount}>
                {children}
            </CompareSectionInner>
        </Suspense>
    );
}
