import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { CardsSection, CardsSectionSkeleton } from '../../../_components/cards-section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  const cardsPage = await getTranslations('CardsPage');
  return {
    title: `${cardsPage('type_co_branded')} | Open Wallet`,
    alternates: { canonical: '/cards/co-branded' },
  };
}

export default async function CoBrandedCardsPage() {
  const [cardsPage, breadcrumbs] = await Promise.all([
    getTranslations('CardsPage'),
    getTranslations('Breadcrumbs'),
  ]);

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: breadcrumbs('home'), href: '/' },
            { label: breadcrumbs('cards'), href: '/cards' },
            { label: cardsPage('type_co_branded') },
          ]}
        />
        <h1 className="text-4xl font-bold text-slate-900 mb-6">{cardsPage('type_co_branded')}</h1>
        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsSection filters={{ type: 'co-branded' }} title="" />
        </Suspense>
      </div>
    </div>
  );
}
