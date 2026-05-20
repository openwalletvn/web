'use client';

import {Suspense, useCallback, useEffect, useRef, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import type {Bank, Card, Intent} from '@/lib/api';
import {rankCards, DEFAULT_MONTHLY_SPEND, type RankedCard} from '@/lib/card-ranker';
import {SPEND_OPTIONS} from '@/lib/spend-options';
import {CardImage} from '@/components/cards/card-image';
import {Chip} from '@/components/ui/chip';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {IconArrowRight} from '@tabler/icons-react';

const STORAGE_KEY = 'ow-rec-prefs';
const DEFAULT_TAB = 'ca-nhan';

interface RecPrefs {
    tab: string;
    intentSlug: string;
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
    compact?: boolean;
    limit?: number;
}

function ResultRow({ranked, rank}: {ranked: RankedCard; rank: number}) {
    const {card, result} = ranked;
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-100 hover:border-slate-200 transition-colors">
            <span className="text-label text-text-muted w-6 shrink-0 text-center">#{rank}</span>
            <Link href={`/the/${card.id}`} className="shrink-0">
                <CardImage card={card} className="w-16"/>
            </Link>
            <div className="flex-1 min-w-0">
                <p className="text-body font-semibold truncate">{card.name}</p>
                {card.bank_data && (
                    <p className="text-body-sm text-text-muted truncate">{card.bank_data.name}</p>
                )}
                {result.cashback > 0 ? (
                    <p className="text-body-sm text-primary font-medium">
                        +{result.cashback.toLocaleString('vi-VN')}đ hoàn/kỳ
                    </p>
                ) : (
                    <p className="text-body-sm text-text-muted">Chưa có ưu đãi</p>
                )}
            </div>
            <Link
                href={`/the/${card.id}`}
                className="shrink-0 text-body-sm font-medium text-primary border border-primary/30 rounded px-3 py-1.5 hover:bg-primary/5 transition-colors whitespace-nowrap"
            >
                Xem Thẻ
            </Link>
        </div>
    );
}

function CompactResultRow({ranked, rank}: {ranked: RankedCard; rank: number}) {
    const {card, result} = ranked;
    return (
        <div className="flex items-center gap-3 py-2">
            <span className="text-label text-text-muted w-5 shrink-0 text-center">#{rank}</span>
            <Link href={`/the/${card.id}`} className="shrink-0">
                <CardImage card={card} className="w-12"/>
            </Link>
            <div className="flex-1 min-w-0">
                <p className="text-body-sm font-semibold truncate">{card.name}</p>
                {result.cashback > 0 && (
                    <p className="text-body-sm text-primary">+{result.cashback.toLocaleString('vi-VN')}đ/kỳ</p>
                )}
            </div>
            <Link
                href={`/the/${card.id}`}
                className="shrink-0 text-body-sm text-primary hover:underline whitespace-nowrap"
            >
                Xem Thẻ
            </Link>
        </div>
    );
}

