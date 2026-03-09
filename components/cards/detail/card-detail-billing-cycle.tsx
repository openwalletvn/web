'use client';

import { useState, useEffect } from 'react';
import type { Card, Bank } from '@/lib/api';
import { getRelatedStatements } from '@/lib/card-dates';

interface Props {
    card: Card;
    bank: Bank | null;
}

interface CycleInfo {
    dueDay: number;
    closeLabel: string;
    dueLabel: string;
}

export function CardDetailBillingCycle({ card }: Props) {
    const isCreditCard = card.card_type.includes('credit') || card.card_type.includes('2in1');
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
        const dueDiff = Math.round((cycle.due.getTime() - tod.getTime()) / msPerDay);

        setInfo({
            dueDay: cycle.due.getDate(),
            closeLabel:
                closeDiff === 0 ? 'Hôm nay'
                : closeDiff < 0 ? `${Math.abs(closeDiff)} ngày trước`
                : `còn ${closeDiff} ngày`,
            dueLabel:
                dueDiff === 0 ? 'Hôm nay'
                : dueDiff > 0 ? `còn ${dueDiff} ngày`
                : 'Đã qua hạn',
        });
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    if (!isCreditCard || !hasData) return null;

    return (
        <div className="pt-10 relative">
            {/* Track */}
            <div className="flex items-center">
                {/* Left node */}
                <div className="shrink-0 z-10">
                    <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                </div>

                {/* Gradient bar */}
                <div className="flex-1 relative">
                    <div className="h-1 bg-gradient-to-r from-brand-blue to-green-500" />
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-semibold text-slate-700">
                        <span className="text-2xl">{card.interest_free_days}</span>
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
            <div className="flex justify-between mt-3">
                <div>
                    <p className="text-base font-semibold text-slate-700">Chốt sao kê</p>
                    <p className="text-slate-700">
                        Ngày <span className="text-2xl font-bold">{card.statement_date}</span>
                    </p>
                    {info && <p className="text-base text-brand-blue mt-0.5">{info.closeLabel}</p>}
                </div>
                <div className="text-right">
                    <p className="text-base font-semibold text-slate-700">Hạn thanh toán</p>
                    <p className="text-slate-700">
                        {info
                            ? <>Ngày <span className="text-2xl font-bold">{info.dueDay}</span></>
                            : '…'}
                    </p>
                    {info && <p className="text-base text-green-600 mt-0.5">{info.dueLabel}</p>}
                </div>
            </div>

            <p className="text-base text-slate-600 mt-3">
                Số ngày miễn lãi tối đa tính từ ngày chốt sao kê
            </p>
        </div>
    );
}
