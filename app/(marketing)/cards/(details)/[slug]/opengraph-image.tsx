import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Shared fallback layout
function FallbackImage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#0F172A',
        padding: '60px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', backgroundColor: '#DC2626' }} />
      <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 700 }}>
        Open<span style={{ color: '#DC2626' }}>Wallet</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ color: '#FFFFFF', fontSize: '60px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-2px', maxWidth: '900px' }}>
          {title}
        </div>
        <div style={{ color: '#94A3B8', fontSize: '26px' }}>{subtitle}</div>
      </div>
    </div>
  );
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const [cardRes, ] = await Promise.all([
      fetch(`${apiUrl}/api/v1/cards/${slug}`, { cache: 'force-cache' }),
    ]);

    const cardJson = await cardRes.json();
    if (!cardJson.success) throw new Error('Card not found');
    const card = cardJson.data;

    const bankRes = await fetch(`${apiUrl}/api/v1/banks/${card.bank_id}`, { cache: 'force-cache' });
    const bankJson = await bankRes.json();
    const bank = bankJson.success ? bankJson.data : null;

    const imagePath =
      card.image_orientation === 'vertical' ? card.image_vertical_url : card.image_horizontal_url;
    const cardImageUrl = imagePath ? `${apiUrl}${imagePath}` : null;

    // Verify card image is reachable before including it
    let imageOk = false;
    if (cardImageUrl) {
      try {
        const probe = await fetch(cardImageUrl, { method: 'HEAD', cache: 'force-cache' });
        imageOk = probe.ok;
      } catch {
        imageOk = false;
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0F172A',
            padding: '60px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* Left accent bar */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', backgroundColor: '#DC2626' }} />

          {/* Left: text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              flex: 1,
              paddingRight: imageOk ? '60px' : '0',
            }}
          >
            {/* Wordmark */}
            <div style={{ color: '#94A3B8', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.3px' }}>
              Open<span style={{ color: '#DC2626' }}>Wallet</span>
            </div>

            {/* Bank name */}
            {bank && (
              <div style={{ color: '#64748B', fontSize: '26px', fontWeight: 500 }}>
                {bank.full_name || bank.name}
              </div>
            )}

            {/* Card name */}
            <div
              style={{
                color: '#FFFFFF',
                fontSize: '54px',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-1.5px',
                maxWidth: '680px',
              }}
            >
              {card.name}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span
                style={{
                  color: '#2563EB',
                  border: '1.5px dashed #2563EB',
                  padding: '6px 16px',
                  fontSize: '18px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 600,
                }}
              >
                {card.card_network}
              </span>
              {card.card_type.map((type: string) => (
                <span
                  key={type}
                  style={{
                    color: '#94A3B8',
                    border: '1.5px dashed #334155',
                    padding: '6px 16px',
                    fontSize: '18px',
                    borderRadius: '4px',
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Right: card image */}
          {imageOk && cardImageUrl && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '420px',
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cardImageUrl}
                alt=""
                style={{
                  maxWidth: '400px',
                  maxHeight: '480px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                }}
              />
            </div>
          )}
        </div>
      ),
      { ...size },
    );
  } catch {
    return new ImageResponse(
      <FallbackImage title={slug} subtitle="Xem thẻ trên OpenWallet Vietnam" />,
      { ...size },
    );
  }
}
