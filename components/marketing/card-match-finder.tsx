'use client';

import {Suspense, useCallback, useEffect, useMemo, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {getTool} from '@/lib/tools';
import type {Intent, IntentGroupNode} from '@/lib/api';
import type {RankedCard} from '@/lib/card-ranker';
import {Chip} from '@/components/ui/chip';
import {RankedRow} from '@/components/cards/ranked-row';

const STORAGE_KEY = 'ow-rec-prefs';
const cardMatchHref = getTool('Card Match').href;
const DEFAULT_TAB = 'ca-nhan';

interface CardMatchPrefs {
    tab: string;
    intent: string[];
    rankBy: 'cashback' | 'annual_fee';
    monthlySpend: number;
}

function readPrefs(): CardMatchPrefs | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as CardMatchPrefs;
    } catch {
        return null;
    }
}

function writePrefs(prefs: CardMatchPrefs): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
}

function getAllIntents(node: IntentGroupNode): string[] {
    return [...new Set([
        ...node.intents,
        ...(node.children ?? []).flatMap(getAllIntents),
    ])];
}

function findNode(groups: IntentGroupNode[], slug: string): IntentGroupNode | undefined {
    for (const g of groups) {
        if (g.slug === slug) return g;
        const found = findNode(g.children ?? [], slug);
        if (found) return found;
    }
    return undefined;
}

export interface CardMatchFinderProps {
    intents: Intent[];
    intentGroups: IntentGroupNode[];
    limit?: number;
}

