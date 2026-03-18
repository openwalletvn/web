'use client';

import { useState, useCallback, useRef } from 'react';
import Fuse from 'fuse.js';
import type { SearchCard, SearchBank, SearchPost, SearchIndex } from './search-types';

// Module-level cache — shared across all hook instances
let cachedIndex: SearchIndex | null = null;
let fetchPromise: Promise<SearchIndex> | null = null;

export async function fetchIndex(): Promise<SearchIndex> {
  if (cachedIndex) return cachedIndex;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch('/search-index.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load search index');
      return res.json() as Promise<SearchIndex>;
    })
    .then((data) => {
      cachedIndex = data;
      fetchPromise = null;
      return data;
    })
    .catch((err) => {
      fetchPromise = null;
      throw err;
    });

  return fetchPromise;
}

interface SearchResults {
  cards: SearchCard[];
  banks: SearchBank[];
  posts: SearchPost[];
}

const EMPTY: SearchResults = { cards: [], banks: [], posts: [] };

interface UseSearchReturn {
  search: (query: string) => SearchResults;
  /** Call this when the dialog opens to lazily fetch and initialize the index. */
  load: () => void;
  loading: boolean;
  error: string | null;
}

export function useSearch(): UseSearchReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fuseCards = useRef<Fuse<SearchCard> | null>(null);
  const fuseBanks = useRef<Fuse<SearchBank> | null>(null);
  const fusePosts = useRef<Fuse<SearchPost> | null>(null);
  const initialized = useRef(false);
  const isLoading = useRef(false);

  const load = useCallback(() => {
    if (initialized.current || isLoading.current) return;
    isLoading.current = true;
    setLoading(true);
    setError(null);

    fetchIndex()
      .then((index) => {
        fuseCards.current = new Fuse(index.cards, {
          keys: [
            { name: 'name', weight: 0.6 },
            { name: 'bank_name', weight: 0.3 },
            { name: 'card_network', weight: 0.1 },
          ],
          threshold: 0.3,
          includeMatches: true,
        });
        fuseBanks.current = new Fuse(index.banks, {
          keys: [
            { name: 'name', weight: 0.5 },
            { name: 'full_name', weight: 0.4 },
            { name: 'id', weight: 0.1 },
          ],
          threshold: 0.3,
          includeMatches: true,
        });
        fusePosts.current = new Fuse(index.posts, {
          keys: [
            { name: 'title', weight: 0.6 },
            { name: 'description', weight: 0.3 },
            { name: 'category', weight: 0.1 },
          ],
          threshold: 0.4,
          includeMatches: true,
        });
        initialized.current = true;
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu tìm kiếm');
      })
      .finally(() => {
        isLoading.current = false;
        setLoading(false);
      });
  }, []);

  // Pure function — no side effects, safe to call during render
  const search = useCallback((query: string): SearchResults => {
    if (!query.trim() || !initialized.current) return EMPTY;

    const cards = fuseCards.current ? fuseCards.current.search(query).map((r) => r.item) : [];
    const banks = fuseBanks.current ? fuseBanks.current.search(query).map((r) => r.item) : [];
    const posts = fusePosts.current ? fusePosts.current.search(query).map((r) => r.item) : [];

    return { cards, banks, posts };
  }, []);

  return { search, load, loading, error };
}
