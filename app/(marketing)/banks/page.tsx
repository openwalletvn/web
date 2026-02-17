import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getBanks, getBankImageUrl } from '@/lib/api';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Banks | Open Wallet',
  description: 'Browse all Vietnamese banks on Open Wallet.',
};

export default async function BanksPage() {
  const banks = await getBanks();

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Banks' }]} />

        <h1 className="text-4xl font-bold text-slate-900 mb-1">Banks</h1>
        <p className="text-slate-500 mb-8">{banks.length} banks</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {banks.map((bank) => (
            <Link
              key={bank.id}
              href={`/banks/${bank.id}`}
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="relative w-16 h-16">
                <Image
                  src={getBankImageUrl(bank.logo_url)}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs text-slate-600 text-center leading-tight">{bank.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
