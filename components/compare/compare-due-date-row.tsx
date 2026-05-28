'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getRelatedStatements } from '@/lib/card-dates';
import type { Card } from '@/lib/api';

interface Props {
    cards: (Card | null)[];
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

export function CompareDueDateRow({ cards }: Props) {
    const [dues, setDues] = useState<(string | null)[]>(() => Array(cards.length).fill(null));

    useEffect(() => {
        setDues(cards.map((c) => c ? getNextDue(c) : '—'));
    }, [cards]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="ow-compare-due-date-row py-3">
            <p className="text-xs text-slate-400 mb-1.5">Ngày đến hạn dự kiến</p>
            <div className="grid" style={{ gridTemplateColumns: `repeat(${cards.length}, 1fr)` }}>
                {dues.map((due, i) => (
                    <div key={i} className={cn('text-lg font-semibold min-w-[6ch]', due === '—' ? 'text-slate-300' : 'text-slate-800')}>
                        {due ?? '…'}
                    </div>
                ))}
            </div>
        </div>
    );
}
