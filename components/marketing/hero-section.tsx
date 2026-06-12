import Image from 'next/image';
import Link from 'next/link';
import {IconCircleCheck, IconCreditCard, IconSettings} from '@tabler/icons-react';
import {ROUTES} from '@/lib/routes';
import {OwBadgeNumberIcon} from '@/components/owui/ow-badge-number-icon';
import {OwCardImage} from '@/components/owui/ow-card-image';
import {OwButton} from '@/components/owui/ow-button';
import {OpenOwieButton} from '@/components/chat/open-owie-button';

export function HeroSection({cardCount, bankCount}: { cardCount: number; bankCount: number }) {
    return (
        <section
            className="ow-hero-section relative z-20 w-full flex flex-col items-center justify-center overflow-hidden bg-[#F7F7F7] lg:pt-32 pt-16 lg:pb-16 pb-16 rounded-tl-[15px] rounded-tr-[15px]"
            style={{clipPath: 'url(#hero-clip)'}}>

            <svg width="0" height="0" aria-hidden="true" style={{position: 'absolute'}}>
                <defs>
                    <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
                        <path d="M0 0H1V0.820849C1 0.827481 0.996542 0.833279 0.991584 0.834960L0.510200 0.997934C0.504609 0.999918 0.498734 0.999927 0.493139 0.998042L0.008433 0.835218C0.003467 0.833548 0 0.827017 0 0.820830Z"/>
                    </clipPath>
                </defs>
            </svg>

            {/* Heading */}
            <h1 className="heading-1 text-center mb-10 px-4 relative z-20">
                OpenWallet<br/>Which card fits you?
            </h1>

            {/*
                3-col grid: [left] [phone] [right]
                Floats live in left/right columns - never touch the phone.
                Mobile: collapses to phone only + stat row below.
            */}
            <div
                className="w-full h-85 md:h-150 lg:h-175 flex justify-center px-6 relative">

                {/* ── LEFT COLUMN ── */}
                <div className="hidden md:block w-60 lg:w-[320px] h-125 relative">

                    {/* 100+ cards badge (orange) */}
                    <div className="absolute top-0 right-0">
                        <OwBadgeNumberIcon
                            iconPosition="left"
                            number={`${cardCount}+`}
                            icon={IconCreditCard}
                            text="Thẻ ngân hàng"
                        />
                    </div>

                    <OwCardImage
                        src="/the/sacombank-uniq.avif"
                        alt="Sacombank Uniq"
                        width={72}
                        height={114}
                        tilt={true}
                        className="w-[128px] absolute top-1/4 left-0"
                    />
                    <OwCardImage
                        src="/the/msb-visa-online.avif"
                        alt="MSB Visa Online"
                        width={130}
                        height={82}
                        tilt={true}
                        className="w-[160px] absolute bottom-0 right-[10%]"
                    />
                </div>

                {/* ── CENTER: phone ── */}
                <div
                    className="w-full max-w-[320px] md:max-w-[480px] lg:max-w-[620px] aspect-square relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[200px] before:bg-gradient-to-t before:from-[#F7F7F7] before:to-transparent before:z-10">
                    <Image
                        src="/hero-mockup.png"
                        alt="OpenWallet app on phone"
                        width={1200}
                        height={1200}
                        className="w-full h-full object-contain"
                        priority
                    />
                </div>

                <div
                    className="ow-headline z-20 absolute left-1/2 -translate-x-1/2 md:top-1/2 max-md:bottom-0 w-full md:max-w-[500px] max-w-[320px] flex items-center justify-center md:p-6 p-4 bg-[rgba(124,124,124,0.4)] border border-[rgba(236,236,236,0.3)] backdrop-blur-[14px] rounded-full">
                    <p className="font-body font-medium md:text-[22px] leading-[130%] text-white text-center">
                      Không cần lướt hàng chục trang web. <span className="inline-block">Gợi ý khách quan theo nhu cầu của bạn.</span>
                    </p>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="hidden md:block w-[240px] lg:w-[320px] h-[500px] relative">

                    {/* 25+ banks badge */}
                    <div className="absolute top-[6%] left-0">
                        <OwBadgeNumberIcon
                            iconPosition="right"
                            color="black"
                            number={`${bankCount}+`}
                            icon={IconSettings}
                            text="ngân hàng"
                        />
                    </div>

                    <div className="absolute bottom-[5%] left-[5%]">
                    <OwBadgeNumberIcon
                        iconPosition="right"
                        number="100%"
                        icon={IconCircleCheck}
                        text="độc lập"
                    />
                    </div>

                    <OwCardImage
                        src="/the/woori-vv-hype-point-gold.avif"
                        alt="Woori Card"
                        width={63}
                        height={100}
                        tilt={true}
                        className="w-[110px] absolute top-[30%] right-[5%]"
                    />
                </div>
            </div>

            {/* Mobile stat row */}
            <div className="flex md:hidden flex-wrap justify-center items-center gap-3 mt-4 mb-6">
                <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1.5">
                    <span className="text-sm font-bold text-primary">{cardCount}+</span>
                    <span className="text-xs text-text-muted">thẻ</span>
                </div>
                <div className="flex items-center gap-1.5 bg-bg-muted rounded-full px-3 py-1.5">
                    <span className="text-sm font-bold text-black">{bankCount}+</span>
                    <span className="text-xs text-text-muted">ngân hàng</span>
                </div>
                <div className="flex items-center gap-1.5 bg-bg-muted rounded-full px-3 py-1.5">
                    <span className="text-sm font-bold text-black">100%</span>
                    <span className="text-xs text-text-muted">độc lập</span>
                </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 items-center mt-6 mb-4 relative z-20">
                <OwButton asChild color="default" className="min-w-40">
                    <Link href={ROUTES.cardMatch}>Tìm thẻ phù hợp</Link>
                </OwButton>
                <OpenOwieButton className="min-w-40" color="outline"/>
            </div>
        </section>
    );
}
