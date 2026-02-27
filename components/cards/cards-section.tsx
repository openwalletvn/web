import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getCards, type CardFilters } from '@/lib/api';
import { CardItem } from '@/app/(marketing)/_components/card-item';

interface Props {
  filters?: CardFilters;
  title?: string;
  limit?: number;
  showViewAll?: boolean;
}

export async function CardsSection({ filters, title, limit, showViewAll }: Props) {
  const [t, allCards] = await Promise.all([getTranslations('CardsSection'), getCards(filters)]);

  let cards = allCards;

  if (typeof filters?.co_brand === 'string') {
    cards = cards.filter((c) => c.co_brand === filters.co_brand);
  } else if (filters?.co_brand === true) {
    cards = cards.filter((c) => !!c.co_brand);
  }
  if (filters?.sort === 'fee_asc') {
    cards = [...cards].sort((a, b) => (a.annual_fee ?? 0) - (b.annual_fee ?? 0));
  } else if (filters?.sort === 'fee_desc') {
    cards = [...cards].sort((a, b) => (b.annual_fee ?? 0) - (a.annual_fee ?? 0));
  }

  const displayed = limit ? cards.slice(0, limit) : cards;
  const heading = title !== undefined ? title : t('title');

  if (displayed.length === 0) {
    return (
      <section className="py-12 px-4 max-w-container mx-auto w-full">
        {heading && <h2 className="text-3xl font-bold text-slate-900 mb-4">{heading}</h2>}
        <p className="text-slate-500">{t('no_cards')}</p>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 max-w-container mx-auto w-full">
      {heading && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">{heading}</h2>
          <div className="border-t border-dashed border-slate-300 mt-3" />
          {showViewAll && <p className="text-slate-500 mt-3">{t('description')}</p>}
        </div>
      )}

      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
        {displayed.map((card) => (
          <div key={card.id} className="break-inside-avoid mb-4">
            <CardItem card={card} />
          </div>
        ))}
      </div>

      {showViewAll && (
        <div className="mt-8">
          <Link
            href="/the"
            className="inline-block px-6 py-2.5 border border-dashed border-slate-300 rounded-sm font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors"
          >
            {t('view_all', { count: cards.length })}
          </Link>
        </div>
      )}
    </section>
  );
}

export function CardsSectionSkeleton() {
  return (
    <section className="py-12 px-4 max-w-container mx-auto w-full">
      <div className="mb-8">
        <div className="h-9 w-24 bg-slate-200 rounded animate-pulse" />
        <div className="border-t border-dashed border-slate-200 mt-3" />
        <div className="h-4 w-72 bg-slate-200 rounded animate-pulse mt-3" />
      </div>
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4 flex flex-col gap-2 p-3 border border-dashed border-slate-200 rounded-sm">
            <div className={`w-full ${i % 3 === 0 ? 'aspect-[2/3]' : 'aspect-[16/10]'} bg-slate-200 animate-pulse`} />
            <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}
