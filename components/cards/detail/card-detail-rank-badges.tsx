import Link from 'next/link';
import {getPersonas, getRankedCards} from '@/lib/api';
import {CARD_CATEGORIES} from '@/lib/card-categories';
import type {CardModel} from '@/lib/card-model';

interface RankBadge {
    slug: string;
    label: string;
    href: string;
    rank: number;
}

interface Props {
    card: CardModel;
}

export async function CardDetailRankBadges({card}: Props) {
    const matchedPersonas = card.getMatchedPersonas();
    if (!matchedPersonas.length) return null;

    const personas = await getPersonas().catch(() => []);
    const categoryMap = Object.fromEntries(CARD_CATEGORIES.map((c) => [c.slug, c]));

    const results = await Promise.allSettled(
        matchedPersonas.map(async (slug): Promise<RankBadge | null> => {
            const persona = personas.find((p) => p.slug === slug);
            const category = categoryMap[slug];
            if (!persona || !category) return null;

            const ranked = await getRankedCards({
                persona: slug,
                intents: persona.rank_intents ?? [],
                limit: 20,
            });

            const position = ranked.findIndex((r) => r.card.id === card.getId());
            if (position === -1) return null;

            return {slug, label: persona.labelVi ?? persona.label, href: category.href, rank: position + 1};
        }),
    );

    const badges: RankBadge[] = results
        .filter((r): r is PromiseFulfilledResult<RankBadge> => r.status === 'fulfilled' && r.value !== null)
        .map((r) => r.value)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 3);

    if (!badges.length) return null;

    return (
        <div className="ow-card-detail-rank-badges flex flex-wrap gap-2">
            {badges.map(({slug, label, href, rank}) => (
                <Link
                    key={slug}
                    href={href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-red/20 bg-brand-red/5 text-brand-red text-sm font-medium hover:bg-brand-red/10 transition-colors"
                >
                    <span className="font-bold">#{rank}</span>
                    <span>{label}</span>
                </Link>
            ))}
        </div>
    );
}
