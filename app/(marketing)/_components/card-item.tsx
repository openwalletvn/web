'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Card } from '@/lib/api';
import { CardImage } from '@/components/cards/card-image';
import { ShimmerLayer } from '@/components/phucbm/shimmer-layer';

interface Props {
  card: Card;
}

export function CardItem({ card }: Props) {
  const t = useTranslations('CardDetail');

  return (
    <Link
      href={`/the/${card.id}`}
      className="flex flex-col gap-2 group/shimmer overflow-hidden relative"
    >
      <CardImage card={card} />

      <div>
        <p className="font-medium text-slate-800 leading-tight">{card.name}</p>
        {card.annual_fee !== undefined && (
          <p className="text-sm text-slate-500">
            {card.annual_fee === 0
              ? t('free')
              : `${card.annual_fee.toLocaleString()} ${card.currency ?? 'VND'}`}
          </p>
        )}
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="px-1.5 py-0.5 border border-dashed border-brand-blue text-brand-blue font-medium capitalize">
            {card.card_network}{card.card_tier ? ` ${card.card_tier}` : ''}
          </span>
          {card.card_type.map((type) => (
            <span key={type} className="px-1.5 py-0.5 border border-dashed border-slate-300 text-slate-500 capitalize">
              {type}
            </span>
          ))}
        </div>
      </div>
      <ShimmerLayer />
    </Link>
  );
}
