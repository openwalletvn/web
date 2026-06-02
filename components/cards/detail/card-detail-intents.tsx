import type {Intent} from '@/lib/api';
import { getIntents } from '@/lib/api';
import type {CardModel} from '@/lib/card-model';
import {OwCardIntentBadges} from '@/components/ow-ui/ow-card-intent-badges';

interface Props {
 card: CardModel;
}

export async function CardDetailIntents({ card }: Props) {
 if (!card.getIntents().length) return null;

 const allIntents = await getIntents().catch(() => [] as Intent[]);
 const intentMap = new Map(allIntents.map((i) => [i.slug, i]));

 return (
 <section className="ow-card-detail-intents flex flex-col gap-3">
 <h2 className="text-label text-text-muted">Phù hợp với</h2>
 <OwCardIntentBadges card={card} intentMap={intentMap} highlighted/>
 </section>
 );
}
