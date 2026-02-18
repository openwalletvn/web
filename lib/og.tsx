import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

interface OgImageOptions {
  title: string;
  description?: string;
  /** Extra element rendered at the bottom-right (e.g. card/bank image) */
  rightSlot?: React.ReactNode;
}

export function createOgImage({ title, description, rightSlot }: OgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          backgroundColor: '#DC2626',
          padding: '0 72px 56px',
          position: 'relative',
        }}
      >
        {/* White bottom accent line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.4)',
          }}
        />

        {/* Site name — top-left, absolute so it doesn't affect bottom alignment */}
        <div
          style={{
            position: 'absolute',
            top: '56px',
            left: '72px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          Open Wallet
        </div>

        {/* Left: title + description, anchored to bottom-left */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
            paddingRight: rightSlot ? '48px' : '0',
          }}
        >
          {/* Title */}
          <div
            style={{
              color: '#FFFFFF',
              fontSize: '64px',
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: rightSlot ? '620px' : '1000px',
            }}
          >
            {title}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                color: 'rgba(255,255,255,0.72)',
                fontSize: '24px',
                lineHeight: 1.45,
                maxWidth: rightSlot ? '580px' : '860px',
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Right slot — anchored to bottom-right */}
        {rightSlot && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              flexShrink: 0,
            }}
          >
            {rightSlot}
          </div>
        )}
      </div>
    ),
    OG_SIZE,
  );
}
