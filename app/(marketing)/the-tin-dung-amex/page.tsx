import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SeoPages');
  return {
    title: t('credit_amex_title'),
    description: t('credit_amex_description'),
    openGraph: {
      title: t('credit_amex_title'),
      description: t('credit_amex_description'),
    },
    twitter: {
      title: t('credit_amex_title'),
      description: t('credit_amex_description'),
    },
  };
}

export default async function CreditAmexPage() {
  const [cards, banks, t, tb] = await Promise.all([
    getCards({ type: 'credit', network: 'amex' }),
    getBanks(),
    getTranslations('SeoPages'),
    getTranslations('Breadcrumbs'),
  ]);

  return (
    <div className="px-4 py-12">
      <div className="max-w-container mx-auto">
        <Breadcrumbs items={[
          { label: tb('home'), href: '/' },
          { label: tb('cards'), href: '/the' },
          { label: t('credit_amex') }
        ]} />

        <h1 className="text-4xl font-bold text-slate-900 mb-2">{t('credit_amex')}</h1>
        <p className="text-slate-500 mb-8">{t('credit_amex_subtitle')}</p>

        <CardsGrid
          cards={cards}
          banks={banks}
          enabledFilters={['bank', 'sort']}
          noCardsLabel={t('no_cards')}
        />
      </div>
    </div>
  );
}
