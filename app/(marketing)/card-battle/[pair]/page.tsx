import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getCard, getComparePairs, getRelatedCardsForMany, getIntents } from '@/lib/api';
import { lookupCompareMdx, getCompareMdxPairs } from '@/lib/compare-mdx';
import { buildComparePageMeta } from '@/lib/page-meta/compare';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';
import { CompareTable } from '@/components/compare/compare-table';
import { MarketingPageShell } from '@/components/layout/marketing-page-shell';
import { CompareSection } from '@/components/compare/compare-section';
import { CompareSuggestedCards } from '@/components/compare/compare-suggested-cards';

export const dynamicParams = true;
export const revalidate = 3600;

interface Props {
    params: Promise<{ pair: string }>;
}

export async function generateStaticParams() {
    const [apiPairs, mdxPairs] = await Promise.all([
        getComparePairs().catch(() => []),
        Promise.resolve(getCompareMdxPairs()),
    ]);
    const apiPairStrings = apiPairs.map((p) => p.compare_path.slice(1));
    const all = [...new Set([...apiPairStrings, ...mdxPairs])];
    return all.map((pair) => ({ pair }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { pair } = await params;
    const ids = pair.split('-vs-');
    if (ids.length < 2) return { title: buildTitle(SECTION_TITLES.compare) };
    try {
        const [cardA, cardB] = await Promise.all([getCard(ids[0]), getCard(ids[1])]);
        const mdx = ids.length === 2 ? lookupCompareMdx(pair) : null;
        const { metadata } = buildComparePageMeta(cardA, cardB, mdx?.frontmatter);
        return metadata;
    } catch {
        return { title: buildTitle(SECTION_TITLES.compare) };
    }
}

export default async function ComparePairPage({ params }: Props) {
    const { pair } = await params;
    const ids = pair.split('-vs-');
    if (ids.length < 2 || ids.length > 3) notFound();

    const cards = await Promise.all(ids.map((id) => getCard(id).catch(() => null)));
    if (cards.some((c) => c === null)) notFound();

    const [cardA, cardB] = cards as NonNullable<(typeof cards)[number]>[];
    const mdx = ids.length === 2 ? lookupCompareMdx(pair) : null;

    const [suggestedCards, allIntents] = await Promise.all([
        getRelatedCardsForMany(ids).catch(() => []),
        getIntents().catch(() => []),
    ]);
    const intentMap = new Map(allIntents.map((i) => [i.slug, i]));
    const { jsonLd, breadcrumbItems } = buildComparePageMeta(cardA, cardB, mdx?.frontmatter);
    const hasContent = mdx && mdx.content.trim().length > 0;

    const title = mdx?.frontmatter.title ?? `So sánh ${cards.map((c) => c!.name).join(' vs ')}`;

    return (
        <MarketingPageShell title={title} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <CompareSection defaultPair={pair} excludePair={pair} intentMap={intentMap} recordOnMount={pair}>
                {hasContent && (
                    <MDXRemote
                        source={mdx.content}
                        components={{ CompareTable: () => <CompareTable cards={[cardA, cardB]} intentMap={intentMap} /> }}
                    />
                )}
            </CompareSection>
            <CompareSuggestedCards cards={suggestedCards} />
        </MarketingPageShell>
    );
}
