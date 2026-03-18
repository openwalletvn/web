'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { Card } from '@/lib/api';
import type { SearchCard } from '@/lib/search-types';
import { useRecentCompares } from '@/lib/use-recent-compares';
import { useCardSearch } from '@/lib/use-card-search';
import { CardImage } from '@/components/cards/card-image';

function toCardShell(sc: SearchCard): Card {
    return {
        id: sc.id,
        name: sc.name,
        image: sc.image_url
            ? { url: sc.image_url, orientation: 'horizontal', width: null, height: null }
            : null,
        bank_id: sc.bank_id,
        card_network: sc.card_network as Card['card_network'],
        card_type: sc.card_type as Card['card_type'],
        fees: null,
        statement_date: null,
        interest_free_days: null,
        contactless_methods: [],
        contactless_methods_data: [],
        card_tier: null,
        sources: [],
    } as unknown as Card;
}

interface Props {
    /** Fallback card IDs to show when the user has no recent compare history */
    fallbackCardIds?: string[];
}

export function CompareSuggestedCards({ fallbackCardIds = [] }: Props) {
    const { recentCompares } = useRecentCompares();
    const { lookup, load } = useCardSearch();

    useEffect(() => { load(); }, [load]);

    // Flatten all pairs → unique card IDs in order of appearance, cap at 6
    const seen = new Set<string>();
    const cards: SearchCard[] = [];
    for (const { pair } of recentCompares) {
        const ids = (pair.includes(',') ? pair.split(',') : pair.split('-vs-')).filter(Boolean);
        for (const id of ids) {
            if (seen.has(id) || cards.length >= 6) continue;
            seen.add(id);
            const card = lookup(id);
            if (card) cards.push(card);
        }
        if (cards.length >= 6) break;
    }

    // No recent history → use fallback IDs (fetched server-side from compare pairs API)
    if (cards.length === 0 && fallbackCardIds.length > 0) {
        for (const id of fallbackCardIds) {
            if (cards.length >= 6) break;
            const card = lookup(id);
            if (card) cards.push(card);
        }
    }

    if (cards.length === 0) return null;

    return (
        <div className="mt-16 pt-10 border-t border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Có thể bạn muốn xem</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {cards.map((sc) => (
                    <Link key={sc.id} href={`/the/${sc.id}`} className="flex flex-col gap-2 group">
                        <CardImage card={toCardShell(sc)} tilt />
                        <p className="text-xs font-medium text-slate-700 group-hover:text-brand-red transition-colors line-clamp-2">
                            {sc.name}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
