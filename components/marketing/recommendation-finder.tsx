'use client';

import {Suspense, useCallback, useEffect, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import type {Bank, Card, Intent} from '@/lib/api';
import {DEFAULT_MONTHLY_SPEND, getTiebreakerReason, rankCards} from '@/lib/card-ranker';
import {SPEND_OPTIONS} from '@/lib/spend-options';
import {Chip} from '@/components/ui/chip';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {IconChevronLeft, IconChevronRight} from '@tabler/icons-react';
import {RankedRow} from '@/components/marketing/card-ranking-table';

const STORAGE_KEY = 'ow-rec-prefs';
const DEFAULT_TAB = 'ca-nhan';

interface RecPrefs {
    tab: string;
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

export interface RecommendationFinderProps {
    cards: Card[];
    banks: Bank[];
    intents: Intent[];
    limit?: number;
}


function RecommendationFinderInner({cards, banks, intents, limit = 5}: RecommendationFinderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFinderPage = pathname === '/goi-y-the';

    const [tab, setTab] = useState(DEFAULT_TAB);
    const [intentSlugs, setIntentSlugs] = useState<string[]>([]);
    const [spend, setSpend] = useState(DEFAULT_MONTHLY_SPEND);
    const [initialized, setInitialized] = useState(false);

    // Init: URL params (finder page only) > localStorage > defaults
    useEffect(() => {
        const urlIntent = isFinderPage ? searchParams.get('intent') : null;
        const urlSpend = isFinderPage ? searchParams.get('spend') : null;

        if (urlIntent) {
            setIntentSlugs(urlIntent.split(',').filter(Boolean));
            if (urlSpend) setSpend(Number(urlSpend) || DEFAULT_MONTHLY_SPEND);
        } else {
            const prefs = readPrefs();
            if (prefs?.intentSlugs?.length) {
                setTab(prefs.tab ?? DEFAULT_TAB);
                setIntentSlugs(prefs.intentSlugs);
                setSpend(prefs.spend ?? DEFAULT_MONTHLY_SPEND);
            } else if (intents.length > 0) {
                setIntentSlugs([intents[0].slug]);
            }
        }
        setInitialized(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync URL (finder page only) + localStorage on state change
    useEffect(() => {
        if (!initialized) return;
        writePrefs({tab, intentSlugs, spend});
        if (isFinderPage && intentSlugs.length > 0) {
            const params = new URLSearchParams({intent: intentSlugs.join(','), spend: String(spend)});
            router.replace(`/goi-y-the?${params.toString()}`, {scroll: false});
        }
    }, [tab, intentSlugs, spend, initialized, isFinderPage, router]);

    const spendIdx = SPEND_OPTIONS.findIndex(o => o.value === spend);
    const canDec = spendIdx > 0;
    const canInc = spendIdx < SPEND_OPTIONS.length - 1;

    const banksById = Object.fromEntries(banks.map(b => [b.id, b]));
    const personalCards = cards
        .filter(c => !c.for_business)
        .map(c => ({...c, bank_data: banksById[c.bank_id]}));

    const ranked = intentSlugs.length > 0
        ? rankCards(personalCards, Object.fromEntries(intentSlugs.map(s => [s, spend]))).slice(0, limit)
        : [];

    const withCashback = ranked.filter(r => r.result.cashback > 0);
    const tiebreakerReasons = new Map<string, string>();
    const tiebreakerDelta = new Map<string, number>();
    let gi = 0;
    while (gi < withCashback.length) {
        let gj = gi;
        while (gj < withCashback.length && withCashback[gj].result.cashback === withCashback[gi].result.cashback) gj++;
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

    const toggleIntent = useCallback((slug: string) => {
        setIntentSlugs(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    }, []);

    const handleTabChange = useCallback((newTab: string) => {
        setTab(newTab);
        if (newTab === 'ca-nhan' && intents.length > 0 && intentSlugs.length === 0) {
            setIntentSlugs([intents[0].slug]);
        }
    }, [intents, intentSlugs]);

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
                            <div className="flex flex-wrap gap-2">
                                {intents.map(intent => (
                                    <Chip
                                        key={intent.slug}
                                        active={intentSlugs.includes(intent.slug)}
                                        onClick={() => toggleIntent(intent.slug)}
                                    >
                                        {intent.icon} {intent.label}
                                    </Chip>
                                ))}
                            </div>
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

                        {intentSlugs.length === 0 ? (
                            <p className="text-body-sm text-text-muted">Chọn danh mục chi tiêu để xem đề xuất.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {ranked.map(r => (
                                    <RankedRow
                                        key={r.card.id}
                                        ranked={r}
                                        tiebreakerReason={tiebreakerReasons.get(r.card.id)}
                                        tiebreakerDelta={tiebreakerDelta.get(r.card.id)}
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
