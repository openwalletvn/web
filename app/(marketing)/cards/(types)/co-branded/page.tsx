import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getBrands, getCards, getBrandImageUrl } from '@/lib/api';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('BrandsPage');
  return {
    title: t('meta_title'),
    description: t('meta_description'),
    openGraph: { title: t('meta_title'), description: t('meta_description') },
    twitter: { title: t('meta_title'), description: t('meta_description') },
  };
}

export default async function CoBrandedIndexPage() {
  const [brands, coBrandedCards, t, tb] = await Promise.all([
    getBrands(),
    getCards({ type: 'co-branded' }),
    getTranslations('BrandsPage'),
    getTranslations('Breadcrumbs'),
  ]);

  const cardCountByBrand = new Map<string, number>();
  for (const card of coBrandedCards) {
    if (card.co_brand) {
      cardCountByBrand.set(card.co_brand, (cardCountByBrand.get(card.co_brand) ?? 0) + 1);
    }
  }

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: tb('home'), href: '/' },
            { label: tb('cards'), href: '/cards' },
            { label: t('title') },
          ]}
        />

        <h1 className="text-4xl font-bold text-slate-900 mb-1">{t('title')}</h1>
        <p className="text-slate-500 mb-8">{t('count', { count: brands.length })}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/cards/co-branded/${brand.id}`}
              className="flex flex-col items-center gap-2 p-4 border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors"
            >
              <div className="relative w-14 h-14 flex items-center justify-center">
                <img
                  src={getBrandImageUrl(brand.logo_url)}
                  alt=""
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <span className="text-base text-slate-600 text-center leading-tight">{brand.name}</span>
              {cardCountByBrand.has(brand.id) && (
                <span className="text-xs text-slate-500">{cardCountByBrand.get(brand.id)} thẻ</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
