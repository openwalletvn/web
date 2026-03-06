import {ImageResponse} from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

interface OgImageOptions {
    title: string;
    description?: string;
    isVertical?: boolean;
    cardImageUrl: string
}

export function createCardOgImage({title, description, cardImageUrl, isVertical = false}: OgImageOptions) {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    backgroundColor: '#0f172a',
                    padding: '40px',
                    position: 'relative',
                }}
            >
                {/* Left: title + description, anchored to bottom-left */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        gap: '16px',
                        flex: 1,
                        paddingRight: '48px',
                    }}
                >
                    {/* Site name - top-left, absolute so it doesn't affect bottom alignment */}
                    <div
                        style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '26px',
                            fontWeight: 800,
                            letterSpacing: '0.02em',
                        }}
                    >
                        OpenWallet.vn
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}>
                        {/* Title */}
                        <div
                            style={{
                                color: '#fff',
                                fontSize: '80px',
                                fontWeight: 700,
                                lineHeight: 1.05,
                                maxWidth: '620px',
                            }}
                        >
                            {title}
                        </div>

                        {/* Description */}
                        {description && (
                            <div
                                style={{
                                    color: 'rgba(255,255,255,0.72)',
                                    fontSize: '26px',
                                    lineHeight: 1.45,
                                    maxWidth: '580px',
                                }}
                            >
                                {description}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right slot - anchored to bottom-right */}
                {
                    cardImageUrl && isVertical ?
                        // vertical
                        <img src={cardImageUrl} style={
                            {
                                objectFit: 'contain',
                                position: 'absolute',
                                top: '0',
                                right: '160px',
                                bottom: '0',
                                width: '360px',
                                height: 'auto',
                                aspectRatio: '500/800',
                                transform: 'rotate(-15deg)'
                            }
                        } alt=""/>
                        :
                        // horizontal
                        <img src={cardImageUrl} style={
                            {
                                objectFit: 'contain',
                                position: 'absolute',
                                top: '0',
                                right: '-20px',
                                bottom: '0',
                                width: '600px',
                                height: 'auto',
                                aspectRatio: '800/500',
                                transform: 'rotate(-15deg)'
                            }
                        } alt=""/>
                }
            </div>
        ),
        OG_SIZE,
    );
}
