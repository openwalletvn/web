import type { ReactNode } from 'react';
import { CommandGroup } from '@/components/ui/command';
import { SearchResultItem } from './search-result-item';
import type { SearchCard, SearchBank, SearchPost } from '@/lib/search-types';

function highlightQuery(text: string, query: string): ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-brand-red/10 text-brand-red rounded-[2px] font-medium"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

interface SearchResultsProps {
  cards: SearchCard[];
  banks: SearchBank[];
  posts: SearchPost[];
  query: string;
  onSelect: (url: string) => void;
}

export function SearchResults({ cards, banks, posts, query, onSelect }: SearchResultsProps) {
  return (
    <>
      {cards.length > 0 && (
        <CommandGroup heading="Thẻ">
          {cards.map((card) => (
            <SearchResultItem
              key={card.id}
              value={`card-${card.id}`}
              title={highlightQuery(card.name, query)}
              subtitle={`${card.bank_name} · ${card.card_network.toUpperCase()}`}
              imageUrl={card.image_url}
              imageAlt={card.name}
              isSquare={false}
              url={card.url}
              onSelect={onSelect}
            />
          ))}
        </CommandGroup>
      )}

      {banks.length > 0 && (
        <CommandGroup heading="Ngân hàng">
          {banks.map((bank) => (
            <SearchResultItem
              key={bank.id}
              value={`bank-${bank.id}`}
              title={highlightQuery(bank.name, query)}
              subtitle={bank.full_name}
              imageUrl={bank.logo_url}
              imageAlt={bank.name}
              isSquare
              url={bank.url}
              onSelect={onSelect}
            />
          ))}
        </CommandGroup>
      )}

      {posts.length > 0 && (
        <CommandGroup heading="Bài viết">
          {posts.map((post) => (
            <SearchResultItem
              key={post.slug}
              value={`post-${post.slug}`}
              title={highlightQuery(post.title, query)}
              subtitle={post.category}
              url={post.url}
              onSelect={onSelect}
            />
          ))}
        </CommandGroup>
      )}
    </>
  );
}
