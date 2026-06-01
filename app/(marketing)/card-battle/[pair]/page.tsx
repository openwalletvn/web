import React from 'react';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
// next-mdx-remote/rsc + lib/compare-mdx + content/so-sanh/ MDX files — unused, remove when cleaning up
import {getCard, getComparePairs, getIntents, getRelatedCardsForMany} from '@/lib/api';
import {buildComparePageMeta} from '@/lib/page-meta/compare';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {CompareSection} from '@/components/compare/compare-section';
import {CompareSuggestedCards} from '@/components/compare/compare-suggested-cards';

export const dynamicParams = true;
export const revalidate = 3600;

interface Props {
    params: Promise<{ pair: string }>;
}

export async function generateStaticParams() {
    const apiPairs = await getComparePairs().catch(() => []);
    return apiPairs.map((p) => ({ pair: p.compare_path.slice(1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { pair } = await params;
    const ids = pair.split('-vs-');
    if (ids.length < 2) return { title: buildTitle(SECTION_TITLES.compare) };
    try {
        const [cardA, cardB] = await Promise.all([getCard(ids[0]), getCard(ids[1])]);
        const { metadata } = buildComparePageMeta(cardA, cardB);
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

    const [suggestedCards, allIntents] = await Promise.all([
        getRelatedCardsForMany(ids).catch(() => []),
        getIntents().catch(() => []),
    ]);
    const intentMap = new Map(allIntents.map((i) => [i.slug, i]));
    const { jsonLd, breadcrumbItems } = buildComparePageMeta(cardA, cardB);

    const title = (
        <>
            So sánh{' '}
            {cards.map((c, i) => (
                <React.Fragment key={c!.id}>
                    {i > 0 && ' vs '}
                    <span className={i === 0 ? 'text-primary' : 'text-primary-light'}>{c!.name}</span>
                </React.Fragment>
            ))}
        </>
    );

    return (
        <MarketingPageShell title={title} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <div className="ow-compare-wrapper mt-16">
                <CompareSection defaultPair={pair} excludePair={pair} intentMap={intentMap} recordOnMount={pair}/>
                <CompareSuggestedCards cards={suggestedCards}/>
            </div>
        </MarketingPageShell>
    );
}
