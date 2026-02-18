import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '6px',
            backgroundColor: '#DC2626',
          }}
        />

        {/* Top: wordmark */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '26px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            Open
            <span style={{ color: '#DC2626' }}>Wallet</span>
          </span>
        </div>

        {/* Bottom: title + description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              color: '#FFFFFF',
              fontSize: '64px',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-2px',
            }}
          >
            OpenWallet Vietnam
          </div>
          <div
            style={{
              color: '#94A3B8',
              fontSize: '26px',
              lineHeight: 1.4,
              maxWidth: '900px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
            }}
          >
            Tra cứu thẻ ngân hàng Việt Nam. Dữ liệu mở, miễn phí, không quảng cáo.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
