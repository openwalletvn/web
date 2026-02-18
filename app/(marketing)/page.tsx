import Link from 'next/link';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Landmark, CreditCard, Infinity } from 'lucide-react';
import { BanksSection, BanksSectionSkeleton } from './_components/banks-section';
import { CardsSection, CardsSectionSkeleton } from './_components/cards-section';

export const runtime = 'edge';

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

      {/* Hero — full screen, light */}
      <section className="w-full min-h-[calc(100vh-4rem)] flex items-center px-4 py-16">
        <div className="max-w-4xl mx-auto w-full text-center">
          {/* Logo + name */}
          <div className="mx-auto mb-6 flex items-center justify-center">
            <img src="/logo.png" alt="Open Wallet Logo" className="w-32 h-32 md:w-40 md:h-40" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-4">
            {heroTitle('title')}
          </h1>
          {/* Tagline as subheading */}
          <p className="text-xl md:text-2xl text-slate-600 mb-2">
            {hero('tagline')}
          </p>
          <p className="text-base text-slate-400 mb-12">
            {hero('subtext')}
          </p>

          {/* Two cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {/* Left card — Card Database */}
            <div className="bg-white border border-brand-red rounded-xl p-6 text-left flex flex-col shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-2">{hero('db.title')}</h2>
              <p className="text-slate-500 mb-6 flex-1">{hero('db.description')}</p>
              <Link
                href="/docs"
                className="text-brand-red font-semibold hover:text-red-700 transition-colors"
              >
                {hero('db.cta')}
              </Link>
            </div>

            {/* Right card — Card Manager */}
            <div className="bg-white border border-brand-blue rounded-xl p-6 text-left flex flex-col shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-slate-900">{hero('app.title')}</h2>
                <span className="text-xs px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded-full font-medium">
                  {hero('app.badge')}
                </span>
              </div>
              <p className="text-slate-500 mb-6 flex-1">{hero('app.description')}</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder={hero('app.placeholder')}
                  className="flex-1 min-w-0 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-blue"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shrink-0"
                >
                  {hero('app.cta')}
                </button>
              </form>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 text-slate-500">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-slate-400" />
              <span>{hero('stats.banks')}</span>
            </div>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <span>{hero('stats.cards')}</span>
            </div>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <Infinity className="w-5 h-5 text-slate-400" />
              <span>{hero('stats.free')}</span>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<BanksSectionSkeleton />}>
        <BanksSection limit={12} showViewAll />
      </Suspense>

      <Suspense fallback={<CardsSectionSkeleton />}>
        <CardsSection limit={10} showViewAll />
      </Suspense>
    </div>
  );
}