function RecommendationFinderInner({cards, banks, intents, compact = false, limit}: RecommendationFinderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const resultLimit = limit ?? (compact ? 3 : 5);

    const [tab, setTab] = useState(DEFAULT_TAB);
    const [intentSlug, setIntentSlug] = useState('');
    const [spend, setSpend] = useState(DEFAULT_MONTHLY_SPEND);
    const [initialized, setInitialized] = useState(false);

    // Init: URL params > localStorage > defaults
    useEffect(() => {
        const urlIntent = !compact ? searchParams.get('intent') : null;
        const urlSpend = !compact ? searchParams.get('spend') : null;

        if (urlIntent) {
            setIntentSlug(urlIntent);
            if (urlSpend) setSpend(Number(urlSpend) || DEFAULT_MONTHLY_SPEND);
        } else {
            const prefs = readPrefs();
            if (prefs?.intentSlug) {
                setTab(prefs.tab ?? DEFAULT_TAB);
                setIntentSlug(prefs.intentSlug);
                setSpend(prefs.spend ?? DEFAULT_MONTHLY_SPEND);
            } else if (intents.length > 0) {
                setIntentSlug(intents[0].slug);
            }
        }
        setInitialized(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync URL + localStorage on state change
    const syncRef = useRef(false);
    useEffect(() => {
        if (!initialized) return;
        writePrefs({tab, intentSlug, spend});
        if (!compact && intentSlug) {
            const params = new URLSearchParams({intent: intentSlug, spend: String(spend)});
            router.replace(`/goi-y-the?${params.toString()}`, {scroll: false});
        }
        syncRef.current = true;
    }, [tab, intentSlug, spend, initialized, compact, router]);

    const banksById = Object.fromEntries(banks.map(b => [b.id, b]));
    const personalCards = cards
        .filter(c => !c.for_business)
        .map(c => ({...c, bank_data: banksById[c.bank_id]}));

    const ranked = intentSlug
        ? rankCards(personalCards, {[intentSlug]: spend}).slice(0, resultLimit)
        : [];

    const handleTabChange = useCallback((newTab: string) => {
        setTab(newTab);
        if (newTab === 'ca-nhan' && intents.length > 0 && !intentSlug) {
            setIntentSlug(intents[0].slug);
        }
    }, [intents, intentSlug]);

    if (compact) {
        return (
            <div className="ow-recommendation-finder">
                <div className="flex flex-wrap gap-2 mb-4">
                    {intents.slice(0, 8).map(intent => (
                        <Chip
                            key={intent.slug}
                            active={intentSlug === intent.slug}
                            onClick={() => setIntentSlug(intent.slug)}
                        >
                            {intent.icon} {intent.label}
                        </Chip>
                    ))}
                </div>

                <div className="flex flex-col divide-y divide-slate-100">
                    {ranked.map((r, i) => (
                        <CompactResultRow key={r.card.id} ranked={r} rank={i + 1}/>
                    ))}
                    {ranked.length === 0 && (
                        <p className="text-body-sm text-text-muted py-2">Chọn danh mục để xem đề xuất.</p>
                    )}
                </div>

                {intentSlug && (
                    <div className="mt-4">
                        <Link
                            href={`/goi-y-the?intent=${intentSlug}&spend=${spend}`}
                            className="inline-flex items-center gap-1 text-body-sm font-medium text-primary hover:underline"
                        >
                            Xem đầy đủ <IconArrowRight size={14}/>
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="ow-recommendation-finder">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Left: Hero + controls */}
                <div>
                    <h1 className="mb-3">Gợi ý thẻ phù hợp</h1>
                    <p className="text-body text-text-muted mb-8">
                        Chọn danh mục chi tiêu và mức chi tiêu để nhận đề xuất thẻ cá nhân hoá.
                    </p>

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
                        <>
                            <div className="mb-8">
                                <p className="text-label text-text-muted mb-3">BƯỚC 1 · Bạn muốn ưu đãi gì?</p>
                                <div className="flex flex-wrap gap-2">
                                    {intents.map(intent => (
                                        <Chip
                                            key={intent.slug}
                                            active={intentSlug === intent.slug}
                                            onClick={() => setIntentSlug(intent.slug)}
                                        >
                                            {intent.icon} {intent.label}
                                        </Chip>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-label text-text-muted mb-3">
                                    BƯỚC 2 · Chi tiêu hàng tháng (tuỳ chọn)
                                </p>
                                <Select value={String(spend)} onValueChange={v => setSpend(Number(v))}>
                                    <SelectTrigger className="w-48">
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
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Results */}
                <div>
                    <p className="text-label text-text-muted mb-4">KẾT QUẢ ĐỀ XUẤT</p>

                    {tab === 'doanh-nghiep' ? null : !intentSlug ? (
                        <p className="text-body-sm text-text-muted">Chọn danh mục chi tiêu để xem đề xuất.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {ranked.map((r, i) => (
                                <ResultRow key={r.card.id} ranked={r} rank={i + 1}/>
                            ))}
                        </div>
                    )}
                </div>
            </div>
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
