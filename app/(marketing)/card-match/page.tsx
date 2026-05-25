import type {Metadata} from 'next';
import {getIntents, getIntentGroups} from '@/lib/api';
import {RecommendationFinder} from '@/components/marketing/recommendation-finder';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';
import {getTool} from '@/lib/tools';

const BASE_URL = 'https://openwallet.vn';
const tool = getTool('Card Match');

export const metadata: Metadata = {
    title: 'Card Match | OpenWallet',
    description: 'Tìm thẻ ngân hàng phù hợp nhất với thói quen chi tiêu của bạn. Chọn danh mục, nhập mức chi tiêu và nhận đề xuất cá nhân hoá ngay.',
    openGraph: {
        title: 'Card Match',
        description: 'Tìm thẻ ngân hàng phù hợp nhất với thói quen chi tiêu của bạn.',
        url: `${BASE_URL}${tool.href}`,
    },
};

export default async function CardMatchPage() {
    const [intents, intentGroups] = await Promise.all([
        getIntents().catch(() => []),
        getIntentGroups().catch(() => []),
    ]);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                name: 'Card Match',
                url: `${BASE_URL}${tool.href}`,
                description: 'Tìm thẻ ngân hàng phù hợp nhất với thói quen chi tiêu của bạn.',
            },
            buildBreadcrumbJsonLd([
                {label: 'Trang chủ', href: '/'},
                {label: 'Card Match', href: tool.href},
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
                <RecommendationFinder intents={intents} intentGroups={intentGroups}/>
            </div>
        </div>
    );
}
