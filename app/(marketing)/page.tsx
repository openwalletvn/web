import {Suspense} from 'react';
import {getBanks, getCards, getIntents, getPersonas} from '@/lib/api';
import {BanksSection, BanksSectionSkeleton} from '@/components/marketing/banks-section';
import {CardsSection, CardsSectionSkeleton} from '@/components/cards/cards-section';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';
import {HeroSection} from '@/components/marketing/hero-section';
import {FeaturedCardCategories} from '@/components/marketing/featured-card-categories';
import {GradientShader} from "@/components/shared/gradient-shader";
import {CardMatchFinder} from '@/components/marketing/card-match-finder';

export default async function HomePage() {
    const [banks, cards, personas, intents] = await Promise.all([
        getBanks().catch(() => []),
        getCards().catch(() => []),
        getPersonas().catch(() => []),
        getIntents().catch(() => []),
    ]);

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

            <div className="relative">
                <GradientShader/>
                <div className="lg:p-3 p-2">
                    <HeroSection cardCount={cards.length} bankCount={banks.length}/>
                </div>
                <FeaturedCardCategories/>
            </div>

            <section className="border-t border-dashed border-border py-12">
                <div className="ow-container">
                    <CardMatchFinder personas={personas} intents={intents}/>
                </div>
            </section>

            <div className="hidden">
                <Suspense fallback={<BanksSectionSkeleton/>}>
                    <BanksSection limit={10} showViewAll/>
                </Suspense>
            </div>

            <div className="hidden border-t border-dashed border-border">
                <Suspense fallback={<CardsSectionSkeleton/>}>
                    <CardsSection limit={10} showViewAll/>
                </Suspense>
            </div>
        </div>
    );
}
