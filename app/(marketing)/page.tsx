import Link from 'next/link';
import {Suspense} from 'react';
import {getTranslations} from 'next-intl/server';
import {getBanks, getCards} from '@/lib/api';
import {BanksSection, BanksSectionSkeleton} from './_components/banks-section';
import {CardsSection, CardsSectionSkeleton} from './_components/cards-section';

export default async function HomePage() {
    const [hero, heroTitle, metadata, organization, banks, cards] = await Promise.all([
    getTranslations('hero'),
    getTranslations('Hero'),
    getTranslations('metadata'),
    getTranslations('organization'),
        getBanks().catch(() => []),
        getCards().catch(() => []),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: metadata('siteName'),
        url: 'https://openwallet.vn',
        description: metadata('description'),
      },
      {
        '@type': 'Organization',
        name: metadata('siteName'),
        url: 'https://openwallet.vn',
        logo: 'https://openwallet.vn/logo.png',
        description: organization('description'),
      },
    ],
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="w-full min-h-[calc(100vh-4rem)] flex items-center px-4 py-20">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center">

          {/* Left - identity + type */}
          <div>
            <img
              src="/logo.png"
              alt="Open Wallet"
              className="h-16 w-16 mb-8"
            />

            <h1 className="text-7xl md:text-8xl font-bold text-slate-900 leading-none tracking-tight mb-6">
              {heroTitle('title')}
            </h1>

            <div className="border-t border-dashed border-slate-300 mb-6" />

            <p className="text-2xl font-medium text-slate-700 mb-2">
              {hero('tagline')}
            </p>
            <p className="text-base text-slate-400 mb-10">
              {hero('subtext')}
            </p>
          </div>

          {/* Right - product panels */}
          <div className="flex flex-col gap-4">

              {/* Cards API */}
            <div className="border-l-2 border-dashed border-brand-red bg-red-50/40 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                {hero('db.title')}
              </h2>
              <p className="text-base text-slate-500">
                {hero('db.description')}
              </p>
                {/* Stats - live counts from API */}
                <p className="text-base text-slate-500 mb-5">
                    {hero('stats.banks', {count: banks.length})} - {hero('stats.cards', {count: cards.length})}
                </p>
              <Link
                href="/docs"
                className="text-base font-semibold text-brand-red hover:underline underline-offset-4"
              >
                {hero('db.ctanow')}
              </Link>
            </div>

              {/* Ví thẻ */}
            <div className="border-l-2 border-dashed border-brand-blue bg-blue-50/40 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1">
                    {hero('app.title')}
                </h2>
              <p className="text-base text-slate-500 mb-5">
                {hero('app.description')}
              </p>
                <Link
                    href="/app"
                    className="text-base font-semibold text-brand-blue hover:underline underline-offset-4"
                >
                    {hero('app.ctanow')}
                </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Banks section */}
      <div className="border-t border-dashed border-slate-200">
        <Suspense fallback={<BanksSectionSkeleton />}>
          <BanksSection limit={10} showViewAll />
        </Suspense>
      </div>

      {/* Cards section */}
      <div className="border-t border-dashed border-slate-200">
        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsSection limit={10} showViewAll />
        </Suspense>
      </div>
    </div>
  );
}
