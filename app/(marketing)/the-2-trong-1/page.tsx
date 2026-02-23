import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SeoPages');
  return {
    title: t('2in1_cards_title'),
    description: t('2in1_cards_description'),
    openGraph: {
      title: t('2in1_cards_title'),
      description: t('2in1_cards_description'),
    },
    twitter: {
      title: t('2in1_cards_title'),
      description: t('2in1_cards_description'),
    },
  };
}

export default async function TwoInOneCardsPage() {
  const [allCards, banks, t, tb] = await Promise.all([
    getCards(),
    getBanks(),
    getTranslations('SeoPages'),
    getTranslations('Breadcrumbs'),
  ]);

  // Filter for 2-in-1 cards
  const filteredCards = allCards.filter((c) => c.card_type.includes('2in1'));

  return (
    <div className="px-4 py-12">
      <div className="max-w-container mx-auto">
        <Breadcrumbs items={[
          { label: tb('home'), href: '/' },
          { label: tb('cards'), href: '/the' },
          { label: t('2in1_cards') }
        ]} />

        <h1 className="text-4xl font-bold text-slate-900 mb-2">{t('2in1_cards')}</h1>
        <p className="text-slate-500 mb-8">{t('2in1_cards_subtitle')}</p>

        <CardsGrid
          cards={filteredCards}
          banks={banks}
          enabledFilters={['network', 'bank', 'sort']}
          noCardsLabel={t('no_cards')}
        />
      </div>
    </div>
  );
}
