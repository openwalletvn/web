// import Link from 'next/link';
import {Suspense} from 'react';
// import {getTranslations} from 'next-intl/server';
import {getBanks, getCards} from '@/lib/api';
import {BanksSection, BanksSectionSkeleton} from './_components/banks-section';
import {CardsSection, CardsSectionSkeleton} from '@/components/cards/cards-section';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';
import {HeroSection} from './_components/hero-section';

export default async function HomePage() {
    const [banks, cards] = await Promise.all([
        getBanks().catch(() => []),
        getCards().catch(() => []),
    ]);
    // const [hero, heroTitle, banks, cards] = await Promise.all([
    //     getTranslations('hero'),
    //     getTranslations('Hero'),
    //     getBanks().catch(() => []),
    //     getCards().catch(() => []),
    // ]);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                name: 'Open Wallet',
                url: 'https://openwallet.vn',
                description: 'Tra cứu thông tin thẻ ngân hàng Việt Nam và quản lý ngày sao kê, nhắc hạn thanh toán. Miễn phí, bảo mật, mã nguồn mở.',
            },
            {
                '@type': 'Organization',
                name: 'Open Wallet',
                url: 'https://openwallet.vn',
                logo: 'https://openwallet.vn/logo.png',
                description: 'Nguồn dữ liệu thẻ ngân hàng Việt Nam mã nguồn mở.',
            },
            buildBreadcrumbJsonLd([{label: 'Trang chủ', href: '/'}]),
        ],
    };

    return (
        <div className="flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />

            {/* Hero */}
            <HeroSection cardCount={cards.length} bankCount={banks.length} />

            {/* OLD HERO — kept for reference
            <section className="w-full min-h-[calc(100vh-4rem)] flex items-center py-20">
                <div className="max-w-container px-4 mx-auto w-full grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center">
                    <div>
                        <img src="/logo.png" alt="Open Wallet" className="h-16 w-16 mb-8" />
                        <h1 className="text-7xl md:text-8xl font-bold text-slate-900 leading-none mb-6">
                            {heroTitle('title')}
                        </h1>
                        <div className="border-t border-dashed border-slate-300 mb-6"/>
                        <p className="text-2xl font-medium text-slate-700 mb-2">{hero('tagline')}</p>
                        <p className="text-base text-slate-500 mb-10">{hero('subtext')}</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="border-l-2 border-dashed border-brand-blue bg-blue-50/40 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-1">{hero('app.title')}</h2>
                            <p className="text-base text-slate-500 mb-5">{hero('app.description')}</p>
                            <Link href="/app" className="text-base font-semibold text-brand-blue hover:underline underline-offset-4">
                                {hero('app.ctanow')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            */}

            {/* Banks section */}
            <div className="border-t border-dashed border-slate-200">
                <Suspense fallback={<BanksSectionSkeleton/>}>
                    <BanksSection limit={10} showViewAll/>
                </Suspense>
            </div>

            {/* Cards section */}
            <div className="border-t border-dashed border-slate-200">
                <Suspense fallback={<CardsSectionSkeleton/>}>
                    <CardsSection limit={10} showViewAll/>
                </Suspense>
            </div>
        </div>
    );
}
