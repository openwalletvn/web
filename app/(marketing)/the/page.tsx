import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('CardsPage');
    return {
        title: t('meta_title'),
        description: t('meta_description', {card: t('title')}),
        openGraph: {
            title: t('meta_title'),
            description: t('meta_description', {card: t('title')}),
        },
        twitter: {
            title: t('meta_title'),
            description: t('meta_description', {card: t('title')}),
        },
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
      <div className="max-w-container mx-auto">
        <Breadcrumbs items={[{ label: tb('home'), href: '/' }, { label: tb('cards') }]} />

        <h1 className="text-4xl font-bold text-slate-900 mb-6">{t('title')}</h1>

        <CardsGrid
          cards={allCards}
          banks={banks}
          noCardsLabel={t('no_cards')}
        />
      </div>
    </div>
  );
}
