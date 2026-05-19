import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const TITLE = 'Thẻ Siêu Thị';
const DESCRIPTION = 'Tổng hợp thẻ tín dụng và ghi nợ có ưu đãi mua sắm tại siêu thị như Coopmart, Go, Lotte, AEON';
const URL = '/the-sieu-thi';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: '/the'},
    {label: TITLE},
];

const CARD_IDS: string[] = [];

export async function generateMetadata(): Promise<Metadata> {
    const allCards = await getCards();
    const cards = allCards.filter((c) => CARD_IDS.includes(c.id));
    const {metadata} = buildCollectionPageMeta({
        title: `${TITLE} | Open Wallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function SieuThiCardsPage() {
    const [allCards, banks] = await Promise.all([getCards(), getBanks()]);
    const cards = allCards.filter((c) => CARD_IDS.includes(c.id));

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
                <h1 className="text-4xl font-bold text-slate-900 mb-2">{TITLE}</h1>
                <p className="text-slate-500 mb-8">{DESCRIPTION}</p>
                <CardsGrid cards={cards} banks={banks} noCardsLabel="Chưa có thẻ nào"/>
            </div>
        </div>
    );
}
