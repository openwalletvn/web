'use client';

import { useState, useCallback } from 'react';

const KEY = 'openwallet_recent_searches';
const MAX = 5;

function readStorage(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function useRecentSearches(): {
  recentSearches: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearSearches: () => void;
} {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => readStorage());

  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const deduped = [trimmed, ...prev.filter((q) => q !== trimmed)].slice(0, MAX);
      writeStorage(deduped);
      return deduped;
    });
  }, []);

  const removeSearch = useCallback((query: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((q) => q !== query);
      writeStorage(next);
      return next;
    });
  }, []);

  const clearSearches = useCallback(() => {
    writeStorage([]);
    setRecentSearches([]);
  }, []);

  return { recentSearches, addSearch, removeSearch, clearSearches };
}
