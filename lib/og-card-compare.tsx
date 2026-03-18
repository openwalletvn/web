import {ImageResponse} from 'next/og';
import {OG_SIZE} from '@/lib/og-card';

interface CompareOgImageOptions {
    titleA: string;
    titleB: string;
    imageUrlA: string;
    imageUrlB: string;
    isVerticalA?: boolean;
    isVerticalB?: boolean;
}

export function createCompareOgImage({
    titleA,
    titleB,
    imageUrlA,
    imageUrlB,
    isVerticalA = false,
    isVerticalB = false,
}: CompareOgImageOptions) {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    backgroundColor: '#0f172a',
                    position: 'relative',
                }}
            >

                {/* Card A — left half */}
                {imageUrlA && isVerticalA ? (
                    <>
                        <img src={imageUrlA} style={{
                            objectFit: 'contain',
                            position: 'absolute',
                            bottom: '20px',
                            left: '100px',
                            width: '460px',
                            height: '570px',
                            transform: 'rotate(8deg)',
                        }} alt="" />
                    </>
                ) : (
                    <>
                        <img src={imageUrlA} style={{
                            objectFit: 'contain',
                            position: 'absolute',
                            left: '-20px',
                            bottom: '30px',
                            width: '550px',
                            height: '550px',
                            transform: 'rotate(5deg)',
                        }} alt="" />
                    </>
                )}



                {/* Card B — right half */}
                {imageUrlB && isVerticalB ? (
                    <>
                        <img src={imageUrlB} style={{
                            objectFit: 'contain',
                            position: 'absolute',
                            bottom: '30px',
                            left: '650px',
                            width: '460px',
                            height: '570px',
                            transform: 'rotate(-8deg)',
                        }} alt="" />
                    </>
                ) : (
                    <>
                        <img src={imageUrlB} style={{
                            objectFit: 'contain',
                            position: 'absolute',
                            left: '680px',
                            bottom: '30px',
                            width: '550px',
                            height: '550px',
                            transform: 'rotate(-5deg)',
                        }} alt="" />
                    </>
                )}


                {/* "vs" centered */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'rgba(255,255,255,1)',
                        fontSize: '96px',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                    }}
                >
                    vs
                </div>

                {/* Gradient bottom accent line */}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '160px',
                        backgroundImage: 'linear-gradient(to top, rgba(15, 23, 42, 1), rgba(30, 41, 59, 0))',//'#dc2626',
                    }}
                />


                {/* Site name - top-left */}
                {isVerticalA ?
                    <div
                        style={{
                            position: 'absolute',
                            top: '100px',
                            left: '-50px',
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '26px',
                            fontWeight: 800,
                            transform: 'rotate(-90deg) translate(0,0)',
                            letterSpacing: '0.02em',
                        }}
                    >
                        OpenWallet.vn
                    </div> :
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '30px',
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '26px',
                            fontWeight: 800,
                            letterSpacing: '0.02em',
                        }}
                    >
                        OpenWallet.vn
                    </div>
                }

                {/* Card B name — bottom-right */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        right: '48px',
                        color: '#fff',
                        fontSize: '32px',
                        fontWeight: 700,
                    }}
                >
                    {titleB}
                </div>

                {/* Card A name — bottom-left */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '48px',
                        color: '#fff',
                        fontSize: '32px',
                        fontWeight: 700,
                    }}
                >
                    {titleA}
                </div>
            </div>
        ),
        OG_SIZE,
    );
}
