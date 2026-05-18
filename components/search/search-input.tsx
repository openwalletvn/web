import { Command as CommandPrimitive } from 'cmdk';
import { IconSearch } from '@tabler/icons-react';

interface SearchInputProps {
  query: string;
  onQueryChange: (v: string) => void;
  placeholder?: string;
}

export function SearchInput({
  query,
  onQueryChange,
  placeholder = 'Tìm kiếm thẻ, ngân hàng, bài viết...',
}: SearchInputProps) {
  return (
    <div className="ow-search-input flex items-center gap-2 border-b px-3">
      <IconSearch className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        value={query}
        onValueChange={onQueryChange}
        placeholder={placeholder}
        className="placeholder:text-muted-foreground flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
