import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SeoPages');
  return {
    title: t('credit_free_title'),
    description: t('credit_free_description'),
    openGraph: {
      title: t('credit_free_title'),
      description: t('credit_free_description'),
    },
    twitter: {
      title: t('credit_free_title'),
      description: t('credit_free_description'),
    },
  };
}

export default async function CreditFreePage() {
  const [allCards, banks, t, tb] = await Promise.all([
    getCards(),
    getBanks(),
    getTranslations('SeoPages'),
    getTranslations('Breadcrumbs'),
  ]);

  const filteredCards = allCards.filter((c) =>
    c.card_type.includes('credit') && c.annual_fee === 0
  );

  return (
    <div className="px-4 py-12">
      <div className="max-w-container mx-auto">
        <Breadcrumbs items={[
          { label: tb('home'), href: '/' },
          { label: tb('cards'), href: '/the' },
          { label: t('credit_free') }
        ]} />

        <h1 className="text-4xl font-bold text-slate-900 mb-2">{t('credit_free')}</h1>
        <p className="text-slate-500 mb-8">{t('credit_free_subtitle')}</p>

        <CardsGrid
          cards={filteredCards}
          banks={banks}
          hideTypeFilter
          hideFeeFilter
          noCardsLabel={t('no_cards')}
        />
      </div>
    </div>
  );
}
