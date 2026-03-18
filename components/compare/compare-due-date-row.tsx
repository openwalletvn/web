'use client';

import { useState, useEffect } from 'react';
import { IconCalendarTime } from '@tabler/icons-react';
import { getRelatedStatements } from '@/lib/card-dates';
import type { Card } from '@/lib/api';

interface Props {
    cardA: Card;
    cardB: Card;
}

function getNextDue(card: Card): string {
    if (!card.statement_date || !card.interest_free_days) return '—';
    const today = new Date();
    const tod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const stmts = getRelatedStatements(tod, card.statement_date, card.interest_free_days);
    const cycle = stmts.find((s) => s.due >= tod) ?? stmts[2];
    const day = cycle.due.getDate().toString().padStart(2, '0');
    const month = (cycle.due.getMonth() + 1).toString().padStart(2, '0');
    return `ngày ${day}/${month}`;
}

export function CompareDueDateRow({ cardA, cardB }: Props) {
    const [dueA, setDueA] = useState<string | null>(null);
    const [dueB, setDueB] = useState<string | null>(null);

    useEffect(() => {
        setDueA(getNextDue(cardA));
        setDueB(getNextDue(cardB));
    }, [cardA, cardB]); // eslint-disable-line react-hooks/exhaustive-deps

    const resolved = dueA !== null && dueB !== null;
    const same = resolved && dueA === dueB;
    const valueClass = same ? 'text-slate-400' : 'text-slate-800';

    return (
        <div className="py-6 border-b border-slate-100 last:border-0">
            <div className="flex items-center justify-center gap-1.5 mb-4 text-slate-400">
                <IconCalendarTime size={13} />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Ngày đến hạn dự kiến
                </span>
            </div>
            <div className="grid grid-cols-2">
                <div className={`text-center text-lg font-semibold ${valueClass}`}>{dueA ?? '…'}</div>
                <div className={`text-center text-lg font-semibold ${valueClass}`}>{dueB ?? '…'}</div>
            </div>
        </div>
    );
}
