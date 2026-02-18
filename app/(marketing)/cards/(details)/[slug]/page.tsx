import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { getCards, getCard, getBank, getCardImageUrl, getBankImageUrl } from '@/lib/api';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { AddToWalletButton } from './_add-to-wallet-button';

export async function generateStaticParams() {
  const cards = await getCards();
  return cards.map((card) => ({ slug: card.id }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const card = await getCard(slug);
    const description = `${card.name} — thẻ ${card.card_network} ${card.card_type.join('/')} trên Open Wallet.`;
    return {
      title: `${card.name} | Open Wallet`,
      description,
      openGraph: {
        title: card.name,
        description,
      },
      twitter: {
        title: card.name,
        description,
      },
    };
  } catch {
    const t = await getTranslations('CardDetail');
    return { title: `${t('not_found')} | Open Wallet` };
  }
}

export default async function CardPage({ params }: Props) {
  const { slug } = await params;
  const [t, tb] = await Promise.all([
    getTranslations('CardDetail'),
    getTranslations('Breadcrumbs'),
  ]);

  let card;
  try {
    card = await getCard(slug);
  } catch {
    return (
      <div className="flex items-center justify-center py-32 px-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-slate-900 mb-4">{t('not_found')}</p>
          <Link href="/cards" className="text-brand-red hover:underline">{t('back')}</Link>
        </div>
      </div>
    );
  }

  const bank = await getBank(card.bank_id).catch(() => null);
  const isVertical = card.image_orientation === 'vertical';

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: tb('home'), href: '/' },
            { label: tb('cards'), href: '/cards' },
            { label: card.name },
          ]}
        />

        <div className="flex flex-col md:flex-row gap-10">
          <div className={`shrink-0 ${isVertical ? 'md:w-48' : 'md:w-80'}`}>
            <div className={`relative w-full ${isVertical ? 'aspect-[2/3]' : 'aspect-[16/10]'} bg-slate-100 rounded-xl overflow-hidden`}>
              <Image src={getCardImageUrl(card)} alt="" fill className="object-contain" />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{card.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="capitalize bg-brand-blue text-white border-transparent">{card.card_network}</Badge>
                {card.card_type.map((type) => (
                  <Badge key={type} variant="outline" className="capitalize">{type}</Badge>
                ))}
                {card.card_tier && (
                  <Badge variant="outline" className="capitalize">{card.card_tier}</Badge>
                )}
              </div>
            </div>

            <AddToWalletButton card={card} />

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-base">
              {card.annual_fee !== undefined && (
                <>
                  <dt className="text-slate-500">{t('annual_fee')}</dt>
                  <dd className="text-slate-900 font-medium">
                    {card.annual_fee === 0 ? t('free') : `${card.annual_fee.toLocaleString()} ${card.currency ?? ''}`}
                  </dd>
                </>
              )}
              {card.interest_free_days !== undefined && (
                <>
                  <dt className="text-slate-500">{t('interest_free_days')}</dt>
                  <dd className="text-slate-900 font-medium">{t('days', { count: card.interest_free_days })}</dd>
                </>
              )}
              {card.co_brand && (
                <>
                  <dt className="text-slate-500">{t('co_brand_label')}</dt>
                  <dd className="text-slate-900 font-medium">{card.co_brand}</dd>
                </>
              )}
            </dl>

            {card.card_link && (
              <a href={card.card_link} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline text-base">
                {t('view_details')}
              </a>
            )}

            {bank && (
              <Link
                href={`/banks/${bank.id}`}
                className="flex items-center gap-3 p-3 border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors w-fit"
              >
                <div className="relative w-8 h-8">
                  <Image src={getBankImageUrl(bank.logo_url)} alt="" fill className="object-contain" />
                </div>
                <span className="text-base font-medium text-slate-800">{bank.name}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
