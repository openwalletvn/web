'use client';

import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const MAX_ENTRIES = 10;
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface RecentEntry {
    pair: string;
    visitedAt: number;
}

export function normalizePair(pair: string): string {
    const ids = pair.includes(',') ? pair.split(',') : pair.split('-vs-');
    return ids.filter(Boolean).sort().join(',');
}

interface RecentComparesState {
    recentCompares: RecentEntry[];
    addCompare: (pair: string) => void;
    removeCompare: (pair: string) => void;
}

export const useRecentCompares = create<RecentComparesState>()(
    persist(
        (set, get) => ({
            recentCompares: [],

            addCompare: (pair) => {
                const key = normalizePair(pair);
                const current = get().recentCompares.filter(e => Date.now() - e.visitedAt < TTL_MS);
                const existing = current.find(e => normalizePair(e.pair) === key);
                const preferred = pair.includes('-vs-') ? pair : (existing?.pair.includes('-vs-') ? existing.pair : pair);
                const updated = [
                    {pair: preferred, visitedAt: Date.now()},
                    ...current.filter(e => normalizePair(e.pair) !== key),
                ].slice(0, MAX_ENTRIES);
                set({recentCompares: updated});
            },

            removeCompare: (pair) => {
                const key = normalizePair(pair);
                set({recentCompares: get().recentCompares.filter(e => normalizePair(e.pair) !== key)});
            },
        }),
        {
            name: 'compare_recent',
            partialize: (s) => ({recentCompares: s.recentCompares}),
        }
    )
);
