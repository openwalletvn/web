import { createOgImage, OG_SIZE } from '@/lib/og';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${apiUrl}/api/v1/cards`);
    const json = await res.json();
    if (!json.success) return [];
    return json.data.map((card: { id: string }) => ({ slug: card.id }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const cardRes = await fetch(`${apiUrl}/api/v1/cards/${slug}`);
    const cardJson = await cardRes.json();
    if (!cardJson.success) throw new Error('not found');
    const card = cardJson.data;

    const bankRes = await fetch(`${apiUrl}/api/v1/banks/${card.bank_id}`);
    const bankJson = await bankRes.json();
    const bankName: string = bankJson.success ? (bankJson.data.name ?? '') : '';

    const cardImageUrl = card.image?.url ?? null;

    const description = [bankName, card.card_network?.toUpperCase(), ...card.card_type]
      .filter(Boolean)
      .join(' · ');

    // Title matches page generateMetadata: card.name
    return createOgImage({
      title: card.name,
      description,
      rightSlot: cardImageUrl ? (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', width: '360px', height: '500px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${cardImageUrl}?format=png`}
            alt=""
            width={360}
            height={460}
            style={{ objectFit: 'contain', borderRadius: '12px' }}
          />
        </div>
      ) : undefined,
    });
  } catch {
    return createOgImage({ title: slug, description: 'Open Wallet · The ngan hang' });
  }
}
