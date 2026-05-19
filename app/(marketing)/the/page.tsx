import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ'},
];

export async function generateMetadata(): Promise<Metadata> {
    const cards = await getCards();
    const {metadata} = buildCollectionPageMeta({
        title: 'Thẻ ngân hàng | Open Wallet',
        description: 'Danh sách tất cả các thẻ ngân hàng Việt Nam trên Open Wallet.',
        url: '/the',
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function CardsPage() {
    const [allCards, banks] = await Promise.all([
        getCards(),
        getBanks(),
    ]);

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: 'Thẻ ngân hàng | Open Wallet',
        description: 'Danh sách tất cả các thẻ ngân hàng Việt Nam trên Open Wallet.',
        url: '/the',
        items: allCards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    return (
        <MarketingPageShell title="Thẻ ngân hàng" breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <CardsGrid
                cards={allCards}
                banks={banks}
                noCardsLabel='Không tìm thấy thẻ nào.'
                useUrlState={true}
            />
        </MarketingPageShell>
    );
}
