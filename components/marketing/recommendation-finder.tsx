'use client';

import {Suspense, useCallback, useEffect, useMemo, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {getTool} from '@/lib/tools';
import type {Intent} from '@/lib/api';
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
    groupSlugs: string[];
    intentSlugs: string[];
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

interface IntentGroup {
    slug: string;
    label: string;
    icon: string;
    intentSlugs: string[];
}

export interface RecommendationFinderProps {
    intents: Intent[];
    limit?: number;
}


function RecommendationFinderInner({intents, limit = 5}: RecommendationFinderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFinderPage = pathname === cardMatchHref;

    const [tab, setTab] = useState(DEFAULT_TAB);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [selectedIntents, setSelectedIntents] = useState<string[]>([]);
    const [spend, setSpend] = useState(DEFAULT_MONTHLY_SPEND);
    const [initialized, setInitialized] = useState(false);
    const [ranked, setRanked] = useState<RankedCard[]>([]);
    const [loading, setLoading] = useState(false);

    const groups = useMemo<IntentGroup[]>(() => {
        const map = new Map<string, IntentGroup>();
        for (const intent of intents) {
            if (!map.has(intent.group)) {
                map.set(intent.group, {slug: intent.group, label: intent.group, icon: '📦', intentSlugs: []});
            }
            const g = map.get(intent.group)!;
            g.intentSlugs.push(intent.slug);
            if (intent.slug === intent.group) {
                g.label = intent.label;
                g.icon = intent.icon;
            }
        }
        return Array.from(map.values());
    }, [intents]);

    // Init: URL params (finder page only) > localStorage > defaults
    useEffect(() => {
        const urlGroup = isFinderPage ? searchParams.get('group') : null;
        const urlIntent = isFinderPage ? searchParams.get('intent') : null;
        const urlSpend = isFinderPage ? searchParams.get('spend') : null;

        if (urlGroup) {
            setSelectedGroups(urlGroup.split(',').filter(Boolean));
            if (urlIntent) setSelectedIntents(urlIntent.split(',').filter(Boolean));
            if (urlSpend) setSpend(Number(urlSpend) || DEFAULT_MONTHLY_SPEND);
        } else {
            const prefs = readPrefs();
            if (prefs?.groupSlugs?.length) {
                setTab(prefs.tab ?? DEFAULT_TAB);
                setSelectedGroups(prefs.groupSlugs);
                setSelectedIntents(prefs.intentSlugs ?? []);
                setSpend(prefs.spend ?? DEFAULT_MONTHLY_SPEND);
            } else if (groups.length > 0) {
                setSelectedGroups([groups[0].slug]);
            }
        }
        setInitialized(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync URL (finder page only) + localStorage on state change
    useEffect(() => {
        if (!initialized) return;
        writePrefs({tab, groupSlugs: selectedGroups, intentSlugs: selectedIntents, spend});
        if (isFinderPage && selectedGroups.length > 0) {
            const p: Record<string, string> = {group: selectedGroups.join(','), spend: String(spend)};
            if (selectedIntents.length > 0) p.intent = selectedIntents.join(',');
            router.replace(`${cardMatchHref}?${new URLSearchParams(p).toString()}`, {scroll: false});
        }
    }, [tab, selectedGroups, selectedIntents, spend, initialized, isFinderPage, router]);

    const spendIdx = SPEND_OPTIONS.findIndex(o => o.value === spend);
    const canDec = spendIdx > 0;
    const canInc = spendIdx < SPEND_OPTIONS.length - 1;

    const activeIntentSlugs = useMemo(() => {
        if (selectedIntents.length > 0) return selectedIntents;
        return intents.filter(i => selectedGroups.includes(i.group)).map(i => i.slug);
    }, [intents, selectedGroups, selectedIntents]);

    // Non-catchall intents available for precise selection within chosen groups
    const specificIntents = useMemo(
        () => intents.filter(i => selectedGroups.includes(i.group) && i.slug !== i.group),
        [intents, selectedGroups]
    );

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

    const toggleGroup = useCallback((slug: string) => {
        setSelectedGroups(prev => {
            if (prev.includes(slug) && prev.length === 1) return prev; // enforce min 1
            return prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
        });
        // prune specific intents that belonged to deselected group
        setSelectedIntents(prev => {
            const groupIntentSlugs = new Set(intents.filter(i => i.group === slug).map(i => i.slug));
            return prev.filter(s => !groupIntentSlugs.has(s));
        });
    }, [intents]);

    const toggleIntent = useCallback((slug: string) => {
        setSelectedIntents(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    }, []);

    const handleTabChange = useCallback((newTab: string) => {
        setTab(newTab);
        if (newTab === 'ca-nhan' && groups.length > 0 && selectedGroups.length === 0) {
            setSelectedGroups([groups[0].slug]);
        }
    }, [groups, selectedGroups]);

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
                        <div className="mb-8">
                            <p className="text-label text-text-muted mb-3">BƯỚC 01 · Bạn muốn ưu đãi gì?</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {groups.map(group => (
                                    <Chip
                                        key={group.slug}
                                        active={selectedGroups.includes(group.slug)}
                                        onClick={() => toggleGroup(group.slug)}
                                    >
                                        {group.icon} {group.label}
                                    </Chip>
                                ))}
                            </div>
                            {specificIntents.length > 0 && (
                                <div>
                                    <p className="text-label text-text-muted mb-2">Thu hẹp kết quả (tuỳ chọn)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {specificIntents.map(intent => (
                                            <Chip
                                                key={intent.slug}
                                                active={selectedIntents.includes(intent.slug)}
                                                onClick={() => toggleIntent(intent.slug)}
                                            >
                                                {intent.icon} {intent.label}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

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

                        {selectedGroups.length === 0 ? (
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
    return (
        <Suspense>
            <RecommendationFinderInner {...props}/>
        </Suspense>
    );
}
