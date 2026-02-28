import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
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
    const [allCards, banks, t] = await Promise.all([
        getCards(),
        getBanks(),
        getTranslations('CardsPage'),
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

                <h1 className="text-4xl font-bold text-slate-900 mb-6">{t('title')}</h1>

                <CardsGrid
                    cards={allCards}
                    banks={banks}
                    noCardsLabel={t('no_cards')}
                    useUrlState={true}
                />
            </div>
        </div>
    );
}
