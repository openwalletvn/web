import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { CardsSection, CardsSectionSkeleton } from '../../../_components/cards-section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';


export async function generateMetadata(): Promise<Metadata> {
  const cardsPage = await getTranslations('CardsPage');
  return {
    title: `${cardsPage('network_napas')} | Open Wallet`,
    alternates: { canonical: '/cards/napas' },
  };
}

export default async function NapasCardsPage() {
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
            { label: cardsPage('network_napas') },
          ]}
        />
        <h1 className="text-4xl font-bold text-slate-900 mb-6">{cardsPage('network_napas')}</h1>
        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsSection filters={{ network: 'napas' }} title="" />
        </Suspense>
      </div>
    </div>
  );
}
