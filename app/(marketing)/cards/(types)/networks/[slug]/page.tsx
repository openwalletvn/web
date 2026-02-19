import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getNetworks, getNetwork, getNetworkImageUrl } from '@/lib/api';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { CardsSection, CardsSectionSkeleton } from '../../../../_components/cards-section';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const networks = await getNetworks().catch(() => []);
  return networks.map((n) => ({ slug: n.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [network, t] = await Promise.all([getNetwork(slug), getTranslations('NetworksPage')]);
    const description = t('network_meta_description', { network: network.name });
    return {
      title: `${network.name} | Open Wallet`,
      description,
      openGraph: { title: `${network.name} | Open Wallet`, description },
      twitter: { title: `${network.name} | Open Wallet`, description },
    };
  } catch {
    return { title: 'Network not found | Open Wallet' };
  }
}

export default async function NetworkPage({ params }: Props) {
  const { slug } = await params;

  const [t, tb] = await Promise.all([
    getTranslations('NetworksPage'),
    getTranslations('Breadcrumbs'),
  ]);

  let network;
  try {
    network = await getNetwork(slug);
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
            { label: t('title'), href: '/cards/networks' },
            { label: network.name },
          ]}
        />

        <div className="flex items-start gap-6 mb-12">
          <div className="w-28 h-28 shrink-0 flex items-center justify-center border border-dashed border-slate-200 rounded-sm p-3">
            <img
              src={getNetworkImageUrl(network.logo_url)}
              alt={network.name}
              width={88}
              height={88}
              className="object-contain"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{network.name}</h1>
            {network.link && (
              <a
                href={network.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-brand-red hover:underline text-base"
              >
                {t('visit_network')}
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-dashed border-slate-200 mb-2" />

        <Suspense fallback={<CardsSectionSkeleton />}>
          <CardsSection filters={{ network: slug as import('@/lib/api').CardNetwork }} title={t('cards_title')} />
        </Suspense>

        <div className="mt-10">
          <Link
            href="/cards/networks"
            className="inline-block px-6 py-2.5 border border-dashed border-slate-300 rounded-sm font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors text-sm"
          >
            {t('back')}
          </Link>
        </div>
      </div>
    </div>
  );
}
