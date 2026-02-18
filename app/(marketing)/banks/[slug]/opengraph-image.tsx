import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const res = await fetch(`${apiUrl}/api/v1/banks/${slug}`, { cache: 'force-cache' });
    const json = await res.json();
    if (!json.success) throw new Error('Bank not found');
    const bank = json.data;

    const logoUrl = bank.logo_url ? `${apiUrl}${bank.logo_url}` : null;

    // Verify logo is reachable
    let logoOk = false;
    if (logoUrl) {
      try {
        const probe = await fetch(logoUrl, { method: 'HEAD', cache: 'force-cache' });
        logoOk = probe.ok;
      } catch {
        logoOk = false;
      }
    }

    return new ImageResponse(
      (
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
          {/* Left accent bar */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', backgroundColor: '#DC2626' }} />

          {/* Top: wordmark */}
          <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 700 }}>
            Open<span style={{ color: '#DC2626' }}>Wallet</span>
          </div>

          {/* Center: logo + bank name */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '32px',
            }}
          >
            {logoOk && logoUrl && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '200px',
                  height: '200px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '20px',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt=""
                  style={{ width: '160px', height: '160px', objectFit: 'contain' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  color: '#FFFFFF',
                  fontSize: '56px',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-1.5px',
                  maxWidth: '900px',
                }}
              >
                {bank.full_name || bank.name}
              </div>
              <div style={{ color: '#94A3B8', fontSize: '26px', lineHeight: 1.4 }}>
                Xem tất cả thẻ của {bank.name} trên OpenWallet Vietnam
              </div>
            </div>
          </div>
        </div>
      ),
      { ...size },
    );
  } catch {
    // Fallback
    return new ImageResponse(
      (
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
            <div style={{ color: '#FFFFFF', fontSize: '64px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-2px' }}>
              {slug}
            </div>
            <div style={{ color: '#94A3B8', fontSize: '26px' }}>
              Xem thẻ ngân hàng trên OpenWallet Vietnam
            </div>
          </div>
        </div>
      ),
      { ...size },
    );
  }
}
