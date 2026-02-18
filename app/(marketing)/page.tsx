import Link from 'next/link';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { BanksSection, BanksSectionSkeleton } from './_components/banks-section';
import { CardsSection, CardsSectionSkeleton } from './_components/cards-section';

export default async function HomePage() {
  const [hero, heroTitle, metadata, organization] = await Promise.all([
    getTranslations('hero'),
    getTranslations('Hero'),
    getTranslations('metadata'),
    getTranslations('organization'),
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

          {/* Left — identity + type */}
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

            {/* Stats — text only, em-dash separated */}
            <p className="text-base text-slate-500">
              {hero('stats.banks')} — {hero('stats.cards')} — {hero('stats.free')}
            </p>
          </div>

          {/* Right — product panels */}
          <div className="flex flex-col gap-4">

            {/* Card Database */}
            <div className="border-l-2 border-dashed border-brand-red bg-red-50/40 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                {hero('db.title')}
              </h2>
              <p className="text-base text-slate-500 mb-5">
                {hero('db.description')}
              </p>
              <Link
                href="/docs"
                className="text-base font-semibold text-brand-red hover:underline underline-offset-4"
              >
                {hero('db.ctanow')}
              </Link>
            </div>

            {/* Card Manager */}
            <div className="border-l-2 border-dashed border-brand-blue bg-blue-50/40 p-6">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-slate-900">
                  {hero('app.title')}
                </h2>
                <span className="text-xs px-2 py-0.5 border border-dashed border-brand-blue text-brand-blue font-medium rounded-sm">
                  {hero('app.badge')}
                </span>
              </div>
              <p className="text-base text-slate-500 mb-5">
                {hero('app.description')}
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder={hero('app.placeholder')}
                  className="flex-1 min-w-0 px-3 py-2 bg-white border border-slate-200 rounded-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-blue text-base"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-blue hover:bg-blue-700 text-white rounded-sm font-medium transition-colors shrink-0 text-base"
                >
                  {hero('app.cta')}
                </button>
              </form>
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
