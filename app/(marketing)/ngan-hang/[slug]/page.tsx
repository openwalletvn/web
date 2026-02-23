import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {Suspense} from 'react';
import {getTranslations} from 'next-intl/server';
import {getBank, getBankImageUrl, getBanks} from '@/lib/api';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {CardsSection, CardsSectionSkeleton} from '@/components/cards/cards-section';

export async function generateStaticParams() {
  const banks = await getBanks();
  return banks.map((bank) => ({ slug: bank.id }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const bank = await getBank(slug);
    const description = `${bank.full_name} - thẻ và thông tin chi tiết trên Open Wallet.`;
    return {
      title: `${bank.name} | Open Wallet`,
      description,
      openGraph: {
          title: `${bank.name} | Open Wallet`,
        description,
      },
      twitter: {
          title: `${bank.name} | Open Wallet`,
        description,
      },
    };
  } catch {
    const t = await getTranslations('BankDetail');
    return { title: `${t('not_found')} | Open Wallet` };
  }
}

export default async function BankPage({ params }: Props) {
  const { slug } = await params;
  const [t, tb] = await Promise.all([
    getTranslations('BankDetail'),
    getTranslations('Breadcrumbs'),
  ]);

  let bank;
  try {
    bank = await getBank(slug);
  } catch {
    return (
      <div className="flex items-center justify-center py-32 px-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-slate-900 mb-4">{t('not_found')}</p>
          <Link href="/ngan-hang" className="text-brand-red hover:underline">{t('back')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-12">
      <div className="max-w-container mx-auto">
        <Breadcrumbs
          items={[
            { label: tb('home'), href: '/' },
            { label: tb('banks'), href: '/ngan-hang' },
            { label: bank.name },
          ]}
        />

        <div className="flex items-start gap-6 mb-12">
          <div className="relative w-28 h-28 shrink-0">
            <Image src={getBankImageUrl(bank.logo_url)} alt="" fill className="object-contain" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">{bank.name}</h1>
              {bank.brand_color && (
                <div
                  className="w-5 h-5 rounded-full shrink-0 border border-slate-300"
                  style={{ backgroundColor: bank.brand_color }}
                  title={bank.brand_color}
                />
              )}
            </div>
            <p className="text-slate-500 mt-1">{bank.full_name}</p>
            {bank.link && (
              <a
                href={bank.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-brand-red hover:underline text-base"
              >
                {bank.link} ↗
              </a>
            )}
          </div>
        </div>

        <hr className="border-slate-200 mb-2" />

        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsSection filters={{ bank_id: bank.id }} title={t('cards_title')} />
        </Suspense>
      </div>
    </div>
  );
}
