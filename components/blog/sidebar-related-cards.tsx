import Link from 'next/link';
import { getCard, getCardImageUrl } from '@/lib/api';
import type { Card } from '@/lib/api';

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
          const isWebp = imageUrl.match(/\.webp(\?|$)/i);

          return (
            <Link
              key={card.id}
              href={`/cards/${card.id}`}
              className={[
                'flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50/60 transition-colors',
                i > 0 ? 'border-t border-dashed border-slate-100' : '',
              ].join(' ')}
            >
              {!isWebp && (
                <div className="w-14 shrink-0 aspect-[16/10] bg-slate-50 rounded-sm overflow-hidden flex items-center justify-center border border-dashed border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={card.name} className="w-full h-full object-contain" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 leading-tight line-clamp-2">{card.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {card.card_type.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 border border-dashed border-slate-200 text-slate-400 rounded-sm leading-none"
                    >
                      {TYPE_LABELS[t] ?? t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
