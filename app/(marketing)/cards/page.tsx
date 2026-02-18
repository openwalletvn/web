import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getCards, getBanks } from '@/lib/api';
import { CardsFilteredSection } from '../_components/cards-filtered-section';
import { CardsSectionSkeleton } from '../_components/cards-section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('CardsPage');
  return {
    title: `${t('title')} | Open Wallet`,
    description: `Khám phá thẻ ngân hàng Việt Nam trên Open Wallet.`,
  };
}

export default async function CardsPage() {
  const [allCards, banks, t, tb] = await Promise.all([
    getCards(),
    getBanks(),
    getTranslations('CardsPage'),
    getTranslations('Breadcrumbs'),
  ]);

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: tb('home'), href: '/' }, { label: tb('cards') }]} />

        <h1 className="text-4xl font-bold text-slate-900 mb-6">{t('title')}</h1>

        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsFilteredSection
            allCards={allCards}
            banks={banks}
            noCardsLabel={t('no_cards')}
          />
        </Suspense>
      </div>
    </div>
  );
}
