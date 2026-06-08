'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import {
  CommandDialog,
  CommandList,
} from '@/components/ui/command';
import { useSearch } from '@/lib/use-search';
import { useRecentSearches } from '@/lib/use-recent-searches';
import { SearchTrigger } from './search-trigger';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';
import { SearchEmptyState } from './search-empty-state';
import { SearchLoading, SearchError, SearchNoResults } from './search-states';

// Prevent duplicate CMD+K listeners when multiple instances mount
const activeSearchInstances = new Set<symbol>();

interface SearchDialogProps {
  mobileOnly?: boolean;
}

export function SearchDialog({ mobileOnly = false }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { search, load, loading, error } = useSearch();
  const { recentSearches, addSearch, removeSearch } = useRecentSearches();
  const instanceId = useRef(Symbol('search-dialog'));

  const results = search(query);
  const hasResults =
    results.cards.length > 0 || results.banks.length > 0 || results.posts.length > 0;

  const handleOpen = useCallback(() => setOpen(true), []);

  const handleOpenChange = useCallback((value: boolean) => {
    setOpen(value);
    if (!value) setQuery('');
  }, []);

  const handleSelect = useCallback(
    (url: string) => {
      if (query.trim()) addSearch(query.trim());
      router.push(url);
      setOpen(false);
      setQuery('');
    },
    [query, addSearch, router],
  );

  const handleRecentSearch = useCallback((q: string) => {
    setQuery(q);
  }, []);

  // Lazily load the search index when the dialog first opens
  useEffect(() => {
    if (open) load();
  }, [open, load]);

  useEffect(() => {
    const id = instanceId.current;
    activeSearchInstances.add(id);

    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        // Only handle if this is the first registered instance
        if (activeSearchInstances.values().next().value !== id) return;
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      activeSearchInstances.delete(id);
    };
  }, []);

  return (
    <>
      {mobileOnly ? (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Tìm kiếm"
          className="flex items-center justify-center rounded-2xl p-2 text-slate-500 hover:bg-slate-100"
        >
          <IconSearch className="size-5" />
        </button>
      ) : (
        <SearchTrigger onClick={handleOpen} />
      )}

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Tìm kiếm"
        description="Tìm kiếm thẻ, ngân hàng, bài viết"
        showCloseButton={false}
      >
        <SearchInput query={query} onQueryChange={setQuery} />
        <CommandList>
          {!query && (
            <SearchEmptyState
              recentSearches={recentSearches}
              onSearch={handleRecentSearch}
              onRemoveRecent={removeSearch}
              onSelect={handleSelect}
            />
          )}
          {query && loading && <SearchLoading />}
          {query && error && <SearchError message={error} />}
          {query && !loading && !error && (hasResults ? (
            <SearchResults
              cards={results.cards}
              banks={results.banks}
              posts={results.posts}
              query={query}
              onSelect={handleSelect}
            />
          ) : (
            <SearchNoResults />
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
