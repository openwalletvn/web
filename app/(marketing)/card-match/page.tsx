import type {Metadata} from 'next';
import {getIntents, getPersonas} from '@/lib/api';
import {CardMatchFinder} from '@/components/match/card-match-finder';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';
import {getTool} from '@/lib/tools';
import {buildTitle} from '@/lib/page-meta/title';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';

export const revalidate = 3600;

const BASE_URL = 'https://openwallet.vn';
const tool = getTool('Card Match');

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Card Match'},
];

export const metadata: Metadata = {
    title: buildTitle('Card Match'),
    description: 'Tìm thẻ ngân hàng phù hợp nhất với thói quen chi tiêu của bạn. Chọn danh mục, nhập mức chi tiêu và nhận đề xuất cá nhân hoá ngay.',
    openGraph: {
        title: 'Card Match',
        description: 'Tìm thẻ ngân hàng phù hợp nhất với thói quen chi tiêu của bạn.',
        url: `${BASE_URL}${tool.href}`,
    },
};

export default async function CardMatchPage() {
    const [personas, intents] = await Promise.all([
        getPersonas().catch(() => []),
        getIntents().catch(() => []),
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
            buildBreadcrumbJsonLd(BREADCRUMB_ITEMS),
        ],
    };

    return (
        <MarketingPageShell title="Card Match" breadcrumbItems={BREADCRUMB_ITEMS} jsonLd={jsonLd}>
            <CardMatchFinder personas={personas} intents={intents}/>
        </MarketingPageShell>
    );
}
