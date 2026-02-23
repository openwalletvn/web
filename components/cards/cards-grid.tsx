'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Bank, Card, CardType, CardNetwork, CardSort } from '@/lib/api';
import { CardsFilter } from './cards-filter';
import { CardItem } from '@/app/(marketing)/_components/card-item';

interface Props {
  cards: Card[];
  banks: Bank[];
  enabledFilters?: Array<'type' | 'network' | 'bank' | 'sort'>;
  title?: string;
  limit?: number;
  showViewAll?: boolean;
  noCardsLabel?: string;
}

export function CardsGrid({
  cards,
  banks,
  enabledFilters = ['type', 'network', 'bank', 'sort'],
  title,
  limit,
  showViewAll,
  noCardsLabel,
}: Props) {
  const searchParams = useSearchParams();
  const t = useTranslations('CardsSection');

  const type = searchParams.get('type') as CardType | null;
  const network = searchParams.get('network') as CardNetwork | null;
  const bankId = searchParams.get('bank');
  const coBrand = searchParams.get('co_brand') === '1';
  const sort = searchParams.get('sort') as CardSort | null;

  // Check if any card in the full unfiltered set has co_brand
  const coBrandAvailable = useMemo(
    () => cards.some((c) => !!c.co_brand),
    [cards]
  );

  // Compute types and networks from all cards
  const types = useMemo(
    () => [...new Set(cards.flatMap((c) => c.card_type))] as CardType[],
    [cards]
  );
  const networks = useMemo(
    () => [...new Set(cards.map((c) => c.card_network))] as CardNetwork[],
    [cards]
  );

  // Apply filters
  const filtered = useMemo(() => {
    let result = cards;

    // Apply type/network/bank filters first
    if (type) result = result.filter((c) => c.card_type.includes(type));
    if (network) result = result.filter((c) => c.card_network === network);
    if (bankId) result = result.filter((c) => c.bank_id === bankId);

    // Check if co-brand should be disabled (no co-branded cards in current filtered results)
    const coBrandDisabled = !result.some((c) => !!c.co_brand);

    // Apply co-brand filter if enabled
    if (coBrand) result = result.filter((c) => !!c.co_brand);

    // Apply sort
    if (sort === 'fee_asc') {
      result = [...result].sort((a, b) => (a.annual_fee ?? 0) - (b.annual_fee ?? 0));
    } else if (sort === 'fee_desc') {
      result = [...result].sort((a, b) => (b.annual_fee ?? 0) - (a.annual_fee ?? 0));
    }

    return { cards: result, coBrandDisabled };
  }, [cards, type, network, bankId, coBrand, sort]);

  const displayed = limit ? filtered.cards.slice(0, limit) : filtered.cards;
  const heading = title !== undefined ? title : t('title');
  const emptyMessage = noCardsLabel ?? t('no_cards');

  return (
    <>
      {enabledFilters.length > 0 && (
        <div className="mb-8">
          <CardsFilter
            banks={banks}
            types={types}
            networks={networks}
            enabledFilters={enabledFilters}
            coBrandAvailable={coBrandAvailable}
            coBrandDisabled={filtered.coBrandDisabled}
          />
        </div>
      )}

      {heading && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">{heading}</h2>
          <div className="border-t border-dashed border-slate-300 mt-3" />
          {showViewAll && <p className="text-slate-500 mt-3">{t('description')}</p>}
        </div>
      )}

      {displayed.length === 0 ? (
        <p className="text-slate-500">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayed.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      )}

      {showViewAll && displayed.length > 0 && (
        <div className="mt-8">
          <Link
            href="/the"
            className="inline-block px-6 py-2.5 border border-dashed border-slate-300 rounded-sm font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors"
          >
            {t('view_all', { count: filtered.cards.length })}
          </Link>
        </div>
      )}
    </>
  );
}
