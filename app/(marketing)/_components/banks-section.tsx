import Image from 'next/image';
import Link from 'next/link';
import { getBanks, getBankImageUrl } from '@/lib/api';

interface Props {
  limit?: number;
  showViewAll?: boolean;
  description?: string;
}

export async function BanksSection({ limit, showViewAll, description }: Props) {
  const banks = await getBanks();
  const displayed = limit ? banks.slice(0, limit) : banks;

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Banks</h2>
        {description && (
          <p className="text-slate-500 mt-1 text-sm">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayed.map((bank) => (
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
      {showViewAll && (
        <div className="mt-8 text-center">
          <Link
            href="/banks"
            className="inline-block px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            View all {banks.length} banks →
          </Link>
        </div>
      )}
    </section>
  );
}

export function BanksSectionSkeleton() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-slate-200 rounded animate-pulse mt-2" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="w-12 h-12 bg-slate-200 rounded animate-pulse" />
            <div className="w-16 h-3 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}
