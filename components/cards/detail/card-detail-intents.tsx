import type { Card, Intent } from '@/lib/api';
import { getIntents } from '@/lib/api';
import {OwBadge, OwBadges} from '@/components/ow-ui/ow-badge';
import {CATCHALL_SLUGS} from '@/lib/cashback-utils';

interface Props {
 card: Card;
}

export async function CardDetailIntents({ card }: Props) {
 if (!card.intents?.length) return null;

 const allIntents = await getIntents().catch(() => [] as Intent[]);
 const intentMap = new Map(allIntents.map((i) => [i.slug, i]));

 const slugRateMap = new Map<string, number>();
 for (const rule of card.cashback?.rules ?? []) {
     for (const slug of [...(rule.merchants ?? []), ...(rule.intents ?? []).filter(s => !CATCHALL_SLUGS.has(s))]) {
         if (!slugRateMap.has(slug)) slugRateMap.set(slug, rule.rate);
     }
 }

 const cardIntents = card.intents
 .map((slug) => intentMap.get(slug))
 .filter((i): i is Intent => i !== undefined);

 if (!cardIntents.length) return null;

 return (
 <section className="ow-card-detail-intents flex flex-col gap-3">
 <h2 className="text-label text-text-muted">Phù hợp với</h2>
 <OwBadges>
 {cardIntents.map((intent) => (
 <OwBadge
 key={intent.slug}
 variant="intent"
 slug={intent.slug}
 emoji={intent.icon}
 label={intent.label}
 rate={slugRateMap.get(intent.slug)}
 highlighted
 />
 ))}
 </OwBadges>
 </section>
 );
}
