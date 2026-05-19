import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

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
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <Breadcrumbs items={breadcrumbItems}/>

                <h1 className="mb-6">Thẻ ngân hàng</h1>

                <CardsGrid
                    cards={allCards}
                    banks={banks}
                    noCardsLabel='Không tìm thấy thẻ nào.'
                    useUrlState={true}
                />
            </div>
        </div>
    );
}
