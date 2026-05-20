import type {Metadata} from 'next';
import {getBanks, getCards, getIntents} from '@/lib/api';
import {RecommendationFinder} from '@/components/marketing/recommendation-finder';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';

export const metadata: Metadata = {
    title: 'Gợi ý thẻ phù hợp | OpenWallet',
    description: 'Tìm thẻ ngân hàng phù hợp nhất với thói quen chi tiêu của bạn. Chọn danh mục, nhập mức chi tiêu và nhận đề xuất cá nhân hoá ngay.',
    openGraph: {
        title: 'Gợi ý thẻ phù hợp',
        description: 'Tìm thẻ ngân hàng phù hợp nhất với thói quen chi tiêu của bạn.',
        url: 'https://openwallet.vn/goi-y-the',
    },
};

export default async function GoiYThePage() {
    const [cards, banks, intents] = await Promise.all([
        getCards().catch(() => []),
        getBanks().catch(() => []),
        getIntents().catch(() => []),
    ]);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                name: 'Gợi ý thẻ phù hợp',
                url: 'https://openwallet.vn/goi-y-the',
                description: 'Tìm thẻ ngân hàng phù hợp nhất với thói quen chi tiêu của bạn.',
            },
            buildBreadcrumbJsonLd([
                {label: 'Trang chủ', href: '/'},
                {label: 'Gợi ý thẻ', href: '/goi-y-the'},
            ]),
        ],
    };

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <div className="ow-container py-12">
                <RecommendationFinder cards={cards} banks={banks} intents={intents}/>
            </div>
        </div>
    );
}
