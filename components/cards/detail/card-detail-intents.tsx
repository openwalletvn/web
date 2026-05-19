import type { Card, Intent } from '@/lib/api';
import { getIntents } from '@/lib/api';

interface Props {
 card: Card;
}

export async function CardDetailIntents({ card }: Props) {
 if (!card.intents?.length) return null;

 const allIntents = await getIntents().catch(() => [] as Intent[]);
 const intentMap = new Map(allIntents.map((i) => [i.slug, i]));

 const cardIntents = card.intents
 .map((slug) => intentMap.get(slug))
 .filter((i): i is Intent => i !== undefined);

 if (!cardIntents.length) return null;

 return (
 <section className="ow-card-detail-intents flex flex-col gap-3">
 <h2 className="text-label text-text-muted">Phù hợp với</h2>
 <div className="flex flex-wrap gap-2">
 {cardIntents.map((intent) => (
 <span
 key={intent.slug}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
 >
 <span>{intent.icon}</span>
 {intent.label}
 </span>
 ))}
 </div>
 </section>
 );
}
