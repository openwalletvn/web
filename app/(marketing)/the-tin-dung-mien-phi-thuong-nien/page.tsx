import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const TITLE = 'Thẻ Tín Dụng Miễn Phí Thường Niên';
const DESCRIPTION = 'Tra cứu tất cả thẻ tín dụng miễn phí thường niên từ các ngân hàng Việt Nam';
const URL = '/the-tin-dung-mien-phi-thuong-nien';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: '/the'},
    {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
    const allCards = await getCards();
    const cards = allCards.filter((c) => c.card_type.includes('credit') && c.fees?.annual?.amount === 0);
    const {metadata} = buildCollectionPageMeta({
        title: `${TITLE} | Open Wallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function CreditFreePage() {
    const [allCards, banks, t] = await Promise.all([
        getCards(),
        getBanks(),
        getTranslations('SeoPages'),
    ]);

    const filteredCards = allCards.filter((c) =>
        c.card_type.includes('credit') && c.fees?.annual?.amount === 0
    );

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: `${TITLE} | Open Wallet`,
        description: DESCRIPTION,
        url: URL,
        items: filteredCards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    return (
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <Breadcrumbs items={breadcrumbItems}/>

                <h1 className="text-4xl font-bold text-slate-900 mb-2">{t('credit_free')}</h1>
                <p className="text-slate-500 mb-8">{t('credit_free_subtitle')}</p>

                <CardsGrid
                    cards={filteredCards}
                    banks={banks}
                    hideTypeFilter
                    hideFeeFilter
                    noCardsLabel={t('no_cards')}
                />
            </div>
        </div>
    );
}
