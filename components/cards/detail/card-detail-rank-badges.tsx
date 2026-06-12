import Link from 'next/link';
import {getPersonas, getRankedCards} from '@/lib/api';
import type {CardModel} from '@/lib/card-model';
import {PersonaModel} from '@/lib/persona-model';
import {OwBadge, OwBadges} from '@/components/owui/ow-badge';
import {CardDetailSection} from '@/components/cards/detail/card-detail-section';

interface RankBadge {
    slug: string;
    label: string;
    href: string;
    rank: number;
    emoji: string[];
}

interface Props {
    card: CardModel;
}

export async function CardDetailRankBadges({card}: Props) {
    const matchedPersonas = card.getMatchedPersonas();
    if (!matchedPersonas.length) return null;

    const personas = await getPersonas().catch(() => []);

    const results = await Promise.allSettled(
        matchedPersonas.map(async (slug): Promise<RankBadge | null> => {
            const raw = personas.find((p) => p.slug === slug);
            if (!raw) return null;
            const persona = new PersonaModel(raw);
            if (!persona.isKnown()) return null;

            const ranked = await getRankedCards({
                persona: slug,
                intents: persona.getRankIntents(),
                limit: 20,
            });

            const position = ranked.findIndex((r) => r.card.id === card.getId());
            if (position === -1) return null;

            return {
                slug,
                label: persona.getDisplayLabel(),
                href: persona.getHref(),
                rank: position + 1,
                emoji: persona.getEmoji()
            };
        }),
    );

    const MAX_RANK = 10;

    const badges: RankBadge[] = results
        .filter((r): r is PromiseFulfilledResult<RankBadge> => r.status === 'fulfilled' && r.value !== null)
        .map((r) => r.value)
        .filter((b) => b.rank <= MAX_RANK)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 3);

    if (!badges.length) return null;

    return (
        <CardDetailSection title="Xếp hạng" className="ow-card-detail-rank-badges flex-wrap">
            <OwBadges>
                {badges.map(({slug, label, href, rank, emoji}) => (
                    <OwBadge key={slug} colorHex="#E8321A" asChild>
                        <Link href={href}>Top
                            <span className="font-bold">#{rank}</span>
                            trong lĩnh vực
                            <span>{label}</span>
                            <span className="inline-flex gap-1">{emoji.map((e, i) => <span key={i}>{e}</span>)}</span>
                        </Link>
                    </OwBadge>
                ))}
            </OwBadges>
        </CardDetailSection>
    );
}
