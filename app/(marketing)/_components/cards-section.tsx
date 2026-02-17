import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getCards, getCardImageUrl, type CardFilters } from '@/lib/api';

interface Props {
  filters?: CardFilters;
  title?: string;
  limit?: number;
  showViewAll?: boolean;
  description?: string;
}

export async function CardsSection({ filters, title = 'Cards', limit, showViewAll, description }: Props) {
  const cards = await getCards(filters);
  const displayed = limit ? cards.slice(0, limit) : cards;

  if (cards.length === 0) {
    return (
      <section className="py-12 px-4 max-w-6xl mx-auto w-full">
        {title && <h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>}
        <p className="text-slate-500">No cards found.</p>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto w-full">
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold text-slate-900">{title}</h2>}
          {description && (
            <p className="text-slate-500 mt-1 text-sm">{description}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayed.map((card) => {
          const isVertical = card.image_orientation === 'vertical';
          return (
            <Link
              key={card.id}
              href={`/cards/${card.id}`}
              className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className={`relative w-full ${isVertical ? 'aspect-[2/3]' : 'aspect-[16/10]'} bg-white rounded overflow-hidden`}>
                <Image
                  src={getCardImageUrl(card)}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 leading-tight">{card.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs capitalize bg-brand-blue/10 text-brand-blue border-transparent">{card.card_network}</Badge>
                  {card.card_type.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs capitalize">{t}</Badge>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {showViewAll && (
        <div className="mt-8 text-center">
          <Link
            href="/cards"
            className="inline-block px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            View all {cards.length} cards →
          </Link>
        </div>
      )}
    </section>
  );
}

export function CardsSectionSkeleton() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-slate-200 rounded animate-pulse mt-2" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="w-full aspect-[16/10] bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}
