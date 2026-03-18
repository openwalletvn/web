import { createOgImage, OG_SIZE } from '@/lib/og';
import { createCompareOgImage } from '@/lib/og-card-compare';
import { apiFetch } from '@/lib/api';
import { getComparePairs } from '@/lib/api';
import { getCompareMdxPairs } from '@/lib/compare-mdx';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
    const [apiPairs, mdxPairs] = await Promise.all([
        getComparePairs().catch(() => []),
        Promise.resolve(getCompareMdxPairs()),
    ]);
    const apiPairStrings = apiPairs.map((p) => `${p.a}-vs-${p.b}`);
    const all = [...new Set([...apiPairStrings, ...mdxPairs])];
    return all.map((pair) => ({ pair }));
}

export default async function Image({ params }: { params: Promise<{ pair: string }> }) {
    const { pair } = await params;

    try {
        const vsIndex = pair.indexOf('-vs-');
        if (vsIndex === -1) throw new Error('invalid pair');
        const idA = pair.slice(0, vsIndex);
        const idB = pair.slice(vsIndex + 4);

        const [resA, resB] = await Promise.all([
            apiFetch(`/api/v1/cards/${idA}`),
            apiFetch(`/api/v1/cards/${idB}`),
        ]);
        const [jsonA, jsonB] = await Promise.all([resA.json(), resB.json()]);
        if (!jsonA.success || !jsonB.success) throw new Error('not found');

        const cardA = jsonA.data;
        const cardB = jsonB.data;

        const [imageUrlA, imageUrlB] = await Promise.all([
            (async () => {
                const raw = cardA.image?.url ?? null;
                if (!raw) return '';
                try {
                    const res = await fetch(`${raw}?format=png`);
                    const buf = await res.arrayBuffer();
                    return `data:image/png;base64,${Buffer.from(buf).toString('base64')}`;
                } catch {
                    return '';
                }
            })(),
            (async () => {
                const raw = cardB.image?.url ?? null;
                if (!raw) return '';
                try {
                    const res = await fetch(`${raw}?format=png`);
                    const buf = await res.arrayBuffer();
                    return `data:image/png;base64,${Buffer.from(buf).toString('base64')}`;
                } catch {
                    return '';
                }
            })(),
        ]);

        return createCompareOgImage({
            titleA: cardA.name,
            titleB: cardB.name,
            imageUrlA,
            imageUrlB,
            isVerticalA: cardA.image?.orientation === 'vertical',
            isVerticalB: cardB.image?.orientation === 'vertical',
        });
    } catch {
        return createOgImage({
            title: 'So sánh thẻ',
            description: 'Open Wallet · So sánh thẻ ngân hàng',
        });
    }
}
