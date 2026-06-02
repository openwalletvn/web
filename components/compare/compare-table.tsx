'use client';

import {useEffect, useState} from 'react';
import type {Card, CompareResult} from '@/lib/api';
import {formatDueDate, getNextDueDate} from '@/lib/card-dates';

import {CompareRow} from './compare-row';
import {CompareSectionTitle} from './compare-section-title';
import {type CompareContext, resolveSection, SECTION_DEFS} from './compare-row-defs';

interface Props {
    cards: (Card | null)[];
    compareResult?: CompareResult | null;
}

export function CompareTable({cards, compareResult}: Props) {
    const [dues, setDues] = useState<(string | null)[]>(() => Array(cards.length).fill(null));

    useEffect(() => {
        setDues(cards.map((c) => {
            if (!c) return '—';
            const due = getNextDueDate(c.statement_date, c.interest_free_days);
            return due ? formatDueDate(due) : '—';
        }));
    }, [cards]); // eslint-disable-line react-hooks/exhaustive-deps

    const ctx: CompareContext = {compareResult, dues, cardIds: cards.map(c => c?.id ?? null)};

    return (
        <div className="ow-compare-table">
            {SECTION_DEFS.map(section => {
                if (section.visible?.(cards, ctx) === false) return null;
                const rows = resolveSection(section, cards, ctx);
                if (!rows.length) return null;
                return (
                    <div key={section.section}>
                        <CompareSectionTitle label={section.label}/>
                        {rows.map(row => (
                            <CompareRow
                                key={row.id}
                                id={row.id}
                                label={row.label}
                                values={row.getValues(cards, ctx)}
                                descriptions={row.getDescriptions?.(cards, ctx)}
                                winnerIndex={row.getWinnerIndex?.(cards, ctx)}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
