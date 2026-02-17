import Link from 'next/link';
import { Suspense } from 'react';
import { BanksSection, BanksSectionSkeleton } from './_components/banks-section';
import { CardsSection, CardsSectionSkeleton } from './_components/cards-section';

export const runtime = 'edge';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl mx-auto text-center py-20 px-4">
        <div className="mb-8">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Open Wallet Logo"
              className="w-32 h-32 md:w-40 md:h-40"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-4">
            Open Wallet
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-8">
            Open-source digital wallet card database for Vietnam
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/docs"
            className="px-8 py-4 bg-brand-red hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-lg"
          >
            View API Documentation
          </Link>
        </div>
      </div>

      <Suspense fallback={<BanksSectionSkeleton />}>
        <BanksSection />
      </Suspense>

      <Suspense fallback={<CardsSectionSkeleton />}>
        <CardsSection />
      </Suspense>
    </div>
  );
}
