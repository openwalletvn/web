import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getCards, getCardImageUrl, type CardFilters } from '@/lib/api';

interface Props {
  filters?: CardFilters;
  title?: string;
}

export async function CardsSection({ filters, title = 'Cards' }: Props) {
  const cards = await getCards(filters);

  if (cards.length === 0) {
    return (
      <section className="py-12 px-4 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>
        <p className="text-slate-500">No cards found.</p>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const isVertical = card.image_orientation === 'vertical';
          return (
            <Link
              key={card.id}
              href={`/cards/${card.id}`}
              className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className={`relative w-full ${isVertical ? 'aspect-[2/3]' : 'aspect-[16/10]'}`}>
                <Image
                  src={getCardImageUrl(card)}
                  alt={card.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 leading-tight">{card.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs capitalize">{card.card_network}</Badge>
                  {card.card_type.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs capitalize">{t}</Badge>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function CardsSectionSkeleton() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto w-full">
      <div className="h-8 w-24 bg-slate-200 rounded mb-6 animate-pulse" />
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
