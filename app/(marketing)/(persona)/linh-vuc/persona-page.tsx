import {getCards, getRankedCards} from '@/lib/api';
import {buildIntentCategoryMeta, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowsePersonas} from '@/components/marketing/browse-categories';
import {PersonaPoolCards} from '@/components/marketing/persona-pool-cards';
import {PersonaFAQ, PersonaIntro} from '@/components/marketing/category-seo-section';

export const revalidate = 3600;

export async function PersonaPage({config}: { config: IntentCategoryConfig }) {
    const [poolCards, initialRanked] = await Promise.all([
        getCards({persona: config.personaSlug}),
        getRankedCards({persona: config.personaSlug, intents: [], limit: 10}).catch(() => []),
    ]);
    const {jsonLd, breadcrumbItems} = buildIntentCategoryMeta(config, initialRanked.map(r => r.card));
    const rankedIds = new Set(initialRanked.map((r) => r.card.id));

    return (
        <MarketingPageShell title={config.title} description={config.description} breadcrumbItems={breadcrumbItems}
                            jsonLd={jsonLd}>
            <PersonaIntro intro={config.intro}/>
            <CardRankingTable initialRanked={initialRanked} personaSlug={config.personaSlug}
                              title={config.rankingTitle}/>
            <PersonaFAQ faqs={config.faqs}/>
            <PersonaPoolCards poolCards={poolCards} excludeIds={rankedIds} excludeRanked={true}/>
            <BrowsePersonas currentHref={config.url}/>
        </MarketingPageShell>
    );
}
