import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { createTypeMetadata } from '../_helpers';
import { CardsSection, CardsSectionSkeleton } from '../../../_components/cards-section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';


export async function generateMetadata(): Promise<Metadata> {
  return createTypeMetadata('type_2in1', '/cards/2in1');
}

export default async function TwoInOneCardsPage() {
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
            { label: cardsPage('type_2in1') },
          ]}
        />
        <h1 className="text-4xl font-bold text-slate-900 mb-6">{cardsPage('type_2in1')}</h1>
        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsSection filters={{ type: '2in1' }} title="" />
        </Suspense>
      </div>
    </div>
  );
}
