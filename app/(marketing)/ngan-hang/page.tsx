import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getBanks} from '@/lib/api';
import {BankItem} from '../_components/bank-item';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('BanksPage');
  return {
    title: t('meta_title'),
    description: t('meta_description'),
      openGraph: {
          title: t('meta_title'),
          description: t('meta_description'),
      },
      twitter: {
          title: t('meta_title'),
          description: t('meta_description'),
      },
  };
}

export default async function BanksPage() {
  const [banks, t, tb] = await Promise.all([
    getBanks(),
    getTranslations('BanksPage'),
    getTranslations('Breadcrumbs'),
  ]);

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: tb('home'), href: '/' }, { label: t('title') }]} />

        <h1 className="text-4xl font-bold text-slate-900 mb-1">{t('title')}</h1>
        <p className="text-slate-500 mb-8">{t('count', { count: banks.length })}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {banks.map((bank) => (
            <BankItem key={bank.id} bank={bank} />
          ))}
        </div>
      </div>
    </div>
  );
}
