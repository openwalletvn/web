import Image from 'next/image';
import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import {CheckCircle, CreditCard, Settings} from 'lucide-react';

export async function HeroSection({cardCount, bankCount}: { cardCount: number; bankCount: number }) {
    const hero = await getTranslations('hero');

    return (
        <section
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-16 overflow-hidden">

            {/* Heading */}
            <h1 className="text-[clamp(2.8rem,7vw,5rem)] font-bold text-black leading-[1.05] tracking-tight text-center mb-10 px-4">
                Tra cứu thẻ.<br/>So sánh thẻ.
            </h1>

            {/*
                3-col grid: [left] [phone] [right]
                Floats live in left/right columns — never touch the phone.
                Mobile: collapses to phone only + stat row below.
            */}
            <div
                className="w-full max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[180px_1fr_180px] lg:grid-cols-[210px_1fr_210px] gap-4 items-center">

                {/* ── LEFT COLUMN ── */}
                <div className="hidden md:flex flex-col items-end justify-center gap-6 h-full py-8">

                    {/* 100+ cards badge (orange) */}
                    <div
                        className="flex items-center gap-2 bg-primary text-white rounded-2xl px-3 py-2.5 shadow-lg self-end">
                        <CreditCard className="w-5 h-5 shrink-0 opacity-90"/>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-bold leading-none">{cardCount}+</span>
                            <span className="text-[10px] opacity-80 mt-0.5">thẻ ngân hàng</span>
                        </div>
                    </div>

                    {/* 2 stacked card images */}
                    <div className="flex flex-col gap-2 items-end">
                        <Image
                            src="/cards/msb-visa-online.avif"
                            alt="MSB Visa Online"
                            width={130}
                            height={82}
                            className="rounded-xl shadow-lg object-cover rotate-[-5deg]"
                        />
                        <Image
                            src="/cards/sacombank-uniq.avif"
                            alt="Sacombank Uniq"
                            width={114}
                            height={72}
                            className="rounded-xl shadow-lg object-cover rotate-[4deg] mr-2"
                        />
                    </div>
                </div>

                {/* ── CENTER: phone ── */}
                <div className="flex justify-center">
                    <Image
                        src="/hero-mockup.png"
                        alt="Open Wallet app on phone"
                        width={320}
                        height={570}
                        className="w-full max-w-[220px] sm:max-w-[280px] md:max-w-full h-auto object-contain drop-shadow-xl"
                        priority
                    />
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="hidden md:flex flex-col items-start justify-center gap-6 h-full py-8">

                    {/* 25+ banks badge (white) */}
                    <div
                        className="flex items-center gap-2.5 bg-white border border-border rounded-2xl px-3 py-2.5 shadow-md">
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-bold text-black leading-none">{bankCount}+</span>
                            <span className="text-[10px] text-text-muted mt-0.5">ngân hàng</span>
                        </div>
                        <Settings className="w-4 h-4 text-text-subtle shrink-0"/>
                        {/*<Image*/}
                        {/*    src="/cards/kbank-cashback-plus.avif"*/}
                        {/*    alt="KBank"*/}
                        {/*    width={52}*/}
                        {/*    height={33}*/}
                        {/*    className="rounded-md object-cover"*/}
                        {/*/>*/}
                    </div>

                    {/* 100% free badge (white + orange icon) */}
                    <div
                        className="flex items-center gap-2.5 bg-white border border-border rounded-2xl px-3 py-2.5 shadow-md">
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-bold text-black leading-none">100%</span>
                            <span className="text-[10px] text-text-muted mt-0.5">miễn phí</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 text-white"/>
                        </div>
                    </div>

                    {/* Extra card + label */}
                    <div className="flex flex-col items-start gap-1">
                        <Image
                            src="/cards/woori-vv-hype-point-gold.avif"
                            alt="Woori Card"
                            width={100}
                            height={63}
                            className="rounded-xl shadow-md object-cover rotate-[3deg]"
                        />
                        {/*<span className="text-[10px] text-text-subtle pl-1">Mở Ví thẻ</span>*/}
                    </div>
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
