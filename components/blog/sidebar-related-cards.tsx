import type { Card } from '@/lib/api';
import { getCard } from '@/lib/api';
import { CardSlim } from '@/components/cards/variants/card-slim';

interface Props {
  cardSlugs: string[];
}

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
        {cards.map((card, i) => (
          <div key={card.id} className={i > 0 ? 'border-t border-dashed border-slate-100' : ''}>
            <CardSlim card={card} showThumb badges={{ fee: true }} />
          </div>
        ))}
      </div>
    </div>
  );
}
