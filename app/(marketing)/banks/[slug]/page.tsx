import Image from 'next/image';
import Link from 'next/link';
import { getBank, getBankImageUrl } from '@/lib/api';

export const runtime = 'edge';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BankPage({ params }: Props) {
  const { slug } = await params;

  let bank;
  try {
    bank = await getBank(slug);
  } catch {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-slate-900 mb-4">Bank not found</p>
          <Link href="/banks" className="text-brand-red hover:underline">
            ← Back to Banks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/banks" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">
          ← Banks
        </Link>

        <div className="mt-8 flex items-start gap-6">
          <div className="relative w-28 h-28 shrink-0">
            <Image
              src={getBankImageUrl(bank.logo_url)}
              alt={bank.name}
              fill
              className="object-contain"
            />
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
                className="inline-block mt-4 text-brand-red hover:underline text-sm"
              >
                {bank.link} ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
