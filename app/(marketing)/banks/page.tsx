import Image from 'next/image';
import Link from 'next/link';
import { getBanks, getBankImageUrl } from '@/lib/api';

export const runtime = 'edge';

export default async function BanksPage() {
  const banks = await getBanks();

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">
            ← Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mt-4">Banks</h1>
          <p className="text-slate-500 mt-1">{banks.length} banks</p>
        </div>

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
                  alt={bank.name}
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
