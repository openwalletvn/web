import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { createTypeMetadata } from '../_helpers';
import { CardsSection, CardsSectionSkeleton } from '../../../_components/cards-section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';


export async function generateMetadata(): Promise<Metadata> {
  return createTypeMetadata('network_amex', '/cards/amex');
}

export default async function AmexCardsPage() {
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
            { label: cardsPage('network_amex') },
          ]}
        />
        <h1 className="text-4xl font-bold text-slate-900 mb-6">{cardsPage('network_amex')}</h1>
        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsSection filters={{ network: 'amex' }} title="" />
        </Suspense>
      </div>
    </div>
  );
}
