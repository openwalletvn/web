import type {Metadata} from 'next';
import {getBanks, getCards, getIntents, getPersonas} from '@/lib/api';
import {SITE_NAME} from '@/lib/page-meta/title';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';
import {GradientShader} from '@/components/shared/gradient-shader';
import {HeroSection} from '@/components/marketing/hero-section';
import {CardMatchSection} from '@/components/marketing/card-match-section';
import {CardsCatalogTeaser} from '@/components/marketing/cards-catalog-teaser';
import {ToolsSection} from '@/components/marketing/tools-section';
import {RecentPostsSection} from '@/components/marketing/recent-posts-section';

export const metadata: Metadata = {
    title: SITE_NAME,
    description: 'Tra cứu và so sánh thẻ ngân hàng Việt Nam. Tư vấn AI với Owie, dữ liệu thực, độc lập, không quảng cáo.',
};

export const revalidate = 3600;

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
                name: 'OpenWallet',
                url: 'https://openwallet.vn',
                description: 'Tra cứu và so sánh thẻ ngân hàng Việt Nam một cách độc lập và minh bạch. Thuật toán xếp hạng không bị chi phối bởi quan hệ thương mại với bất kỳ ngân hàng nào.',
            },
            {
                '@type': 'Organization',
                name: 'OpenWallet',
                url: 'https://openwallet.vn',
                logo: 'https://openwallet.vn/icon.png',
                description: 'Công cụ so sánh và tư vấn thẻ ngân hàng Việt Nam. Mã nguồn mở, độc lập về biên tập.',
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
            <div className="relative">
                <GradientShader/>
                <div className="lg:p-3 p-2">
                    <HeroSection cardCount={cards.length} bankCount={banks.length}/>
                </div>
                {/* Tools */}
                <ToolsSection/>
            </div>

            {/* Card Match */}
            <CardMatchSection personas={personas} intents={intents}/>

            {/* Cards catalog entry point */}
            <CardsCatalogTeaser cards={cards} banks={banks} totalCount={cards.length}/>

            {/* Blog */}
            <RecentPostsSection/>
        </div>
    );
}
