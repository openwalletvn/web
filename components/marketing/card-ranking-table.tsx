'use client';

import React, {useState, useCallback, useEffect, useRef} from 'react';
import Link from 'next/link';
import type {Card, Intent} from '@/lib/api';
import {getTiebreakerReason, DEFAULT_MONTHLY_SPEND, type RankedCard} from '@/lib/card-ranker';
import {CardImage} from '@/components/cards/card-image';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {IconChevronLeft, IconChevronRight, IconCaretUpFilled, IconCaretDownFilled, IconInfoCircle, IconBulb, IconLaurelWreath1Filled, IconLaurelWreath2Filled, IconLaurelWreath3Filled} from '@tabler/icons-react';
import {SPEND_OPTIONS} from '@/lib/spend-options';

function withViewTransition(fn: () => void) {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        (document as Document & {startViewTransition: (cb: () => void) => void}).startViewTransition(fn);
    } else {
        fn();
    }
}

interface Props {
    initialRanked: RankedCard[];
    intentSlug: string;
    monthlySpend?: number;
    title?: string;
}

function RankBadge({rank}: {rank: number}) {
    if (rank === 1) return <IconLaurelWreath1Filled size={22} className="text-amber-500"/>;
    if (rank === 2) return <IconLaurelWreath2Filled size={22} className="text-slate-400"/>;
    if (rank === 3) return <IconLaurelWreath3Filled size={22} className="text-orange-400"/>;
    return <span className="text-label text-text-muted">#{rank}</span>;
}

function getRateDisplay(card: Card, intentSlug?: string): string {
    const rules = card.cashback?.rules ?? [];
    const matched = intentSlug
        ? rules.filter(r => r.categories?.includes(intentSlug) || r.merchants?.includes(intentSlug))
        : [];
    const relevant = matched.length > 0
        ? matched
        : rules.filter(r => !r.categories?.length && !r.merchants?.length);
    if (!relevant.length) return '';
    const rates = relevant.flatMap(r => [r.rate, ...(r.rate_max != null ? [r.rate_max] : [])]);
    const min = Math.min(...rates) * 100;
    const max = Math.max(...rates) * 100;
    const fmt = (n: number) => Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.?0+$/, '');
    return min === max ? `${fmt(min)}%` : `${fmt(min)}%–${fmt(max)}%`;
}

