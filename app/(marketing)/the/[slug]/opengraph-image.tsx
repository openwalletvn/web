import {createOgImage, OG_SIZE} from '@/lib/og';
import {apiFetch} from '@/lib/api';
import {createCardOgImage} from "@/lib/og-card";

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
    try {
        const res = await apiFetch('/api/v1/cards');
        const json = await res.json();
        if (!json.success) return [];
        return json.data.map((card: { id: string }) => ({slug: card.id}));
    } catch {
        return [];
    }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;

    try {
        const cardRes = await apiFetch(`/api/v1/cards/${slug}`);
        const cardJson = await cardRes.json();
        if (!cardJson.success) throw new Error('not found');
        const card = cardJson.data;

        const bankRes = await apiFetch(`/api/v1/banks/${card.bank_id}`);
        const bankJson = await bankRes.json();
        const bankName: string = bankJson.success ? (bankJson.data.name ?? '') : '';
        const brandColor: string | undefined = bankJson.success ? bankJson.data.brand_color : undefined;

        const rawImageUrl = card.image?.url ?? null;

        // Pre-fetch the card image and convert to data URL so ImageResponse
        // doesn't make a slow remote fetch (avoids ~35s timeout).
        let cardImageUrl: string | null = null;
        if (rawImageUrl) {
            try {
                const imgRes = await fetch(`${rawImageUrl}?format=png`);
                const buf = await imgRes.arrayBuffer();
                cardImageUrl = `data:image/png;base64,${Buffer.from(buf).toString('base64')}`;
            } catch {
                cardImageUrl = null;
            }
        }


        const types = card.card_type as string[];
        const cardType = types.includes('credit') && types.includes('debit')
            ? 'Thẻ hybrid'
            : types.includes('credit')
                ? 'Thẻ tín dụng'
                : 'Thẻ ghi nợ';
        const description = [cardType, card.card_network?.toUpperCase()]
            .filter(Boolean)
            .join(' · ');

        const isVertical = card.image?.orientation === 'vertical';

        // Title matches page generateMetadata: card.name
        return createCardOgImage({
            title: card.name,
            description,
            cardImageUrl: cardImageUrl ? cardImageUrl : '',
            isVertical,
            accentColor: brandColor,
        });
    } catch {
        return createOgImage({title: slug, description: 'Open Wallet · The ngan hang'});
    }
}
