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
                {/* Gradient bottom accent line */}
                <div
                    style={{
                        position: 'absolute',
                        left: '-200px',
                        right: 0,
                        top: '-220px',
                        height: '1200px',
                        width: '1500px',
                        transform: 'rotate(-25deg)',
                        backgroundImage: 'linear-gradient(to bottom, rgba(220, 38, 30, .7),  rgba(0,0,0,0))',//'#dc2626',
                    }}
                />


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
                        paddingBottom: '10px',
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
                        gap: '10px',
                    }}>

                        {/* Description */}
                        {description && (
                            <div
                                style={{
                                    color: 'rgba(255,255,255,0.72)',
                                    fontSize: '26px',
                                    lineHeight: 1.45,
                                    maxWidth: '560px',
                                }}
                            >
                                {description}
                            </div>
                        )}
                        {/* Title */}
                        <div
                            style={{
                                color: '#fff',
                                fontSize: '80px',
                                fontWeight: 700,
                                lineHeight: 1.05,
                                maxWidth: '560px',
                            }}
                        >
                            {title}
                        </div>
                    </div>
                    <div></div>
                </div>

                {/* Right slot - anchored to bottom-right */}
                {
                    cardImageUrl && isVertical ?
                        // vertical - two cards fanned out, no wrapper div (Satori collapses zero-size flex containers)
                        <>
                            <img src={cardImageUrl} style={
                                {
                                    objectFit: 'contain',
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '100px',
                                    width: '440px',
                                    height: '550px',
                                    transform: 'rotate(-25deg)',
                                    opacity: '0.9'
                                }
                            } alt=""/>
                            <img src={cardImageUrl} style={
                                {
                                    objectFit: 'contain',
                                    position: 'absolute',
                                    bottom: '-10px',
                                    right: '60px',
                                    width: '460px',
                                    height: '570px',
                                    transform: 'rotate(-8deg)',
                                }
                            } alt=""/>
                        </>
                        :
                        // horizontal
                        <>
                            <img src={cardImageUrl} style={
                                {
                                    objectFit: 'contain',
                                    position: 'absolute',
                                    right: '0px',
                                    bottom: '60px',
                                    width: '520px',
                                    height: '550px',
                                    transform: 'rotate(10deg)',
                                    opacity: '0.9'
                                }
                            } alt=""/>
                            <img src={cardImageUrl} style={
                                {
                                    objectFit: 'contain',
                                    position: 'absolute',
                                    right: '-10px',
                                    bottom: '-20px',
                                    width: '550px',
                                    height: '550px',
                                    transform: 'rotate(-5deg)'
                                }
                            } alt=""/>
                        </>
                }
            </div>
        ),
        OG_SIZE,
    );
}
