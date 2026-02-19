import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getBrands, getBrand, getBrandImageUrl } from '@/lib/api';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { CardsSection, CardsSectionSkeleton } from '../../../../_components/cards-section';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const brands = await getBrands().catch(() => []);
  return brands.map((b) => ({ slug: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [brand, t] = await Promise.all([getBrand(slug), getTranslations('BrandsPage')]);
    const description = t('brand_meta_description', { brand: brand.name });
    return {
      title: `${brand.name} | Open Wallet`,
      description,
      openGraph: { title: `${brand.name} | Open Wallet`, description },
      twitter: { title: `${brand.name} | Open Wallet`, description },
    };
  } catch {
    return { title: 'Brand not found | Open Wallet' };
  }
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;

  const [t, tb] = await Promise.all([
    getTranslations('BrandsPage'),
    getTranslations('Breadcrumbs'),
  ]);

  let brand;
  try {
    brand = await getBrand(slug);
  } catch {
    notFound();
  }

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: tb('home'), href: '/' },
            { label: tb('cards'), href: '/cards' },
            { label: t('title'), href: '/cards/co-branded' },
            { label: brand.name },
          ]}
        />

        <div className="flex items-start gap-6 mb-12">
          <div className="w-28 h-28 shrink-0 flex items-center justify-center border border-dashed border-slate-200 rounded-sm p-3">
            <img
              src={getBrandImageUrl(brand.logo_url)}
              alt={brand.name}
              width={88}
              height={88}
              className="object-contain"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{brand.name}</h1>
            {brand.link && (
              <a
                href={brand.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-brand-red hover:underline text-base"
              >
                {t('visit_brand')}
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-dashed border-slate-200 mb-2" />

        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsSection filters={{ co_brand: slug }} title={t('cards_title')} />
        </Suspense>

        <div className="mt-10">
          <Link
            href="/cards/co-branded"
            className="inline-block px-6 py-2.5 border border-dashed border-slate-300 rounded-sm font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors text-sm"
          >
            {t('back')}
          </Link>
        </div>
      </div>
    </div>
  );
}
