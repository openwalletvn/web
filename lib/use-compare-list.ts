'use client';

import {useCallback} from 'react';
import {useSyncExternalStore} from 'react';
import {toast} from 'sonner';

const STORAGE_KEY = 'compare_list';
const META_STORAGE_KEY = 'compare_list_meta';
const MAX_IDS = 3;

export interface CardCompareMeta {
    name: string;
    image_url: string | null;
}

type Listener = () => void;
const listeners = new Set<Listener>();
let cache: string[] | null = null;

const metaListeners = new Set<Listener>();
let metaCache: Record<string, CardCompareMeta> | null = null;

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

function readMetaStorage(): Record<string, CardCompareMeta> {
    try {
        const raw = localStorage.getItem(META_STORAGE_KEY);
        if (!raw) return {};
        const data = JSON.parse(raw);
        return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch {
        return {};
    }
}

function writeMetaStorage(meta: Record<string, CardCompareMeta>): void {
    try {
        localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
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

function getMetaSnapshot(): Record<string, CardCompareMeta> {
    if (metaCache === null) metaCache = readMetaStorage();
    return metaCache;
}

const EMPTY_META: Record<string, CardCompareMeta> = {};
function getServerMetaSnapshot(): Record<string, CardCompareMeta> {
    return EMPTY_META;
}

function notify(updated: string[]): void {
    cache = updated;
    for (const l of listeners) l();
}

function notifyMeta(updated: Record<string, CardCompareMeta>): void {
    metaCache = updated;
    for (const l of metaListeners) l();
}

function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function subscribeMeta(listener: Listener): () => void {
    metaListeners.add(listener);
    return () => metaListeners.delete(listener);
}

interface UseCompareListReturn {
    compareList: string[];
    compareListMeta: Record<string, CardCompareMeta>;
    addToCompare: (id: string, meta?: CardCompareMeta) => void;
    removeFromCompare: (id: string) => void;
    toggleCompare: (id: string, meta?: CardCompareMeta) => void;
    clearCompare: () => void;
    isInCompare: (id: string) => boolean;
    isFull: boolean;
}

export function useCompareList(): UseCompareListReturn {
    const compareList = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const compareListMeta = useSyncExternalStore(subscribeMeta, getMetaSnapshot, getServerMetaSnapshot);

    const addToCompare = useCallback((id: string, meta?: CardCompareMeta) => {
        const current = readStorage();
        if (current.includes(id) || current.length >= MAX_IDS) return;
        const updated = [...current, id];
        writeStorage(updated);
        notify(updated);
        if (meta) {
            const currentMeta = readMetaStorage();
            const updatedMeta = {...currentMeta, [id]: meta};
            writeMetaStorage(updatedMeta);
            notifyMeta(updatedMeta);
            toast.success(`Đã thêm ${meta.name} vào so sánh`);
        }
    }, []);

    const removeFromCompare = useCallback((id: string) => {
        const updated = readStorage().filter(i => i !== id);
        writeStorage(updated);
        notify(updated);
        const currentMeta = readMetaStorage();
        if (currentMeta[id]) {
            const {[id]: _, ...rest} = currentMeta;
            writeMetaStorage(rest);
            notifyMeta(rest);
        }
    }, []);

    const toggleCompare = useCallback((id: string, meta?: CardCompareMeta) => {
        const current = readStorage();
        if (current.includes(id)) {
            const updated = current.filter(i => i !== id);
            writeStorage(updated);
            notify(updated);
            const currentMeta = readMetaStorage();
            if (currentMeta[id]) {
                const {[id]: _, ...rest} = currentMeta;
                writeMetaStorage(rest);
                notifyMeta(rest);
            }
        } else if (current.length < MAX_IDS) {
            const updated = [...current, id];
            writeStorage(updated);
            notify(updated);
            if (meta) {
                const currentMeta = readMetaStorage();
                const updatedMeta = {...currentMeta, [id]: meta};
                writeMetaStorage(updatedMeta);
                notifyMeta(updatedMeta);
                toast.success(`Đã thêm ${meta.name} vào so sánh`);
            }
        }
    }, []);

    const clearCompare = useCallback(() => {
        writeStorage([]);
        notify([]);
        writeMetaStorage({});
        notifyMeta({});
    }, []);

    const isInCompare = useCallback((id: string) => compareList.includes(id), [compareList]);

    return {
        compareList,
        compareListMeta,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        isFull: compareList.length >= MAX_IDS,
    };
}
