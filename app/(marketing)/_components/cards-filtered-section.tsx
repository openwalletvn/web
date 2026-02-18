'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { Bank, Card, CardType, CardNetwork, CardSort } from '@/lib/api';
import { CardsFilter } from './cards-filter';
import { CardItem } from './card-item';

interface Props {
  allCards: Card[];
  banks: Bank[];
  noCardsLabel: string;
}

export function CardsFilteredSection({ allCards, banks, noCardsLabel }: Props) {
  const searchParams = useSearchParams();

  const type = searchParams.get('type') as CardType | null;
  const network = searchParams.get('network') as CardNetwork | null;
  const bankId = searchParams.get('bank');
  const coBrand = searchParams.get('co_brand') === '1';
  const sort = searchParams.get('sort') as CardSort | null;

  const types = useMemo(
    () => [...new Set(allCards.flatMap((c) => c.card_type))] as CardType[],
    [allCards],
  );
  const networks = useMemo(
    () => [...new Set(allCards.map((c) => c.card_network))] as CardNetwork[],
    [allCards],
  );

  const filtered = useMemo(() => {
    let cards = allCards;
    if (type) cards = cards.filter((c) => c.card_type.includes(type));
    if (network) cards = cards.filter((c) => c.card_network === network);
    if (bankId) cards = cards.filter((c) => c.bank_id === bankId);
    if (coBrand) cards = cards.filter((c) => !!c.co_brand);
    if (sort === 'fee_asc') cards = [...cards].sort((a, b) => (a.annual_fee ?? 0) - (b.annual_fee ?? 0));
    else if (sort === 'fee_desc') cards = [...cards].sort((a, b) => (b.annual_fee ?? 0) - (a.annual_fee ?? 0));
    return cards;
  }, [allCards, type, network, bankId, coBrand, sort]);

  return (
    <>
      <div className="mb-8">
        <CardsFilter banks={banks} types={types} networks={networks} />
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500">{noCardsLabel}</p>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
          {filtered.map((card) => (
            <div key={card.id} className="break-inside-avoid mb-4">
              <CardItem card={card} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
