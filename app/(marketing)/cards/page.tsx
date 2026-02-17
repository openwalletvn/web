import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CardsFilter } from '../_components/cards-filter';
import { CardsSection, CardsSectionSkeleton } from '../_components/cards-section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { getBanks } from '@/lib/api';
import type { CardType, CardNetwork, CardSort } from '@/lib/api';

export const runtime = 'edge';

interface Props {
  searchParams: Promise<{ type?: string; network?: string; bank?: string; co_brand?: string; sort?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { type, network } = await searchParams;
  const label = type
    ? `${type.charAt(0).toUpperCase() + type.slice(1)} Cards`
    : network
      ? `${network.charAt(0).toUpperCase() + network.slice(1)} Cards`
      : 'Cards';
  return {
    title: `${label} | Open Wallet`,
    description: `Browse ${label.toLowerCase()} on Open Wallet Vietnam.`,
  };
}

export default async function CardsPage({ searchParams }: Props) {
  const { type, network, bank: bankId, co_brand, sort } = await searchParams;

  const banks = await getBanks();

  const selectedBank = bankId ? banks.find((b) => b.id === bankId) : undefined;

  const pageTitle = type
    ? `${type.charAt(0).toUpperCase() + type.slice(1)} Cards`
    : network
      ? `${network.charAt(0).toUpperCase() + network.slice(1)} Cards`
      : selectedBank
        ? `${selectedBank.name} Cards`
        : co_brand === '1'
          ? 'Co-branded Cards'
          : 'Cards';

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cards' }]} />

        <h1 className="text-4xl font-bold text-slate-900 mb-6">{pageTitle}</h1>

        <div className="mb-8">
          <Suspense>
            <CardsFilter banks={banks} />
          </Suspense>
        </div>

        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsSection
            filters={{
              type: type as CardType | undefined,
              network: network as CardNetwork | undefined,
              bank_id: bankId,
              co_brand: co_brand === '1',
              sort: sort as CardSort | undefined,
            }}
            title=""
          />
        </Suspense>
      </div>
    </div>
  );
}
