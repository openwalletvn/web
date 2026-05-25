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
    macro: string[];
    micro: string[];
    atomic: string[];
    rankBy: 'cashback' | 'annual_fee';
}

function readPrefs(): CardMatchPrefs | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const prefs = JSON.parse(raw) as CardMatchPrefs;
        // backward compat: old format stored macro/micro as string | null
        if (prefs.macro && !Array.isArray(prefs.macro)) prefs.macro = [prefs.macro as unknown as string];
        if (!prefs.macro) prefs.macro = [];
        if (prefs.micro && !Array.isArray(prefs.micro)) prefs.micro = [prefs.micro as unknown as string];
        if (!prefs.micro) prefs.micro = [];
        return prefs;
    } catch {
        return null;
    }
}

function writePrefs(prefs: CardMatchPrefs): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
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

function CardMatchFinderInner({intents, intentGroups, limit = 5}: CardMatchFinderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFinderPage = pathname === cardMatchHref;

    const [tab, setTab] = useState(DEFAULT_TAB);
    const [macro, setMacro] = useState<string[]>([]);
    const [micro, setMicro] = useState<string[]>([]);
    const [atomic, setAtomic] = useState<string[]>([]);
    const [rankBy, setRankBy] = useState<'cashback' | 'annual_fee'>('cashback');
    const [initialized, setInitialized] = useState(false);
    const [ranked, setRanked] = useState<RankedCard[]>([]);
    const [loading, setLoading] = useState(false);

    // Init: URL params (finder page only) > localStorage > defaults
    useEffect(() => {
        const urlMacro = isFinderPage ? (searchParams.get('macro')?.split(',').filter(Boolean) ?? []) : [];
        const urlMicro = isFinderPage ? (searchParams.get('micro')?.split(',').filter(Boolean) ?? []) : [];
        const urlAtomic = isFinderPage ? searchParams.get('intent') : null;
        const urlRankBy = isFinderPage ? searchParams.get('sort_by') : null;

        if (urlMacro.length > 0) {
            setMacro(urlMacro);
            setMicro(urlMicro);
            setAtomic(urlAtomic ? urlAtomic.split(',').filter(Boolean) : []);
            if (urlRankBy === 'annual_fee') setRankBy('annual_fee');
        } else {
            const prefs = readPrefs();
            if (prefs?.macro?.length) {
                setTab(prefs.tab ?? DEFAULT_TAB);
                setMacro(prefs.macro);
                setMicro(prefs.micro ?? []);
                setAtomic(prefs.atomic ?? []);
                setRankBy(prefs.rankBy ?? 'cashback');
            } else if (intentGroups.length > 0) {
                setMacro([intentGroups[0].slug]);
            }
        }
        setInitialized(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync URL (finder page only) + localStorage on state change
    useEffect(() => {
        if (!initialized) return;
        writePrefs({tab, macro, micro, atomic, rankBy});
        if (isFinderPage && macro.length > 0) {
            const p: Record<string, string> = {macro: macro.join(',')};
            if (micro.length > 0) p.micro = micro.join(',');
            if (atomic.length > 0) p.intent = atomic.join(',');
            if (rankBy !== 'cashback') p.sort_by = rankBy;
            router.replace(`${cardMatchHref}?${new URLSearchParams(p).toString()}`, {scroll: false});
        }
    }, [tab, macro, micro, atomic, rankBy, initialized, isFinderPage, router]);

    const macroNodes = useMemo(
        () => macro.map(s => findNode(intentGroups, s)).filter((n): n is IntentGroupNode => !!n),
        [intentGroups, macro],
    );
    const microNodes = useMemo(
        () => micro.map(s => findNode(intentGroups, s)).filter((n): n is IntentGroupNode => !!n),
        [intentGroups, micro],
    );

    const microChildren = useMemo(
        () => macroNodes
            .flatMap(n => n.children ?? [])
            .filter((n, i, a) => a.findIndex(x => x.slug === n.slug) === i),
        [macroNodes],
    );

    const atomicOptions = useMemo((): Intent[] => {
        const targetNodes = microNodes.length > 0
            ? microNodes
            : (microChildren.length === 0 ? macroNodes : []);
        if (targetNodes.length === 0) return [];
        const allChildSlugs = targetNodes.flatMap(n => (n.children ?? []).flatMap(c => c.intents));
        const slugSet = new Set([...targetNodes.flatMap(n => n.intents), ...allChildSlugs]);
        return intents.filter(i => slugSet.has(i.slug));
    }, [microNodes, macroNodes, microChildren, intents]);

    const activeIntentSlugs = useMemo((): string[] => {
        if (atomic.length > 0) return atomic;
        if (microNodes.length > 0) return microNodes.flatMap(n => n.intents);
        if (macroNodes.length > 0) return macroNodes.flatMap(n => n.intents);
        return [];
    }, [atomic, microNodes, macroNodes]);

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
                    }),
                });
                const json = await res.json();
                if (json.data) setRanked(json.data);
            } finally {
                setLoading(false);
            }
        }, 200);
        return () => clearTimeout(t);
    }, [activeIntentSlugs, rankBy, initialized, limit]);

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

    const toggleMacro = useCallback((slug: string) => {
        setMacro(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
        setMicro([]);
        setAtomic([]);
    }, []);

    const toggleMicro = useCallback((slug: string) => {
        setMicro(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
        setAtomic([]);
    }, []);

    const toggleAtomic = useCallback((slug: string) => {
        setAtomic(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    }, []);

    return (
        <div className="ow-card-match-finder mb-16">
            <h2 className="mb-6">Tìm thẻ tối ưu cho nhu cầu của bạn</h2>

            {/* Tab toggle */}
            <div className="flex gap-2 mb-8">
                <Chip active={tab === 'ca-nhan'} onClick={() => setTab('ca-nhan')}>
                    Cá nhân
                </Chip>
                <Chip active={tab === 'doanh-nghiep'} onClick={() => setTab('doanh-nghiep')}>
                    Doanh nghiệp
                </Chip>
            </div>

            {tab === 'doanh-nghiep' ? (
                <div className="py-12 text-center border border-dashed border-border rounded-lg">
                    <p className="text-body-lg font-medium mb-2">Sắp ra mắt</p>
                    <p className="text-body-sm text-text-muted">
                        Tính năng gợi ý thẻ doanh nghiệp đang được phát triển.
                    </p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left: controls */}
                    <div className={loading ? 'pointer-events-none opacity-60' : ''}>
                        {/* Level 1: macro groups */}
                        <div className="mb-6">
                            <p className="text-label text-text-muted mb-3">BƯỚC 01 · Bạn muốn ưu đãi gì?</p>
                            <div className="flex flex-wrap gap-2">
                                {intentGroups.map(group => (
                                    <Chip
                                        key={group.slug}
                                        active={macro.includes(group.slug)}
                                        onClick={() => toggleMacro(group.slug)}
                                    >
                                        {group.icon} {group.label}
                                    </Chip>
                                ))}
                            </div>
                        </div>

                        {/* Level 2: micro sub-groups */}
                        {microChildren.length > 0 && (
                            <div className="mb-6">
                                <p className="text-label text-text-muted mb-2">Thu hẹp danh mục (tuỳ chọn)</p>
                                <div className="flex flex-wrap gap-2">
                                    {microChildren.map(child => (
                                        <Chip
                                            key={child.slug}
                                            active={micro.includes(child.slug)}
                                            onClick={() => toggleMicro(child.slug)}
                                        >
                                            {child.icon} {child.label}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Level 3: atomic intents */}
                        {atomicOptions.length > 0 && (
                            <div className="mb-6">
                                <p className="text-label text-text-muted mb-2">Chọn cụ thể (tuỳ chọn)</p>
                                <div className="flex flex-wrap gap-2">
                                    {atomicOptions.map(intent => (
                                        <Chip
                                            key={intent.slug}
                                            active={atomic.includes(intent.slug)}
                                            onClick={() => toggleAtomic(intent.slug)}
                                        >
                                            {intent.icon} {intent.label}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
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

                        {!macro.length ? (
                            <p className="text-body-sm text-text-muted">Chọn nhóm chi tiêu để xem đề xuất.</p>
                        ) : loading && ranked.length === 0 ? (
                            <div className="flex flex-col gap-3">
                                {Array.from({length: limit}).map((_, i) => (
                                    <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-bg-muted">
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
                            <div className={`flex flex-col gap-3 transition-opacity duration-200 ${loading ? 'opacity-50' : ''}`}>
                                {ranked.map(r => (
                                    <RankedRow
                                        key={r.card.id}
                                        ranked={r}
                                        tiebreakerReason={r.rank_reason_type === 'lower_annual_fee' || r.rank_reason_type === 'better_network' || r.rank_reason_type === 'no_min_spend' ? r.rank_reason : undefined}
                                        tiebreakerDelta={tiebreakerDelta.get(r.card.id)}
                                        intentMap={new Map(intents.map(i => [i.slug, i]))}
                                        highlightedSlugs={activeIntentSlugs}
                                        intentSlug={activeIntentSlugs.length === 1 ? activeIntentSlugs[0] : undefined}
                                    />
                                ))}
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
