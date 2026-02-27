'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Bank, Card, CardType, CardSort } from '@/lib/api';
import { CardsFilter } from './cards-filter';
import { CardItem } from '@/app/(marketing)/_components/card-item';

interface Props {
  cards: Card[];
  banks: Bank[];
  enabledFilters?: Array<'type' | 'network' | 'bank' | 'sort' | 'wallet' | 'fee' | 'co_brand'>;
  title?: string;
  limit?: number;
  showViewAll?: boolean;
  noCardsLabel?: string;
}

function CardsGridInner({
  cards,
  banks,
  enabledFilters = ['type', 'network', 'bank', 'sort', 'co_brand'],
  title,
  limit,
  showViewAll,
  noCardsLabel,
}: Props) {
  const searchParams = useSearchParams();
  const t = useTranslations('CardsSection');

  const type = searchParams.get('type') as CardType | null;
  const network = searchParams.get('network');
  const bankId = searchParams.get('bank');
  const coBrand = searchParams.get('co_brand');
  const sort = searchParams.get('sort') as CardSort | null;
  const wallet = searchParams.get('wallet');
  const fee = searchParams.get('fee');

  // ── Auto-hide flags ────────────────────────────────────────────────────────

  const availableTypes = useMemo(
    () => [...new Set(cards.flatMap((c) => c.card_type))] as CardType[],
    [cards]
  );
  const typeFilterUseful = availableTypes.length > 1;

  const availableNetworks = useMemo(() => {
    const map = new Map<string, { id: string; name: string; logo_url: string }>();
    cards.forEach((c) => {
      if (c.card_network_data) {
        map.set(c.card_network, c.card_network_data);
      } else {
        map.set(c.card_network, { id: c.card_network, name: c.card_network, logo_url: '' });
      }
    });
    return [...map.values()];
  }, [cards]);
  const networkFilterUseful = availableNetworks.length > 1;

  const availableBankIds = useMemo(
    () => [...new Set(cards.map((c) => c.bank_id))],
    [cards]
  );
  const bankFilterUseful = availableBankIds.length > 1;

  const availableBrands = useMemo(() => {
    const map = new Map<string, { id: string; name: string; logo_url: string }>();
    cards.forEach((c) => {
      if (c.co_brand && c.co_brand_data) map.set(c.co_brand, c.co_brand_data);
    });
    return [...map.values()];
  }, [cards]);
  const coBrandFilterUseful = availableBrands.length >= 1;

  const availableWallets = useMemo(() => {
    const map = new Map<string, { id: string; name: string; logo_url: string }>();
    cards.forEach((c) => {
      c.contactless_methods_data?.forEach((w) => map.set(w.id, w));
    });
    return [...map.values()];
  }, [cards]);
  const walletFilterUseful = availableWallets.length > 1;

  const hasFreeCards = useMemo(() => cards.some((c) => c.annual_fee === 0), [cards]);
  const hasPaidCards = useMemo(
    () => cards.some((c) => c.annual_fee != null && c.annual_fee > 0),
    [cards]
  );
  const feeFilterUseful = hasFreeCards && hasPaidCards;

  const sortFilterUseful = useMemo(
    () => cards.filter((c) => c.annual_fee != null).length > 1,
    [cards]
  );

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredCards = useMemo(() => {
    let result = cards;

    if (type) result = result.filter((c) => c.card_type.includes(type));
    if (network) result = result.filter((c) => c.card_network === network);
    if (bankId) result = result.filter((c) => c.bank_id === bankId);
    if (coBrand) result = result.filter((c) => c.co_brand === coBrand);
    if (wallet) result = result.filter((c) => c.contactless_methods?.includes(wallet));
    if (fee === 'free') result = result.filter((c) => c.annual_fee === 0);
    if (fee === 'paid') result = result.filter((c) => c.annual_fee != null && c.annual_fee > 0);

    if (sort === 'fee_asc') {
      result = [...result].sort((a, b) => (a.annual_fee ?? 0) - (b.annual_fee ?? 0));
    } else if (sort === 'fee_desc') {
      result = [...result].sort((a, b) => (b.annual_fee ?? 0) - (a.annual_fee ?? 0));
    }

    return result;
  }, [cards, type, network, bankId, coBrand, wallet, fee, sort]);

  const displayed = limit ? filteredCards.slice(0, limit) : filteredCards;
  const heading = title !== undefined ? title : t('title');
  const emptyMessage = noCardsLabel ?? t('no_cards');

  return (
    <>
      {enabledFilters.length > 0 && (
        <div className="mb-8">
          <CardsFilter
            banks={banks}
            enabledFilters={enabledFilters}
            typeFilterUseful={typeFilterUseful}
            networkFilterUseful={networkFilterUseful}
            bankFilterUseful={bankFilterUseful}
            walletFilterUseful={walletFilterUseful}
            feeFilterUseful={feeFilterUseful}
            sortFilterUseful={sortFilterUseful}
            coBrandFilterUseful={coBrandFilterUseful}
            availableNetworks={availableNetworks}
            availableBrands={availableBrands}
            availableWallets={availableWallets}
            wallet={wallet}
            fee={fee}
            coBrand={coBrand}
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
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 sm:gap-6 gap-4">
          {displayed.map((card) => (
            <div key={card.id} className="break-inside-avoid mb-8">
              <CardItem card={card} />
            </div>
          ))}
        </div>
      )}

      {showViewAll && displayed.length > 0 && (
        <div className="mt-8">
          <Link
            href="/the"
            className="inline-block px-6 py-2.5 border border-dashed border-slate-300 rounded-sm font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors"
          >
            {t('view_all', { count: filteredCards.length })}
          </Link>
        </div>
      )}
    </>
  );
}

export function CardsGrid(props: Props) {
  return (
    <Suspense>
      <CardsGridInner {...props} />
    </Suspense>
  );
}
