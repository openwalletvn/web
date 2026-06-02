'use client';

import {useEffect, useState} from 'react';
import type {Bank, Card} from '@/lib/api';
import {getNextDueDiff, getRelatedStatements} from '@/lib/card-dates';
import {cn} from "@/lib/utils";

interface Props {
    card: Card;
    bank: Bank | null;
}

interface CycleInfo {
    dueDay: number;
    dueMonth: number;
    closeMonth: number;
    closeLabel: string;
    dueLabel: string;
    todayPct: number;   // 0–100, position of today between close and due
    dueDiff: number;    // days until due (negative = overdue)
}
export function CardDetailBillingCycle({ card }: Props) {
    const isCreditCard = card.card_type.includes('credit') || card.card_type.includes('hybrid');
    const hasData = card.interest_free_days != null && card.statement_date != null;
    const [info, setInfo] = useState<CycleInfo | null>(null);

    useEffect(() => {
        if (!isCreditCard || !hasData) return;

        const today = new Date();
        const tod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const stmts = getRelatedStatements(tod, card.statement_date!, card.interest_free_days!);
        const cycle = stmts.find((s) => s.due >= tod) ?? stmts[2];

        const msPerDay = 86_400_000;
        const closeDiff = Math.round((cycle.close.getTime() - tod.getTime()) / msPerDay);
        const dueDiff = getNextDueDiff(card.statement_date, card.interest_free_days, today)!.dueDiff;

        // today's position between close and due (clamped 0–100)
        const span = cycle.due.getTime() - cycle.close.getTime();
        const elapsed = tod.getTime() - cycle.close.getTime();
        const todayPct = Math.min(100, Math.max(0, (elapsed / span) * 100));

        setInfo({
            dueDay: cycle.due.getDate(),
            dueMonth: cycle.due.getMonth() + 1,
            closeMonth: cycle.close.getMonth() + 1,
            closeLabel:
                closeDiff === 0 ? 'Hôm nay'
                : closeDiff < 0 ? `${Math.abs(closeDiff)} ngày trước`
                : `còn ${closeDiff} ngày`,
            dueLabel:
                dueDiff === 0 ? 'Hôm nay'
                : dueDiff > 0 ? `còn ${dueDiff} ngày`
                : 'Đã qua hạn',
            todayPct,
            dueDiff,
        });
    }, [card.statement_date, card.interest_free_days]);

    if (!isCreditCard || !hasData) return null;

    return (
        <div className="ow-card-detail-billing-cycle pt-10 relative">
            {/* Track */}
            <div className="flex items-center">
                {/* Left node */}
                <div className="shrink-0 z-10">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                </div>

                {/* Gradient bar + today marker */}
                <div className="flex-1 relative">
                    <div className="h-1 bg-gradient-to-r from-primary to-green-500"/>

                    <span
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-semibold text-slate-700">
                        <span className="text-numeral">{card.interest_free_days}</span>
                        <span className="text-base"> ngày miễn lãi</span>
                    </span>
                </div>

                {/* Right node */}
                <div className="shrink-0 z-10">
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                </div>
            </div>

            {/* Node labels */}
            <div className="flex justify-between mt-10">
                <div>
                    <p className="font-semibold text-slate-700">Chốt sao kê</p>
                    <p className="text-slate-700">
                        Ngày <span className="ow-cycle-statement-date text-numeral">
                        {card.statement_date}
                        {info && <span className="text-slate-500">/{info.closeMonth}</span>}
                    </span>
                    </p>
                    {info && <p className="text-base text-brand-blue mt-0.5">{info.closeLabel}</p>}
                </div>
                <div className="text-right">
                    <p className="text-base font-semibold text-slate-700">Hạn thanh toán</p>
                    <p className="text-slate-700">
                        {info
                            ? <>Ngày <span className="ow-cycle-due-date text-numeral">{info.dueDay}
                                <span className="text-slate-500">/{info.dueMonth}</span>
                            </span></>
                            : '…'}
                    </p>
                    {info && (
                        <p className={cn('text-base mt-0.5', info.dueDiff < 0 ? 'text-red-500' : 'text-green-600')}>
                            {info.dueLabel}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
