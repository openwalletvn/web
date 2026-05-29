import type { Card } from '@/lib/api';
import { CardDisplay } from '@/components/cards/variants/card-display';
import { cn } from '@/lib/utils';

interface Props {
 cards: Card[];
 /** Tailwind grid-cols class — defaults to match CardDetailCompare */
 gridClassName?: string;
}

export function CompareSuggestedCards({
 cards,
 gridClassName = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
}: Props) {
 if (cards.length === 0) return null;

 return (
 <div className="ow-compare-suggested-cards mt-16 pt-10 border-t border-slate-100">
 <h2 className="text-card-heading mb-6">Có thể bạn muốn xem</h2>
 <div className={cn('grid', gridClassName, 'gap-6')}>
 {cards.map((card) => (
 <CardDisplay variant="tile" key={card.id} card={card} />
 ))}
 </div>
 </div>
 );
}
