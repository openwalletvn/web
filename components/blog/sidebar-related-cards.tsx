import {getCard} from '@/lib/api';
import type {Card} from '@/lib/api';
import {CardModel} from '@/lib/card-model';
import { CardDisplay } from '@/components/cards/variants/card-display';

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
  const raw = (await Promise.all(cardSlugs.map(fetchCard))).filter(Boolean) as Card[];
  const cards = raw.map(c => new CardModel(c));

  if (cards.length === 0) return null;

  return (
    <div className="ow-sidebar-related-cards border border-dashed border-slate-200 rounded-sm mt-3">
      <div className="px-3 py-2.5 border-b border-dashed border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thẻ liên quan</span>
      </div>
      <div className="flex flex-col">
        {cards.map((card, i) => (
          <div key={card.getId()} className={i > 0 ? 'border-t border-dashed border-slate-100' : ''}>
            <CardDisplay variant="slim" card={card} showThumb badges={{ fee: true }} />
          </div>
        ))}
      </div>
    </div>
  );
}