function CashbackDisplay({ranked, intentSlug}: {ranked: RankedCard; intentSlug?: string}) {
    const {cashback, actual_rate, optimal_spend} = ranked.cashback_result;

    if (cashback === 0) {
        return (
            <div className="flex flex-col items-start sm:items-end gap-0.5">
                <span className="text-body-sm text-text-muted">Chưa có ưu đãi</span>
            </div>
        );
    }

    const rateDisplay = getRateDisplay(ranked.card, intentSlug) || `${actual_rate}%`;

    return (
        <div className="flex flex-col items-start sm:items-end gap-0.5">
            <span className="text-body-lg font-semibold text-primary">
                +{cashback.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-body-sm text-text-muted">
                Hoàn {rateDisplay}/kỳ
            </span>
            {optimal_spend > 0 && (
                <span className="text-body-sm text-text-muted">
                    Tối đa từ {optimal_spend.toLocaleString('vi-VN')}đ
                </span>
            )}
        </div>
    );
}

export function CardRankingTable({initialRanked, intentSlug, monthlySpend = DEFAULT_MONTHLY_SPEND, title}: Props) {
    const [spend, setSpend] = useState(monthlySpend);
    const [ranked, setRanked] = useState<RankedCard[]>(initialRanked);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const changeSpend = useCallback((v: number) => withViewTransition(() => setSpend(v)), []);
    const spendIdx = SPEND_OPTIONS.findIndex(o => o.value === spend);
    const canDec = spendIdx > 0;
    const canInc = spendIdx < SPEND_OPTIONS.length - 1;

    const isInitial = useRef(true);
    useEffect(() => {
        if (isInitial.current) {
            isInitial.current = false;
            return;
        }
        setLoading(true);
        const t = setTimeout(async () => {
            try {
                const res = await fetch('/api/ranking', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({spend: {[intentSlug]: spend}, limit: 50}),
                });
                const json = await res.json();
                if (json.data) withViewTransition(() => setRanked(json.data));
            } finally {
                setLoading(false);
            }
        }, 200);
        return () => clearTimeout(t);
    }, [spend, intentSlug]);

    const withCashback = ranked.filter(r => r.cashback_result.cashback > 0);
    const noCashback = ranked.filter(r => r.cashback_result.cashback === 0);

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

    return (
        <section className="ow-card-ranking-table">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                {title && <h2 className="mb-0 text-card-heading">{title}</h2>}
                {mounted && <div className="flex items-center gap-2 shrink-0">
                    <span className="text-body-sm text-text-muted">Chi tiêu mỗi kỳ</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => canDec && changeSpend(SPEND_OPTIONS[spendIdx - 1].value)}
                            disabled={!canDec}
                            className="p-1 rounded hover:bg-bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                            aria-label="Giảm chi tiêu"
                        >
                            <IconChevronLeft size={16}/>
                        </button>
                        <Select value={String(spend)} onValueChange={v => changeSpend(Number(v))}>
                            <SelectTrigger className="w-32">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {SPEND_OPTIONS.map(o => (
                                    <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <button
                            onClick={() => canInc && changeSpend(SPEND_OPTIONS[spendIdx + 1].value)}
                            disabled={!canInc}
                            className="p-1 rounded hover:bg-bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                            aria-label="Tăng chi tiêu"
                        >
                            <IconChevronRight size={16}/>
                        </button>
                    </div>
                </div>}
            </div>

            <div className={`flex flex-col gap-3 transition-opacity ${loading ? 'opacity-60' : ''}`}>
                {withCashback.map(ranked => (
                    <RankedRow
                        key={ranked.card.id}
                        ranked={ranked}
                        tiebreakerReason={tiebreakerReasons.get(ranked.card.id)}
                        tiebreakerDelta={tiebreakerDelta.get(ranked.card.id)}
                        viewTransitionName={`card-row-${ranked.card.id}`}
                        intentSlug={intentSlug}
                    />
                ))}

                {noCashback.length > 0 && (
                    <>
                        <p className="text-body-sm text-text-muted mt-2 mb-1">Các thẻ khác trong nhóm</p>
                        {noCashback.map(ranked => (
                            <RankedRow
                                key={ranked.card.id}
                                ranked={ranked}
                                muted
                                viewTransitionName={`card-row-${ranked.card.id}`}
                                intentSlug={intentSlug}
                            />
                        ))}
                    </>
                )}
            </div>

            <p className="flex items-center gap-1.5 text-body-sm text-text-muted mt-4">
                <IconInfoCircle size={14} className="shrink-0"/>
                Xếp hạng theo hoàn tiền ước tính · cùng hoàn tiền thì ưu tiên phí thường niên thấp hơn, sau đó Visa/Mastercard.
            </p>
        </section>
    );
}

export function RankedRow({ranked, muted = false, tiebreakerReason, tiebreakerDelta, viewTransitionName, intentMap, highlightedSlugs, intentSlug}: {
    ranked: RankedCard;
    muted?: boolean;
    tiebreakerReason?: string;
    tiebreakerDelta?: number;
    viewTransitionName?: string;
    intentMap?: Map<string, Pick<Intent, 'slug' | 'label' | 'icon'>>;
    highlightedSlugs?: string[];
    intentSlug?: string;
}) {
    const {card, rank} = ranked;
    const isTop3 = rank <= 3 && !muted;
    const highlighted = new Set(highlightedSlugs ?? []);

    const hasUniversalRule = card.cashback?.rules.some(r => !r.merchants?.length && !r.categories?.length) ?? false;
    const cardIntents = intentMap
        ? [...new Set(card.cashback?.rules.flatMap(r => [...(r.merchants ?? []), ...(r.categories ?? [])]) ?? [])]
            .map(slug => intentMap.get(slug))
            .filter((i): i is Pick<Intent, 'slug' | 'label' | 'icon'> => !!i)
        : [];

    return (
        <div
            className={`ow-ranked-row flex items-center gap-3 rounded-lg p-3 sm:p-4 ${
                isTop3
                    ? 'bg-white border-2 border-primary shadow-sm'
                    : 'bg-white border border-slate-100'
            }`}
            style={viewTransitionName ? {viewTransitionName} as React.CSSProperties : undefined}
        >
            {/* Rank + tiebreaker direction */}
            <div className="w-10 sm:w-12 shrink-0 flex flex-col items-center gap-0.5">
                {muted ? (
                    <span className="text-label text-text-muted">#{ranked.rank}</span>
                ) : (
                    <RankBadge rank={rank}/>
                )}
                {tiebreakerDelta !== undefined && tiebreakerDelta > 0 && (
                    <span className="flex items-center gap-0.5 text-emerald-500 text-[10px] font-semibold leading-none">
                        <IconCaretUpFilled size={10}/>{tiebreakerDelta}
                    </span>
                )}
                {tiebreakerDelta !== undefined && tiebreakerDelta < 0 && (
                    <span className="flex items-center gap-0.5 text-orange-400 text-[10px] font-semibold leading-none">
                        <IconCaretDownFilled size={10}/>{Math.abs(tiebreakerDelta)}
                    </span>
                )}
            </div>

            {/* Card image (clickable) */}
            <Link href={`/the/${card.id}`} className="shrink-0 w-16 sm:w-20">
                <CardImage card={card} className="w-16 sm:w-20"/>
            </Link>

            {/* Card info + cashback */}
            <div className="flex flex-1 min-w-0 flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <div className="flex-1 min-w-0">
                    <Link href={`/the/${card.id}`} className={`text-body font-semibold truncate block hover:underline ${muted ? 'text-text-muted' : 'text-black'}`}>
                        {card.name}
                    </Link>
                    {card.bank_data && (
                        <p className="text-body-sm text-text-muted truncate">{card.bank_data.name}</p>
                    )}
                    {card.fees?.annual != null && (
                        <p className="text-body-sm text-text-muted">
                            {card.fees.annual.amount === 0
                                ? 'Miễn phí thường niên'
                                : `Phí ${card.fees.annual.amount.toLocaleString('vi-VN')}đ/năm`}
                        </p>
                    )}
                    {intentMap && (cardIntents.length > 0 || hasUniversalRule) && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                            {hasUniversalRule && (
                                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium ${
                                    highlighted.size > 0 ? 'bg-primary/10 text-primary' : 'bg-bg-muted text-text-muted'
                                }`}>
                                    🌐 Tất cả chi tiêu
                                </span>
                            )}
                            {cardIntents.map(intent => (
                                <span
                                    key={intent.slug}
                                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium ${
                                        highlighted.has(intent.slug)
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-bg-muted text-text-muted opacity-50'
                                    }`}
                                >
                                    {intent.icon} {intent.label}
                                </span>
                            ))}
                        </div>
                    )}
                    {tiebreakerReason && (
                        <span className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                            <IconBulb size={12} className="shrink-0 text-amber-400"/>
                            {tiebreakerReason}
                        </span>
                    )}
                </div>

                {/* Cashback */}
                <div className="shrink-0 sm:text-right">
                    <CashbackDisplay ranked={ranked} intentSlug={intentSlug}/>
                </div>
            </div>
        </div>
    );
}
