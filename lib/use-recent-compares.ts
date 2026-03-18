'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'compare_recent';
const MAX_ENTRIES = 10;
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface RecentEntry {
    pair: string;
    visitedAt: number;
}

function readStorage(): RecentEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const entries = JSON.parse(raw) as RecentEntry[];
        const cutoff = Date.now() - TTL_MS;
        return entries.filter((e) => e.visitedAt > cutoff);
    } catch {
        return [];
    }
}

function writeStorage(entries: RecentEntry[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {}
}

interface UseRecentComparesReturn {
    recentCompares: RecentEntry[];
    addCompare: (pair: string) => void;
    removeCompare: (pair: string) => void;
}

export function useRecentCompares(): UseRecentComparesReturn {
    const [recentCompares, setRecentCompares] = useState<RecentEntry[]>([]);

    useEffect(() => {
        setRecentCompares(readStorage());
    }, []);

    const addCompare = useCallback((pair: string) => {
        const updated = [
            { pair, visitedAt: Date.now() },
            ...readStorage().filter((e) => e.pair !== pair),
        ].slice(0, MAX_ENTRIES);
        writeStorage(updated);
        setRecentCompares(updated);
    }, []);

    const removeCompare = useCallback((pair: string) => {
        const updated = readStorage().filter((e) => e.pair !== pair);
        writeStorage(updated);
        setRecentCompares(updated);
    }, []);

    return { recentCompares, addCompare, removeCompare };
}
