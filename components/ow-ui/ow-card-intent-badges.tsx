'use client';

import type {Intent} from '@/lib/api';
import type {CardModel} from '@/lib/card-model';
import {OwBadge, OwBadges} from '@/components/ow-ui/ow-badge';
import {useIntentMap} from '@/lib/intent-map-context';

export interface IntentItem {
    slug: string;
    icon: string;
    label: string;
    rate?: number;
}

interface Props {
    card?: CardModel;
    intentMap?: Map<string, Intent> | Map<string, Pick<Intent, 'slug' | 'label' | 'icon'>>;
    intents?: IntentItem[];
    slugRateMap?: Map<string, number>;
    highlighted?: boolean | Set<string>;
    small?: boolean;
}

export function OwCardIntentBadges({card, intentMap: intentMapProp, intents, slugRateMap, highlighted = false, small}: Props) {
    const contextIntentMap = useIntentMap();
    const intentMap = intentMapProp ?? contextIntentMap;

    let resolved: IntentItem[];
    if (card) {
        const rateMap = slugRateMap ?? card.buildSlugRateMap();
        resolved = card.getIntents()
            .map(slug => intentMap.get(slug))
            .filter((i): i is Intent => i !== undefined)
            .map(i => ({slug: i.slug, icon: i.icon, label: i.label, rate: rateMap.get(i.slug)}));
    } else {
        resolved = intents ?? [];
    }
    if (!resolved.length) return null;
    return (
        <OwBadges className="ow-card-intent-badges">
            {resolved.map((intent) => {
                const isHighlighted = typeof highlighted === 'boolean'
                    ? highlighted
                    : highlighted.has(intent.slug);
                return (
                    <OwBadge
                        key={intent.slug}
                        variant="intent"
                        slug={intent.slug}
                        emoji={intent.icon}
                        label={intent.label}
                        rate={intent.rate}
                        highlighted={isHighlighted}
                        small={small}
                    />
                );
            })}
        </OwBadges>
    );
}
