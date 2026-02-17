import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getCard, getBank, getCardImageUrl, getBankImageUrl } from '@/lib/api';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export const runtime = 'edge';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const card = await getCard(slug);
    return {
      title: `${card.name} | Cards | Open Wallet`,
      description: `${card.name} — ${card.card_network} ${card.card_type.join('/')} card on Open Wallet.`,
    };
  } catch {
    return { title: 'Card not found | Open Wallet' };
  }
}

export default async function CardPage({ params }: Props) {
  const { slug } = await params;

  let card;
  try {
    card = await getCard(slug);
  } catch {
    return (
      <div className="flex items-center justify-center py-32 px-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-slate-900 mb-4">Card not found</p>
          <Link href="/cards" className="text-brand-red hover:underline">
            ← Back to Cards
          </Link>
        </div>
      </div>
    );
  }

  const bank = await getBank(card.bank_id).catch(() => null);
  const isVertical = card.image_orientation === 'vertical';

  return (
    <div className="px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cards', href: '/cards' },
            { label: card.name },
          ]}
        />

        <div className="flex flex-col gap-8">
          <div className={`relative mx-auto ${isVertical ? 'w-48 aspect-[2/3]' : 'w-full max-w-sm aspect-[16/10]'}`}>
            <Image
              src={getCardImageUrl(card)}
              alt=""
              fill
              className="object-contain"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{card.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="capitalize">{card.card_network}</Badge>
                {card.card_type.map((t) => (
                  <Badge key={t} variant="outline" className="capitalize">{t}</Badge>
                ))}
                {card.card_tier && (
                  <Badge variant="outline" className="capitalize">{card.card_tier}</Badge>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {card.annual_fee !== undefined && (
                <>
                  <dt className="text-slate-500">Annual fee</dt>
                  <dd className="text-slate-900 font-medium">
                    {card.annual_fee === 0 ? 'Free' : `${card.annual_fee.toLocaleString()} ${card.currency ?? ''}`}
                  </dd>
                </>
              )}
              {card.interest_free_days !== undefined && (
                <>
                  <dt className="text-slate-500">Interest-free days</dt>
                  <dd className="text-slate-900 font-medium">{card.interest_free_days} days</dd>
                </>
              )}
              {card.co_brand && (
                <>
                  <dt className="text-slate-500">Co-brand</dt>
                  <dd className="text-slate-900 font-medium">{card.co_brand}</dd>
                </>
              )}
            </dl>

            {card.card_link && (
              <a
                href={card.card_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-red hover:underline text-sm"
              >
                View card details ↗
              </a>
            )}

            {bank && (
              <Link
                href={`/banks/${bank.id}`}
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors w-fit"
              >
                <div className="relative w-8 h-8">
                  <Image
                    src={getBankImageUrl(bank.logo_url)}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-slate-800">{bank.name}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
