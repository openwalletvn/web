import Link from 'next/link';
import type {Card} from '@/lib/api';
import {getCard, getCardImageUrl} from '@/lib/api';
import {CardImage} from "@/components/cards/card-image";

interface Props {
  cardSlugs: string[];
}

const TYPE_LABELS: Record<string, string> = {
  credit: 'Tín dụng',
  debit: 'Ghi nợ',
  prepaid: 'Trả trước',
  '2in1': '2-trong-1',
  'co-branded': 'Co-branded',
  transit: 'Transit',
  atm: 'ATM',
};

async function fetchCard(slug: string): Promise<Card | null> {
  try {
    return await getCard(slug);
  } catch {
    return null;
  }
}

export async function SidebarRelatedCards({ cardSlugs }: Props) {
  const cards = (await Promise.all(cardSlugs.map(fetchCard))).filter(Boolean) as Card[];

  if (cards.length === 0) return null;

  return (
    <div className="border border-dashed border-slate-200 rounded-sm mt-3">
      <div className="px-3 py-2.5 border-b border-dashed border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thẻ liên quan</span>
      </div>
      <div className="flex flex-col">
        {cards.map((card, i) => {
          const imageUrl = getCardImageUrl(card);

            const fee =
                card.fees?.annual == null
                    ? null
                    : card.fees.annual.amount === 0
                        ? 'Miễn phí'
                        : `${card.fees.annual.amount.toLocaleString('vi-VN')} ${card.currency ?? 'VND'}`;

            const networkLabel = card.card_network
                ? `${card.card_network}${card.card_tier ? ` ${card.card_tier}` : ''}`
                : null;

          return (
            <Link
              key={card.id}
              href={`/the/${card.id}`}
              className={[
                  'flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50/60 transition-colors group',
                i > 0 ? 'border-t border-dashed border-slate-100' : '',
              ].join(' ')}
            >
                {/* Card image */}
                {/*<div className="w-24 shrink-0 aspect-[16/10] bg-slate-50 rounded-sm overflow-hidden flex items-center justify-center border border-dashed border-slate-100">*/}
                {/*  /!* eslint-disable-next-line @next/next/no-img-element *!/*/}
                {/*  <img src={imageUrl} alt={card.name} className="w-full h-full object-contain" loading="lazy" />*/}
                {/*</div>*/}
                {card.image?.orientation === "vertical" ? (
                    <div className="w-24 h-20 shrink-0 flex items-center justify-center">
                        <CardImage card={card} className="h-full w-auto"/>
                    </div>
                ) : (
                    <div className="w-24 shrink-0">
                        <CardImage card={card}/>
                    </div>
                )}

                {/* Info */}
              <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
                      {card.name}
                  </p>

                  {fee && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{fee}</p>
                  )}

                <div className="flex flex-wrap gap-1 mt-1">
                    {card.status === 'discontinued' && (
                        <span
                            className="text-[10px] px-1.5 py-0.5 border border-dashed border-amber-300 text-amber-600 bg-amber-50 rounded-sm leading-none">
                      Dừng phát hành
                    </span>
                    )}
                    {networkLabel && (
                        <span
                            className="text-[10px] px-1.5 py-0.5 border border-dashed border-brand-blue text-brand-blue rounded-sm leading-none capitalize">
                      {networkLabel}
                    </span>
                    )}
                    {card.is_metal && (
                        <span
                            className="text-[10px] px-1.5 py-0.5 border border-dashed border-amber-600 text-amber-700 bg-amber-50 rounded-sm leading-none">
                      Metal
                    </span>
                    )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
