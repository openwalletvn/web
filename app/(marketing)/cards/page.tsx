import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { CardsFilter } from '../_components/cards-filter';
import { CardsSection, CardsSectionSkeleton } from '../_components/cards-section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import type { CardType, CardNetwork } from '@/lib/api';

export const runtime = 'edge';

interface Props {
  searchParams: Promise<{ type?: string; network?: string }>;
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
  const { type, network } = await searchParams;

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cards' }]} />

        <h1 className="text-4xl font-bold text-slate-900 mb-6">Cards</h1>

        <div className="mb-6">
          <Suspense>
            <CardsFilter />
          </Suspense>
        </div>

        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsSection
            filters={{
              type: type as CardType | undefined,
              network: network as CardNetwork | undefined,
            }}
            title=""
          />
        </Suspense>
      </div>
    </div>
  );
}
