'use client';

import {Suspense, useCallback, useEffect, useMemo, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {getTool} from '@/lib/tools';
import type {Intent, IntentGroupNode} from '@/lib/api';
import {DEFAULT_MONTHLY_SPEND, getTiebreakerReason, type RankedCard} from '@/lib/card-ranker';
import {SPEND_OPTIONS} from '@/lib/spend-options';
import {Chip} from '@/components/ui/chip';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {IconChevronLeft, IconChevronRight} from '@tabler/icons-react';
import {RankedRow} from '@/components/marketing/card-ranking-table';

const STORAGE_KEY = 'ow-rec-prefs';
const cardMatchHref = getTool('Card Match').href;
const DEFAULT_TAB = 'ca-nhan';

interface RecPrefs {
    tab: string;
    macro: string | null;
    micro: string | null;
    atomic: string[];
    spend: number;
}

function readPrefs(): RecPrefs | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as RecPrefs) : null;
    } catch {
        return null;
    }
}

function writePrefs(prefs: RecPrefs): void {
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

export interface RecommendationFinderProps {
    intents: Intent[];
    intentGroups: IntentGroupNode[];
    limit?: number;
}


function RecommendationFinderInner({intents, intentGroups, limit = 5}: RecommendationFinderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFinderPage = pathname === cardMatchHref;

    const [tab, setTab] = useState(DEFAULT_TAB);
    const [macro, setMacro] = useState<string | null>(null);
    const [micro, setMicro] = useState<string | null>(null);
    const [atomic, setAtomic] = useState<string[]>([]);
    const [spend, setSpend] = useState(DEFAULT_MONTHLY_SPEND);
    const [initialized, setInitialized] = useState(false);
    const [ranked, setRanked] = useState<RankedCard[]>([]);
    const [loading, setLoading] = useState(false);

    // Init: URL params (finder page only) > localStorage > defaults
    useEffect(() => {
        const urlMacro = isFinderPage ? searchParams.get('macro') : null;
        const urlMicro = isFinderPage ? searchParams.get('micro') : null;
        const urlAtomic = isFinderPage ? searchParams.get('intent') : null;
        const urlSpend = isFinderPage ? searchParams.get('spend') : null;

        if (urlMacro) {
            setMacro(urlMacro);
            setMicro(urlMicro);
            setAtomic(urlAtomic ? urlAtomic.split(',').filter(Boolean) : []);
            if (urlSpend) setSpend(Number(urlSpend) || DEFAULT_MONTHLY_SPEND);
        } else {
            const prefs = readPrefs();
            if (prefs?.macro) {
                setTab(prefs.tab ?? DEFAULT_TAB);
                setMacro(prefs.macro);
                setMicro(prefs.micro ?? null);
                setAtomic(prefs.atomic ?? []);
                setSpend(prefs.spend ?? DEFAULT_MONTHLY_SPEND);
            } else if (intentGroups.length > 0) {
                setMacro(intentGroups[0].slug);
            }
        }
        setInitialized(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync URL (finder page only) + localStorage on state change
    useEffect(() => {
        if (!initialized) return;
        writePrefs({tab, macro, micro, atomic, spend});
        if (isFinderPage && macro) {
            const p: Record<string, string> = {macro, spend: String(spend)};
            if (micro) p.micro = micro;
            if (atomic.length > 0) p.intent = atomic.join(',');
            router.replace(`${cardMatchHref}?${new URLSearchParams(p).toString()}`, {scroll: false});
        }
    }, [tab, macro, micro, atomic, spend, initialized, isFinderPage, router]);

    const spendIdx = SPEND_OPTIONS.findIndex(o => o.value === spend);
    const canDec = spendIdx > 0;
    const canInc = spendIdx < SPEND_OPTIONS.length - 1;

    const macroNode = useMemo(() => macro ? findNode(intentGroups, macro) : null, [intentGroups, macro]);
    const microNode = useMemo(() => micro ? findNode(intentGroups, micro) : null, [intentGroups, micro]);

    // Children of the selected macro (sub-groups shown at level 2)
    const microChildren = useMemo(() => macroNode?.children ?? [], [macroNode]);

    // Atomic intents available for level 3 selection
    // If micro selected and has children → show micro's children
    // If micro selected without children → show intents within micro (leaf)
    // If no micro but macro has no children → show macro's direct intents as atoms
    const atomicOptions = useMemo((): Intent[] => {
        const targetNode = microNode ?? (microChildren.length === 0 ? macroNode : null);
        if (!targetNode) return [];
        const allChildSlugs = (targetNode.children ?? []).flatMap(c => c.intents);
        const slugSet = new Set([...targetNode.intents, ...allChildSlugs]);
        return intents.filter(i => slugSet.has(i.slug));
    }, [microNode, macroNode, microChildren, intents]);

    // Derive the active intent slugs sent to the ranking API
    const activeIntentSlugs = useMemo((): string[] => {
        if (atomic.length > 0) return atomic;
        if (microNode) return microNode.intents;
        if (macroNode) return macroNode.intents;
        return [];
    }, [atomic, microNode, macroNode]);

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
                        spend: Object.fromEntries(activeIntentSlugs.map(s => [s, spend])),
                        limit,
                        for_business: false,
                    }),
                });
                const json = await res.json();
                if (json.data) setRanked(json.data);
            } finally {
                setLoading(false);
            }
        }, 200);
        return () => clearTimeout(t);
    }, [activeIntentSlugs, spend, initialized, limit]);

    const withCashback = ranked.filter(r => r.cashback_result.cashback > 0);
    const tiebreakerReasons = new Map<string, string>();
    const tiebreakerDelta = new Map<string, number>();
    let gi = 0;
    while (gi < withCashback.length) {
        let gj = gi;
        while (gj < withCashback.length && withCashback[gj].cashback_result.cashback === withCashback[gi].cashback_result.cashback) gj++;
        if (gj - gi > 1) {
            const naturalRank = withCashback[gi].rank;
            for (let k = gi; k < gj - 1; k++) {
                const reason = getTiebreakerReason(withCashback[k].card, withCashback[k + 1].card);
                if (reason) tiebreakerReasons.set(withCashback[k].card.id, reason);
            }
            const groupSize = gj - gi;
            tiebreakerDelta.set(withCashback[gi].card.id, groupSize - 1);
            for (let k = gi + 1; k < gj; k++) {
                tiebreakerDelta.set(withCashback[k].card.id, naturalRank - withCashback[k].rank);
            }
        }
        gi = gj;
    }

    const handleMacroSelect = useCallback((slug: string) => {
        setMacro(prev => prev === slug ? prev : slug);
        setMicro(null);
        setAtomic([]);
    }, []);

    const handleMicroSelect = useCallback((slug: string) => {
        setMicro(prev => prev === slug ? null : slug);
        setAtomic([]);
    }, []);

    const toggleAtomic = useCallback((slug: string) => {
        setAtomic(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    }, []);

    const handleTabChange = useCallback((newTab: string) => {
        setTab(newTab);
    }, []);

    return (
        <div className="ow-recommendation-finder mb-16">
            <h2 className="mb-6">Tìm thẻ tối ưu cho nhu cầu của bạn</h2>

            {/* Tab toggle */}
            <div className="flex gap-2 mb-8">
                <Chip active={tab === 'ca-nhan'} onClick={() => handleTabChange('ca-nhan')}>
                    Cá nhân
                </Chip>
                <Chip active={tab === 'doanh-nghiep'} onClick={() => handleTabChange('doanh-nghiep')}>
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
                    <div>
                        {/* Level 1: macro groups */}
                        <div className="mb-6">
                            <p className="text-label text-text-muted mb-3">BƯỚC 01 · Bạn muốn ưu đãi gì?</p>
                            <div className="flex flex-wrap gap-2">
                                {intentGroups.map(group => (
                                    <Chip
                                        key={group.slug}
                                        active={macro === group.slug}
                                        onClick={() => handleMacroSelect(group.slug)}
                                    >
                                        {group.icon} {group.label}
                                    </Chip>
                                ))}
                            </div>
                        </div>

                        {/* Level 2: micro sub-groups (only if macro has children) */}
                        {microChildren.length > 0 && (
                            <div className="mb-6">
                                <p className="text-label text-text-muted mb-2">Thu hẹp danh mục (tuỳ chọn)</p>
                                <div className="flex flex-wrap gap-2">
                                    {microChildren.map(child => (
                                        <Chip
                                            key={child.slug}
                                            active={micro === child.slug}
                                            onClick={() => handleMicroSelect(child.slug)}
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

                        {/* Spend selector */}
                        <div>
                            <p className="text-label text-text-muted mb-3">
                                BƯỚC 02 · Chi tiêu hàng tháng (tuỳ chọn)
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => canDec && setSpend(SPEND_OPTIONS[spendIdx - 1].value)}
                                    disabled={!canDec}
                                    className="p-1 rounded hover:bg-bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                                    aria-label="Giảm chi tiêu"
                                >
                                    <IconChevronLeft size={16}/>
                                </button>
                                <Select value={String(spend)} onValueChange={v => setSpend(Number(v))}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SPEND_OPTIONS.map(o => (
                                            <SelectItem key={o.value} value={String(o.value)}>
                                                {o.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <button
                                    onClick={() => canInc && setSpend(SPEND_OPTIONS[spendIdx + 1].value)}
                                    disabled={!canInc}
                                    className="p-1 rounded hover:bg-bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                                    aria-label="Tăng chi tiêu"
                                >
                                    <IconChevronRight size={16}/>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: results */}
                    <div>
                        <p className="text-label text-text-muted mb-4">KẾT QUẢ ĐỀ XUẤT</p>

                        {!macro ? (
                            <p className="text-body-sm text-text-muted">Chọn nhóm chi tiêu để xem đề xuất.</p>
                        ) : (
                            <div className={`flex flex-col gap-3 transition-opacity ${loading ? 'opacity-60' : ''}`}>
                                {ranked.map(r => (
                                    <RankedRow
                                        key={r.card.id}
                                        ranked={r}
                                        tiebreakerReason={tiebreakerReasons.get(r.card.id)}
                                        tiebreakerDelta={tiebreakerDelta.get(r.card.id)}
                                        intentMap={new Map(intents.map(i => [i.slug, i]))}
                                        highlightedSlugs={activeIntentSlugs}
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

export function RecommendationFinder(props: RecommendationFinderProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return (
        <Suspense>
            <RecommendationFinderInner {...props}/>
        </Suspense>
    );
}
