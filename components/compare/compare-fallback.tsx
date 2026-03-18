'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getCard } from '@/lib/api';
import type { Card } from '@/lib/api';
import { CompareTemplate } from './compare-template';

interface Props {
    pair: string;
}

export function CompareFallback({ pair }: Props) {
    const t = useTranslations('ComparePage');
    const [cardA, setCardA] = useState<Card | null>(null);
    const [cardB, setCardB] = useState<Card | null>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const vsIndex = pair.indexOf('-vs-');
        if (vsIndex === -1) {
            setError(true);
            setLoading(false);
            return;
        }
        const idA = pair.slice(0, vsIndex);
        const idB = pair.slice(vsIndex + 4);

        Promise.all([getCard(idA), getCard(idB)])
            .then(([a, b]) => {
                setCardA(a);
                setCardB(b);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [pair]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <p className="text-slate-500">{t('loading')}</p>
            </div>
        );
    }

    if (error || !cardA || !cardB) {
        return (
            <div className="flex items-center justify-center py-32 px-4">
                <p className="text-slate-500">{t('not_found')}</p>
            </div>
        );
    }

    return (
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <CompareTemplate cardA={cardA} cardB={cardB} />
            </div>
        </div>
    );
}
