import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const TITLE = 'Thẻ Doanh Nghiệp';
const DESCRIPTION = 'Tra cứu tất cả thẻ ngân hàng dành cho doanh nghiệp tại Việt Nam';
const URL = '/the-doanh-nghiep';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: '/the'},
    {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
    const cards = await getCards({for_business: true});
    const {metadata} = buildCollectionPageMeta({
        title: `${TITLE} | Open Wallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function BusinessCardsPage() {
    const [cards, banks, t] = await Promise.all([
        getCards({for_business: true}),
        getBanks(),
        getTranslations('SeoPages'),
    ]);

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

                <h1 className="text-4xl font-bold text-slate-900 mb-2">{t('business_cards')}</h1>
                <p className="text-slate-500 mb-8">{t('business_cards_subtitle')}</p>

                <CardsGrid
                    cards={cards}
                    banks={banks}
                    hideTypeFilter
                    noCardsLabel={t('no_cards')}
                />
            </div>
        </div>
    );
}
