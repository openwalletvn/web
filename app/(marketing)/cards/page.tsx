import Link from 'next/link';
import { Suspense } from 'react';
import { CardsFilter } from '../_components/cards-filter';
import { CardsSection, CardsSectionSkeleton } from '../_components/cards-section';
import type { CardType, CardNetwork } from '@/lib/api';

export const runtime = 'edge';

interface Props {
  searchParams: Promise<{ type?: string; network?: string }>;
}

export default async function CardsPage({ searchParams }: Props) {
  const { type, network } = await searchParams;

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">
            ← Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mt-4">Cards</h1>
        </div>

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
