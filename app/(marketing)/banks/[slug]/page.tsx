import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { getBank, getBankImageUrl } from '@/lib/api';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { CardsSection, CardsSectionSkeleton } from '../../_components/cards-section';

export const runtime = 'edge';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const bank = await getBank(slug);
    return {
      title: `${bank.name} | Banks | Open Wallet`,
      description: `${bank.full_name} — cards and details on Open Wallet.`,
    };
  } catch {
    return { title: 'Bank not found | Open Wallet' };
  }
}

export default async function BankPage({ params }: Props) {
  const { slug } = await params;

  let bank;
  try {
    bank = await getBank(slug);
  } catch {
    return (
      <div className="flex items-center justify-center py-32 px-4">
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
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Banks', href: '/banks' },
            { label: bank.name },
          ]}
        />

        <div className="flex items-start gap-6 mb-12">
          <div className="relative w-28 h-28 shrink-0">
            <Image
              src={getBankImageUrl(bank.logo_url)}
              alt=""
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

        <hr className="border-slate-200 mb-2" />

        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsSection filters={{ bank_id: bank.id }} title="Cards" />
        </Suspense>
      </div>
    </div>
  );
}
