import {getIntents} from '@/lib/api';
import type {CardModel} from '@/lib/card-model';
import {OwCardIntentBadges} from '@/components/owui/ow-card-intent-badges';
import {CardDetailSection} from '@/components/cards/detail/card-detail-section';

interface Props {
    card: CardModel;
}

export async function CardDetailIntents({ card }: Props) {
    if (!card.getIntents().length) return null;

    const allIntents = await getIntents().catch(() => []);
    const intentMap = new Map(allIntents.map((i) => [i.slug, i]));

    return (
        <CardDetailSection title="Lĩnh vực ưu đãi" className="ow-card-detail-intents">
            <OwCardIntentBadges card={card.toRaw()} intentMap={intentMap} highlighted/>
        </CardDetailSection>
    );
}
