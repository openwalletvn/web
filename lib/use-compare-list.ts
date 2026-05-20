'use client';

import {useCallback} from 'react';
import {useSyncExternalStore} from 'react';

const STORAGE_KEY = 'compare_list';
const MAX_IDS = 3;

type Listener = () => void;
const listeners = new Set<Listener>();
let cache: string[] | null = null;

function readStorage(): string[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Array.isArray(data) ? (data as string[]).slice(0, MAX_IDS) : [];
    } catch {
        return [];
    }
}

function writeStorage(ids: string[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
}

function getSnapshot(): string[] {
    if (cache === null) cache = readStorage();
    return cache;
}

const EMPTY: string[] = [];
function getServerSnapshot(): string[] {
    return EMPTY;
}

function notify(updated: string[]): void {
    cache = updated;
    for (const l of listeners) l();
}

function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

interface UseCompareListReturn {
    compareList: string[];
    addToCompare: (id: string) => void;
    removeFromCompare: (id: string) => void;
    toggleCompare: (id: string) => void;
    clearCompare: () => void;
    isInCompare: (id: string) => boolean;
    isFull: boolean;
}

export function useCompareList(): UseCompareListReturn {
    const compareList = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const addToCompare = useCallback((id: string) => {
        const current = readStorage();
        if (current.includes(id) || current.length >= MAX_IDS) return;
        const updated = [...current, id];
        writeStorage(updated);
        notify(updated);
    }, []);

    const removeFromCompare = useCallback((id: string) => {
        const updated = readStorage().filter(i => i !== id);
        writeStorage(updated);
        notify(updated);
    }, []);

    const toggleCompare = useCallback((id: string) => {
        const current = readStorage();
        if (current.includes(id)) {
            const updated = current.filter(i => i !== id);
            writeStorage(updated);
            notify(updated);
        } else if (current.length < MAX_IDS) {
            const updated = [...current, id];
            writeStorage(updated);
            notify(updated);
        }
    }, []);

    const clearCompare = useCallback(() => {
        writeStorage([]);
        notify([]);
    }, []);

    const isInCompare = useCallback((id: string) => compareList.includes(id), [compareList]);

    return {
        compareList,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        isFull: compareList.length >= MAX_IDS,
    };
}
