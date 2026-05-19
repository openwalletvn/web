'use client';

import {useState} from 'react';
import Link from 'next/link';
import type {Bank, Card} from '@/lib/api';
import {rankCards, DEFAULT_MONTHLY_SPEND, type RankedCard} from '@/lib/card-ranker';
import {CardImage} from '@/components/cards/card-image';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {IconChevronLeft, IconChevronRight} from '@tabler/icons-react';

const SPEND_OPTIONS = [
    {value: 1_000_000,  label: '1 triệu/kỳ'},
    {value: 2_000_000,  label: '2 triệu/kỳ'},
    {value: 3_000_000,  label: '3 triệu/kỳ'},
    {value: 5_000_000,  label: '5 triệu/kỳ'},
    {value: 10_000_000, label: '10 triệu/kỳ'},
    {value: 20_000_000, label: '20 triệu/kỳ'},
];

interface Props {
    cards: Card[];
    banks: Bank[];
    intentSlug: string;
    monthlySpend?: number;
    title?: string;
}

function RankBadge({rank}: {rank: number}) {
    if (rank === 1) return <span className="text-label text-amber-500">TOP 1</span>;
    if (rank === 2) return <span className="text-label text-slate-400">TOP 2</span>;
    if (rank === 3) return <span className="text-label text-orange-400">TOP 3</span>;
    return <span className="text-label text-text-muted">#{rank}</span>;
}

function CashbackDisplay({ranked}: {ranked: RankedCard}) {
    const {cashback, actualRate, optimalSpend} = ranked.result;

    if (cashback === 0) {
        return (
            <div className="flex flex-col items-end gap-0.5">
                <span className="text-body-sm text-text-muted">Chưa có ưu đãi</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end gap-0.5">
            <span className="text-body-lg font-semibold text-primary">
                +{cashback.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-body-sm text-text-muted">
                Hoàn {actualRate}%/kỳ
            </span>
            {optimalSpend > 0 && (
                <span className="text-body-sm text-text-muted">
                    Tối đa từ {optimalSpend.toLocaleString('vi-VN')}đ
                </span>
            )}
        </div>
    );
}

export function CardRankingTable({cards, banks, intentSlug, monthlySpend = DEFAULT_MONTHLY_SPEND, title}: Props) {
    const [spend, setSpend] = useState(monthlySpend);
    const spendIdx = SPEND_OPTIONS.findIndex(o => o.value === spend);
    const canDec = spendIdx > 0;
    const canInc = spendIdx < SPEND_OPTIONS.length - 1;

    const banksById = Object.fromEntries(banks.map(b => [b.id, b]));
    const rankedCards = rankCards(
        cards.map(c => ({...c, bank_data: banksById[c.bank_id]})),
        {[intentSlug]: spend}
    );

    const withCashback = rankedCards.filter(r => r.result.cashback > 0);
    const noCashback = rankedCards.filter(r => r.result.cashback === 0);

    return (
        <section className="ow-card-ranking-table">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                {title && <h2 className="mb-0">{title}</h2>}
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-body-sm text-text-muted">Chi tiêu mỗi kỳ</span>
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

            <div className="flex flex-col gap-3">
                {withCashback.map(ranked => (
                    <RankedRow key={ranked.card.id} ranked={ranked}/>
                ))}

                {noCashback.length > 0 && (
                    <>
                        <p className="text-body-sm text-text-muted mt-2 mb-1">Các thẻ khác trong nhóm</p>
                        {noCashback.map(ranked => (
                            <RankedRow key={ranked.card.id} ranked={ranked} muted/>
                        ))}
                    </>
                )}
            </div>
        </section>
    );
}

function RankedRow({ranked, muted = false}: {ranked: RankedCard; muted?: boolean}) {
    const {card, rank} = ranked;
    const isTop3 = rank <= 3 && !muted;

    return (
        <Link
            href={`/the/${card.id}`}
            className={`flex items-center gap-4 rounded-lg p-4 transition-colors hover:bg-bg-muted ${
                isTop3
                    ? 'bg-white border-2 border-primary shadow-sm'
                    : 'bg-white border border-slate-100'
            }`}
        >
            {/* Rank */}
            <div className="w-12 shrink-0 flex justify-center">
                {muted ? (
                    <span className="text-label text-text-muted">#{ranked.rank}</span>
                ) : (
                    <RankBadge rank={rank}/>
                )}
            </div>

            {/* Card image */}
            <div className="shrink-0 w-20">
                <CardImage card={card} className="w-20"/>
            </div>

            {/* Card info */}
            <div className="flex-1 min-w-0">
                <p className={`text-body font-semibold truncate ${muted ? 'text-text-muted' : 'text-black'}`}>
                    {card.name}
                </p>
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
            </div>

            {/* Cashback */}
            <div className="shrink-0">
                <CashbackDisplay ranked={ranked}/>
            </div>
        </Link>
    );
}
