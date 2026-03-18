'use client';

import { useEffect } from 'react';
import { useRecentCompares } from '@/lib/use-recent-compares';

interface Props {
    pair: string;
}

export function RecordCompareVisit({ pair }: Props) {
    const { addCompare } = useRecentCompares();

    useEffect(() => {
        addCompare(pair);
    }, [pair, addCompare]);

    return null;
}
