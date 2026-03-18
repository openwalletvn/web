'use client';

import { useState, useCallback, useRef } from 'react';
import Fuse from 'fuse.js';
import type { SearchCard } from './search-types';
import { fetchIndex } from './use-search';

const EMPTY: SearchCard[] = [];

interface UseCardSearchReturn {
    search: (query: string) => SearchCard[];
    lookup: (id: string) => SearchCard | null;
    load: () => void;
    loading: boolean;
    initialized: boolean;
    error: string | null;
}

export function useCardSearch(): UseCardSearchReturn {
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fuse = useRef<Fuse<SearchCard> | null>(null);
    const cardsRef = useRef<SearchCard[]>([]);
    const initRef = useRef(false);
    const isLoading = useRef(false);

    const load = useCallback(() => {
        if (initRef.current || isLoading.current) return;
        isLoading.current = true;
        setLoading(true);
        setError(null);

        fetchIndex()
            .then((index) => {
                cardsRef.current = index.cards;
                fuse.current = new Fuse(index.cards, {
                    keys: [
                        { name: 'name', weight: 0.6 },
                        { name: 'bank_name', weight: 0.3 },
                        { name: 'card_network', weight: 0.1 },
                    ],
                    threshold: 0.3,
                    includeMatches: true,
                });
                initRef.current = true;
                setInitialized(true);
            })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu tìm kiếm');
            })
            .finally(() => {
                isLoading.current = false;
                setLoading(false);
            });
    }, []);

    const search = useCallback((query: string): SearchCard[] => {
        if (!query.trim() || !initRef.current || !fuse.current) return EMPTY;
        return fuse.current.search(query).map((r) => r.item);
    }, []);

    const lookup = useCallback((id: string): SearchCard | null => {
        return cardsRef.current.find((c) => c.id === id) ?? null;
    }, []);

    return { search, lookup, load, loading, initialized, error };
}
