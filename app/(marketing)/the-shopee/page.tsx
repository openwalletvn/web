import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';

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
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <Breadcrumbs items={breadcrumbItems}/>

                <h1 className="mb-2">{TITLE}</h1>
                <p className="text-slate-500 mb-8">{DESCRIPTION}</p>

                <CardRankingTable
                    cards={cards}
                    banks={banks}
                    intentSlug="shopee"
                    title="Xếp hạng thẻ theo cashback Shopee"
                />
            </div>
        </div>
    );
}
