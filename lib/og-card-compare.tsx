import { ImageResponse } from 'next/og';
import { OG_SIZE } from '@/lib/og-card';

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
                {/* Red bottom accent line */}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '10px',
                        backgroundColor: '#dc2626',
                    }}
                />

                {/* Site name - top-left */}
                <div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        left: '48px',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '26px',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                    }}
                >
                    OpenWallet.vn
                </div>

                {/* "vs" centered */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'rgba(255,255,255,0.2)',
                        fontSize: '96px',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                    }}
                >
                    vs
                </div>

                {/* Card A — left half */}
                {imageUrlA && isVerticalA ? (
                    <>
                        <img src={imageUrlA} style={{
                            objectFit: 'contain',
                            position: 'absolute',
                            bottom: '10px',
                            left: '100px',
                            width: '440px',
                            height: '550px',
                            transform: 'rotate(25deg)',
                            opacity: '0.7',
                        }} alt="" />
                        <img src={imageUrlA} style={{
                            objectFit: 'contain',
                            position: 'absolute',
                            bottom: '-10px',
                            left: '60px',
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
                            left: '0px',
                            bottom: '60px',
                            width: '520px',
                            height: '550px',
                            transform: 'rotate(-10deg)',
                            opacity: '0.7',
                        }} alt="" />
                        <img src={imageUrlA} style={{
                            objectFit: 'contain',
                            position: 'absolute',
                            left: '-10px',
                            bottom: '-20px',
                            width: '550px',
                            height: '550px',
                            transform: 'rotate(5deg)',
                        }} alt="" />
                    </>
                )}

                {/* Card A name — bottom-left */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '48px',
                        color: '#ffffff',
                        fontSize: '32px',
                        fontWeight: 700,
                        maxWidth: '480px',
                    }}
                >
                    {titleA}
                </div>

                {/* Card B — right half */}
                {imageUrlB && isVerticalB ? (
                    <>
                        <img src={imageUrlB} style={{
                            objectFit: 'contain',
                            position: 'absolute',
                            bottom: '10px',
                            right: '100px',
                            width: '440px',
                            height: '550px',
                            transform: 'rotate(-25deg)',
                            opacity: '0.7',
                        }} alt="" />
                        <img src={imageUrlB} style={{
                            objectFit: 'contain',
                            position: 'absolute',
                            bottom: '-10px',
                            right: '60px',
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
                            right: '0px',
                            bottom: '60px',
                            width: '520px',
                            height: '550px',
                            transform: 'rotate(10deg)',
                            opacity: '0.7',
                        }} alt="" />
                        <img src={imageUrlB} style={{
                            objectFit: 'contain',
                            position: 'absolute',
                            right: '-10px',
                            bottom: '-20px',
                            width: '550px',
                            height: '550px',
                            transform: 'rotate(-5deg)',
                        }} alt="" />
                    </>
                )}

                {/* Card B name — bottom-right */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        right: '48px',
                        color: '#ffffff',
                        fontSize: '32px',
                        fontWeight: 700,
                        maxWidth: '480px',
                        textAlign: 'right',
                    }}
                >
                    {titleB}
                </div>
            </div>
        ),
        OG_SIZE,
    );
}