function CardMatchFinderInner({intents: intentList, intentGroups, limit = 5}: CardMatchFinderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFinderPage = pathname === cardMatchHref;

    const [tab, setTab] = useState(DEFAULT_TAB);
    const [activeIntents, setActiveIntents] = useState<string[]>([]);
    const [rankBy, setRankBy] = useState<'cashback' | 'annual_fee'>('cashback');
    const [monthlySpend, setMonthlySpend] = useState(3);
    const [initialized, setInitialized] = useState(false);
    const [ranked, setRanked] = useState<RankedCard[]>([]);
    const [rankingBasis, setRankingBasis] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    // Init: URL params > localStorage > default (first group all intents)
    useEffect(() => {
        const urlIntent = isFinderPage ? searchParams.get('intent') : null;
        const urlRankBy = isFinderPage ? searchParams.get('sort_by') : null;
        const urlSpend = isFinderPage ? searchParams.get('spend') : null;

        if (urlIntent) {
            setActiveIntents(urlIntent.split(',').filter(Boolean));
            if (urlRankBy === 'annual_fee') setRankBy('annual_fee');
            if (urlSpend) {
                const s = parseInt(urlSpend, 10);
                if (!isNaN(s) && s >= 1 && s <= 999) setMonthlySpend(s);
            }
        } else {
            const prefs = readPrefs();
            if (prefs?.intent?.length) {
                setTab(prefs.tab ?? DEFAULT_TAB);
                setActiveIntents(prefs.intent);
                setRankBy(prefs.rankBy ?? 'cashback');
                if (prefs.monthlySpend) setMonthlySpend(prefs.monthlySpend);
            } else if (intentGroups.length > 0) {
                setActiveIntents(getAllIntents(intentGroups[0]));
            }
        }
        setInitialized(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync URL + localStorage
    useEffect(() => {
        if (!initialized) return;
        writePrefs({tab, intent: activeIntents, rankBy, monthlySpend});
        if (isFinderPage && activeIntents.length > 0) {
            const p: Record<string, string> = {intent: activeIntents.join(',')};
            if (rankBy !== 'cashback') p.sort_by = rankBy;
            if (monthlySpend !== 3) p.spend = String(monthlySpend);
            router.replace(`${cardMatchHref}?${new URLSearchParams(p).toString()}`, {scroll: false});
        }
    }, [tab, activeIntents, rankBy, monthlySpend, initialized, isFinderPage, router]);

    const intentSet = useMemo(() => new Set(activeIntents), [activeIntents]);
    const intentMap = useMemo(() => new Map(intentList.map(i => [i.slug, i])), [intentList]);

    const toggleGroup = useCallback((group: IntentGroupNode) => {
        const groupIntents = getAllIntents(group);
        const allActive = groupIntents.every(i => intentSet.has(i));
        if (allActive) {
            setActiveIntents(prev => prev.filter(i => !groupIntents.includes(i)));
        } else {
            setActiveIntents(prev => [...new Set([...prev, ...groupIntents])]);
        }
    }, [intentSet]);

    const toggleChild = useCallback((child: IntentGroupNode) => {
        const childIntents = getAllIntents(child);
        const allActive = childIntents.every(i => intentSet.has(i));
        if (allActive) {
            setActiveIntents(prev => prev.filter(i => !childIntents.includes(i)));
        } else {
            setActiveIntents(prev => [...new Set([...prev, ...childIntents])]);
        }
    }, [intentSet]);

    const activeIntentSlugs = activeIntents;

    useEffect(() => {
        if (!initialized) return;
        if (activeIntentSlugs.length === 0) return;
        setLoading(true);
        const t = setTimeout(async () => {
            try {
                const res = await fetch('/api/ranking', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        intents: activeIntentSlugs,
                        limit,
                        for_business: false,
                        sort_by: rankBy,
                        monthly_spend: monthlySpend * 1_000_000,
                    }),
                });
                const json = await res.json();
                if (json.data) setRanked(json.data);
                if (json.meta?.ranking_basis) setRankingBasis(json.meta.ranking_basis);
            } finally {
                setLoading(false);
            }
        }, 200);
        return () => clearTimeout(t);
    }, [activeIntentSlugs, rankBy, monthlySpend, initialized, limit]);

    const withCashback = ranked.filter(r => r.cashback_result.max_cashback > 0);
    const tiebreakerDelta = new Map<string, number>();
    let gi = 0;
    while (gi < withCashback.length) {
        let gj = gi;
        while (gj < withCashback.length && withCashback[gj].cashback_result.max_cashback === withCashback[gi].cashback_result.max_cashback) gj++;
        if (gj - gi > 1) {
            const naturalRank = withCashback[gi].rank;
            const groupSize = gj - gi;
            tiebreakerDelta.set(withCashback[gi].card.id, groupSize - 1);
            for (let k = gi + 1; k < gj; k++) {
                tiebreakerDelta.set(withCashback[k].card.id, naturalRank - withCashback[k].rank);
            }
        }
        gi = gj;
    }

    return (
        <div className="ow-card-match-finder mb-16">
            <h2 className="mb-6">Tìm thẻ tối ưu cho nhu cầu của bạn</h2>

            {/* Tab toggle — Doanh nghiệp hidden temporarily */}
            {/* <div className="flex gap-2 mb-8">
                <Chip active={tab === 'ca-nhan'} onClick={() => setTab('ca-nhan')}>
                    Cá nhân
                </Chip>
                <Chip active={tab === 'doanh-nghiep'} onClick={() => setTab('doanh-nghiep')}>
                    Doanh nghiệp
                </Chip>
            </div> */}

            {(
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left: controls */}
                    <div className={loading ? 'pointer-events-none opacity-60' : ''}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-label text-text-muted">Bạn hay chi tiêu ở đâu?</h2>
                        </div>
                        <div className="flex flex-col gap-3">
                            {intentGroups.map(persona => {
                                const childSlugs = new Set((persona.children ?? []).flatMap(getAllIntents));
                                const allSlugs = [...new Set(getAllIntents(persona))];
                                const nonChildSlugs = allSlugs.filter(s => !childSlugs.has(s));
                                const allActive = allSlugs.length > 0 && allSlugs.every(i => intentSet.has(i));

                                // single-intent persona (e.g. foodie → dining): just the intent chip
                                if (allSlugs.length === 1) {
                                    const intent = intentMap.get(allSlugs[0]);
                                    if (!intent) return null;
                                    return (
                                        <div key={persona.slug} className="flex flex-wrap gap-2">
                                            <Chip active={intentSet.has(intent.slug)} onClick={() => setActiveIntents(prev =>
                                                intentSet.has(intent.slug)
                                                    ? prev.filter(i => i !== intent.slug)
                                                    : [...new Set([...prev, intent.slug])]
                                            )}>
                                                {intent.icon} {intent.label}
                                            </Chip>
                                        </div>
                                    );
                                }

                                // has exactly one root catch-all intent + children → persona chip + children chips
                                // otherwise (all peers) → persona chip + all intent chips
                                const hasRootCatchAll = nonChildSlugs.length === 1 && childSlugs.size > 0;
                                const individualSlugs = hasRootCatchAll ? [...childSlugs] : allSlugs;

                                return (
                                    <div key={persona.slug} className="flex flex-wrap gap-2">
                                        <Chip active={allActive} onClick={() => toggleGroup(persona)}>
                                            {persona.icon} {persona.label}
                                        </Chip>
                                        {individualSlugs.map(slug => {
                                            const intent = intentMap.get(slug);
                                            if (!intent) return null;
                                            return (
                                                <Chip key={slug} active={intentSet.has(slug)}
                                                      onClick={() => setActiveIntents(prev =>
                                                          intentSet.has(slug)
                                                              ? prev.filter(i => i !== slug)
                                                              : [...new Set([...prev, slug])]
                                                      )}>
                                                    {intent.icon} {intent.label}
                                                </Chip>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Monthly spend input */}
                        <div className="flex items-center gap-2 mt-6">
                            <h2 className="text-label text-text-muted shrink-0">Tổng chi tiêu trung bình hàng tháng</h2>
                            <div className="flex items-center gap-1 ml-auto">
                                <button
                                    className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-foreground hover:bg-bg-muted transition-colors disabled:opacity-30"
                                    onClick={() => setMonthlySpend(s => Math.max(1, s - 1))}
                                    disabled={monthlySpend <= 1}
                                >◀
                                </button>
                                <input
                                    type="number"
                                    min={1}
                                    max={999}
                                    step={1}
                                    value={monthlySpend}
                                    onChange={e => {
                                        const v = parseInt(e.target.value, 10);
                                        if (!isNaN(v)) setMonthlySpend(Math.min(999, Math.max(1, v)));
                                    }}
                                    className="w-12 text-center text-label bg-transparent border border-border rounded px-1 py-0.5 focus:outline-none focus:border-primary"
                                />
                                <button
                                    className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-foreground hover:bg-bg-muted transition-colors disabled:opacity-30"
                                    onClick={() => setMonthlySpend(s => Math.min(999, s + 1))}
                                    disabled={monthlySpend >= 999}
                                >▶
                                </button>
                                <span className="text-label text-text-muted">triệu đồng</span>
                            </div>
                        </div>

                        {activeIntents.length > 0 && (
                            <button
                                className="mt-4 text-label text-text-muted hover:text-foreground transition-colors"
                                onClick={() => {
                                    setActiveIntents([]);
                                    setMonthlySpend(3);
                                }}
                            >
                                Reset bộ lọc
                            </button>
                        )}
                    </div>

                    {/* Right: results */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-label text-text-muted">KẾT QUẢ ĐỀ XUẤT</p>
                            <div className="flex gap-1">
                                <Chip active={rankBy === 'cashback'} onClick={() => setRankBy('cashback')}>
                                    Hoàn tiền cao nhất
                                </Chip>
                                <Chip active={rankBy === 'annual_fee'} onClick={() => setRankBy('annual_fee')}>
                                    Phí thấp nhất
                                </Chip>
                            </div>
                        </div>

                        {!activeIntents.length ? (
                            <p className="text-body-sm text-text-muted">Chọn nhóm chi tiêu để xem đề xuất.</p>
                        ) : loading && ranked.length === 0 ? (
                            <div className="flex flex-col gap-3">
                                {Array.from({length: limit}).map((_, i) => (
                                    <div key={i}
                                         className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-bg-muted">
                                        <div className="shrink-0 w-10 h-10 rounded bg-border"/>
                                        <div className="flex-1 flex flex-col gap-2">
                                            <div className="h-3 rounded bg-border w-2/3"/>
                                            <div className="h-3 rounded bg-border w-1/3"/>
                                        </div>
                                        <div className="h-4 rounded bg-border w-16"/>
                                    </div>
                                ))}
                            </div>
                        ) : !loading && withCashback.length === 0 ? (
                            <p className="text-body-sm text-text-muted">Không tìm thấy thẻ phù hợp.</p>
                        ) : (
                            <div
                                className={`flex flex-col gap-6 transition-opacity duration-200 ${loading ? 'opacity-50' : ''}`}>
                                {ranked.map(r => (
                                    <RankedRow
                                        key={r.card.id}
                                        ranked={r}
                                        tiebreakerReason={r.rank_reason_type === 'lower_annual_fee' || r.rank_reason_type === 'better_network' || r.rank_reason_type === 'no_min_spend' ? r.rank_reason : undefined}
                                        tiebreakerDelta={tiebreakerDelta.get(r.card.id)}
                                        intentMap={intentMap}
                                        highlightedSlugs={activeIntentSlugs}
                                        intentSlug={activeIntentSlugs.length === 1 ? activeIntentSlugs[0] : undefined}
                                    />
                                ))}
                                {rankingBasis && (
                                    <p className="text-label text-text-muted mt-1">{rankingBasis}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export function CardMatchFinder(props: CardMatchFinderProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return (
        <Suspense>
            <CardMatchFinderInner {...props}/>
        </Suspense>
    );
}
