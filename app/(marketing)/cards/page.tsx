import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
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
  const t = await getTranslations('CardsPage');
  const label = type
    ? t(`type_${type}` as Parameters<typeof t>[0])
    : network
      ? t(`network_${network}` as Parameters<typeof t>[0])
      : t('title');
  return {
    title: `${label} | Open Wallet`,
    description: `Khám phá ${label.toLowerCase()} trên Open Wallet Vietnam.`,
  };
}

export default async function CardsPage({ searchParams }: Props) {
  const { type, network, bank: bankId, co_brand, sort } = await searchParams;

  const [banks, t, tb] = await Promise.all([
    getBanks(),
    getTranslations('CardsPage'),
    getTranslations('Breadcrumbs'),
  ]);

  const selectedBank = bankId ? banks.find((b) => b.id === bankId) : undefined;

  const pageTitle = type
    ? t(`type_${type}` as Parameters<typeof t>[0])
    : network
      ? t(`network_${network}` as Parameters<typeof t>[0])
      : selectedBank
        ? t('bank_cards', { bank: selectedBank.name })
        : co_brand === '1'
          ? t('cobranded')
          : t('title');

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: tb('home'), href: '/' }, { label: tb('cards') }]} />

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
