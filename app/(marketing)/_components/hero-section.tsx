import Image from 'next/image';
import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import {IconCircleCheck, IconCreditCard, IconSettings} from '@tabler/icons-react';
import {BadgeNumberIcon} from './badge-number-icon';
import {CardImageTag} from '@/components/cards/card-image-tag';

export async function HeroSection({cardCount, bankCount}: { cardCount: number; bankCount: number }) {
    const hero = await getTranslations('hero');

    return (
        <section
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-16 overflow-hidden">

            {/* Heading */}
            <h1 className="text-[clamp(2.8rem,7vw,5rem)] text-black leading-[1.05] tracking-hero text-center mb-10 px-4">
                Tra cứu thẻ.<br/>So sánh thẻ.
            </h1>

            {/*
                3-col grid: [left] [phone] [right]
                Floats live in left/right columns — never touch the phone.
                Mobile: collapses to phone only + stat row below.
            */}
            <div
                className="w-full h-[700px] flex justify-center">

                {/* ── LEFT COLUMN ── */}
                <div className="hidden md:block w-[320px] h-[500px] relative">

                    {/* 100+ cards badge (orange) */}
                    <div className="absolute top-0 right-0">
                        <BadgeNumberIcon
                            iconPosition="left"
                            number={`${cardCount}+`}
                            icon={IconCreditCard}
                            text="Thẻ ngân hàng"
                        />
                    </div>

                    <CardImageTag
                        src="/cards/sacombank-uniq.avif"
                        alt="Sacombank Uniq"
                        width={72}
                        height={114}
                        tilt={true}
                        className="w-[128px] absolute top-1/4 left-0"
                    />
                    <CardImageTag
                        src="/cards/msb-visa-online.avif"
                        alt="MSB Visa Online"
                        width={130}
                        height={82}
                        tilt={true}
                        className="w-[160px] absolute bottom-0 right-[10%]"
                    />
                </div>

                {/* ── CENTER: phone ── */}
                <div
                    className="w-[620px] aspect-[6/7] relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[200px] before:bg-gradient-to-t before:from-white before:to-transparent before:z-10">
                    <Image
                        src="/hero-mockup.png"
                        alt="Open Wallet app on phone"
                        width={320}
                        height={570}
                        className="w-full h-full object-contain"
                        priority
                    />
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="hidden md:block w-[320px] h-[500px] relative">

                    {/* 25+ banks badge */}
                    <div className="absolute top-[6%] left-0">
                        <BadgeNumberIcon
                            iconPosition="right"
                            color="black"
                            number={`${bankCount}+`}
                            icon={IconSettings}
                            text="ngân hàng"
                        />
                    </div>

                    <div className="absolute bottom-[5%] left-[5%]">
                    <BadgeNumberIcon
                        iconPosition="right"
                        number="100%"
                        icon={IconCircleCheck}
                        text="miễn phí"
                    />
                    </div>

                    <CardImageTag
                        src="/cards/woori-vv-hype-point-gold.avif"
                        alt="Woori Card"
                        width={63}
                        height={100}
                        tilt={true}
                        className="w-[110px] absolute top-[30%] right-[5%]"
                    />
                </div>
            </div>

            {/* Mobile stat row */}
            <div className="flex md:hidden items-center gap-3 mt-4 mb-6">
                <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1.5">
                    <span className="text-sm font-bold text-primary">{cardCount}+</span>
                    <span className="text-xs text-text-muted">thẻ</span>
                </div>
                <div className="w-px h-4 bg-border"/>
                <div className="flex items-center gap-1.5 bg-bg-muted rounded-full px-3 py-1.5">
                    <span className="text-sm font-bold text-black">{bankCount}+</span>
                    <span className="text-xs text-text-muted">ngân hàng</span>
                </div>
                <div className="w-px h-4 bg-border"/>
                <div className="flex items-center gap-1.5 bg-bg-muted rounded-full px-3 py-1.5">
                    <span className="text-sm font-bold text-black">100%</span>
                    <span className="text-xs text-text-muted">miễn phí</span>
                </div>
            </div>

            {/* CTA */}
            <div className="hidden flex-col sm:flex-row gap-3 items-center mt-2">
                <Link
                    href="/app"
                    className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-primary transition-colors"
                >
                    Tìm hiểu Thẻ Phú App
                </Link>
                <Link
                    href="/the"
                    className="text-sm font-medium text-text-muted hover:text-black transition-colors px-2 py-3"
                >
                    Khám phá thẻ →
                </Link>
            </div>
        </section>
    );
}
