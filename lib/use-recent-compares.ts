'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'compare_recent';
const MAX_ENTRIES = 10;
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface RecentEntry {
    pair: string;
    visitedAt: number;
}

// Canonical form: sorted IDs joined with comma, handles both "a,b" and "a-vs-b" formats
export function normalizePair(pair: string): string {
    const ids = pair.includes(',') ? pair.split(',') : pair.split('-vs-');
    return ids.filter(Boolean).sort().join(',');
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
        const key = normalizePair(pair);
        const existing = readStorage().find((e) => normalizePair(e.pair) === key);
        // Always prefer the SEO slug format (a-vs-b) over ?compare format
        const preferred = pair.includes('-vs-') ? pair : (existing?.pair.includes('-vs-') ? existing.pair : pair);
        const updated = [
            { pair: preferred, visitedAt: Date.now() },
            ...readStorage().filter((e) => normalizePair(e.pair) !== key),
        ].slice(0, MAX_ENTRIES);
        writeStorage(updated);
        setRecentCompares(updated);
    }, []);

    const removeCompare = useCallback((pair: string) => {
        const key = normalizePair(pair);
        const updated = readStorage().filter((e) => normalizePair(e.pair) !== key);
        writeStorage(updated);
        setRecentCompares(updated);
    }, []);

    return { recentCompares, addCompare, removeCompare };
}
