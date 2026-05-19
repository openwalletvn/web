import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';

const TITLE = 'Thẻ Shopee';
const DESCRIPTION = 'Tra cứu tất cả thẻ tín dụng và ghi nợ liên kết Shopee từ các ngân hàng Việt Nam';
const URL = '/the-shopee';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: '/the'},
    {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
    const allCards = await getCards();
    const cards = allCards.filter((c) => c.co_brand === 'shopee' || c.intents?.includes('shopee'));
    const {metadata} = buildCollectionPageMeta({
        title: `${TITLE} | Open Wallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function ShopeeCardsPage() {
    const [allCards, banks] = await Promise.all([
        getCards(),
        getBanks(),
    ]);
    const cards = allCards.filter((c) => c.co_brand === 'shopee' || c.intents?.includes('shopee'));

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: `${TITLE} | Open Wallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return (
        <MarketingPageShell title={TITLE} description={DESCRIPTION} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <CardRankingTable
                cards={cards}
                banks={banks}
                intentSlug="shopee"
                title="Xếp hạng thẻ theo cashback Shopee"
            />
        </MarketingPageShell>
    );
}
