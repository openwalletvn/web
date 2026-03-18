import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getCard, getComparePairs } from '@/lib/api';
import { lookupCompareMdx, getCompareMdxPairs } from '@/lib/compare-mdx';
import { buildComparePageMeta } from '@/lib/page-meta/compare';
import { CompareTemplate } from '@/components/compare/compare-template';
import { CompareTable } from '@/components/compare/compare-table';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { RecordCompareVisit } from '@/components/compare/record-compare-visit';

interface Props {
    params: Promise<{ pair: string }>;
}

export async function generateStaticParams() {
    const [apiPairs, mdxPairs] = await Promise.all([
        getComparePairs().catch(() => []),
        Promise.resolve(getCompareMdxPairs()),
    ]);
    const apiPairStrings = apiPairs.map((p) => `${p.a}-vs-${p.b}`);
    const all = [...new Set([...apiPairStrings, ...mdxPairs])];
    return all.map((pair) => ({ pair }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { pair } = await params;
    const vsIndex = pair.indexOf('-vs-');
    if (vsIndex === -1) return { title: 'So sánh thẻ | Open Wallet' };
    const idA = pair.slice(0, vsIndex);
    const idB = pair.slice(vsIndex + 4);
    try {
        const [cardA, cardB] = await Promise.all([getCard(idA), getCard(idB)]);
        const mdx = lookupCompareMdx(pair);
        const { metadata } = buildComparePageMeta(cardA, cardB, mdx?.frontmatter);
        return metadata;
    } catch {
        return { title: 'So sánh thẻ | Open Wallet' };
    }
}

export default async function ComparePairPage({ params }: Props) {
    const { pair } = await params;
    const vsIndex = pair.indexOf('-vs-');
    if (vsIndex === -1) notFound();

    const idA = pair.slice(0, vsIndex);
    const idB = pair.slice(vsIndex + 4);

    const [cardA, cardB] = await Promise.all([
        getCard(idA).catch(() => null),
        getCard(idB).catch(() => null),
    ]);
    if (!cardA || !cardB) notFound();

    const mdx = lookupCompareMdx(pair);
    const { jsonLd, breadcrumbItems } = buildComparePageMeta(cardA, cardB, mdx?.frontmatter);
    const hasContent = mdx && mdx.content.trim().length > 0;
    const tier = hasContent ? 'editorial' : 'programmatic';

    return (
        <div className="px-4 py-12">
<div className="max-w-container mx-auto">
                <RecordCompareVisit pair={pair} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <Breadcrumbs items={breadcrumbItems} />
                <div className="mt-6 mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {mdx?.frontmatter.title ?? `So sánh ${cardA.name} vs ${cardB.name}`}
                    </h1>
                    {process.env.NODE_ENV === 'development' && (
                        <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 border border-dashed border-slate-300 rounded text-xs text-slate-500 font-mono">
                            {tier} · {pair}
                        </span>
                    )}
                </div>
                <div>
                    {hasContent ? (
                        <CompareTemplate cards={[cardA, cardB]}>
                            <MDXRemote
                                source={mdx.content}
                                components={{ CompareTable: () => <CompareTable cards={[cardA, cardB]} /> }}
                            />
                        </CompareTemplate>
                    ) : (
                        <CompareTemplate cards={[cardA, cardB]} />
                    )}
                </div>
            </div>
        </div>
    );
}
