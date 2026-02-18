import Image from 'next/image';
import Link from 'next/link';
import { getCardImageUrl, type Card } from '@/lib/api';

interface Props {
  card: Card;
}

export function CardItem({ card }: Props) {
  const isVertical = card.image_orientation === 'vertical';

  return (
    <Link
      href={`/cards/${card.id}`}
      className="flex flex-col gap-2 p-3 border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors block"
    >
      <div className={`relative w-full ${isVertical ? 'aspect-[2/3]' : 'aspect-[16/10]'} bg-slate-50 overflow-hidden`}>
        <Image src={getCardImageUrl(card)} alt="" fill className="object-contain" />
      </div>

      <div>
        <p className="font-medium text-slate-800 leading-tight">{card.name}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="px-1.5 py-0.5 border border-dashed border-brand-blue text-brand-blue font-medium capitalize">
            {card.card_network}
          </span>
          {card.card_type.map((type) => (
            <span key={type} className="px-1.5 py-0.5 border border-dashed border-slate-300 text-slate-500 capitalize">
              {type}
            </span>
          ))}
        </div>
        {card.co_brand && (
          <p className="text-base text-slate-500 mt-1">× {card.co_brand}</p>
        )}
      </div>
    </Link>
  );
}
