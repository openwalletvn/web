import { CommandGroup, CommandItem } from '@/components/ui/command';
import { IconClock, IconX, IconArrowRight } from '@tabler/icons-react';
import { CARD_CATEGORIES } from '@/lib/card-categories';

const QUICK_LINKS = CARD_CATEGORIES.map((c) => ({ label: c.name, url: c.href }));

interface SearchEmptyStateProps {
  recentSearches: string[];
  onSearch: (query: string) => void;
  onRemoveRecent: (query: string) => void;
  onSelect: (url: string) => void;
}

export function SearchEmptyState({
  recentSearches,
  onSearch,
  onRemoveRecent,
  onSelect,
}: SearchEmptyStateProps) {
  return (
    <>
      {recentSearches.length > 0 && (
        <CommandGroup heading="Tìm kiếm gần đây">
          {recentSearches.map((query) => (
            <CommandItem
              key={query}
              value={`recent-${query}`}
              onSelect={() => onSearch(query)}
              className="cursor-pointer justify-between"
            >
              <div className="flex items-center gap-2">
                <IconClock className="size-4 text-slate-400" />
                <span>{query}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveRecent(query);
                }}
                className="rounded p-0.5 text-slate-400 hover:text-slate-600"
              >
                <IconX className="size-3.5" />
              </button>
            </CommandItem>
          ))}
        </CommandGroup>
      )}

      <CommandGroup heading="Khám phá">
        {QUICK_LINKS.map((link) => (
          <CommandItem
            key={link.url}
            value={`quick-${link.url}`}
            onSelect={() => onSelect(link.url)}
            className="cursor-pointer justify-between"
          >
            <span>{link.label}</span>
            <IconArrowRight className="size-4 text-slate-400" />
          </CommandItem>
        ))}
      </CommandGroup>
    </>
  );
}
