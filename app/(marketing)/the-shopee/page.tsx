import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const TITLE = 'Thẻ Shopee';
const DESCRIPTION = 'Tra cứu tất cả thẻ tín dụng và ghi nợ liên kết Shopee từ các ngân hàng Việt Nam';
const URL = '/the-shopee';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const [coBrandCards, intentCards] = await Promise.all([
 getCards({co_brand: 'shopee'}),
 getCards({intent: 'shopee'}),
 ]);
 const coBrandIds = new Set(coBrandCards.map((c) => c.id));
 const cards = [...coBrandCards, ...intentCards.filter((c) => !coBrandIds.has(c.id))];
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
 const [coBrandCards, intentCards, banks, t] = await Promise.all([
 getCards({co_brand: 'shopee'}),
 getCards({intent: 'shopee'}),
 getBanks(),
 getTranslations('SeoPages'),
 ]);
 const coBrandIds = new Set(coBrandCards.map((c) => c.id));
 const cards = [
 ...coBrandCards,
 ...intentCards.filter((c) => !coBrandIds.has(c.id)),
 ];

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

 <h1 className="mb-2">{t('shopee_cards')}</h1>
 <p className="text-slate-500 mb-8">{t('shopee_cards_subtitle')}</p>

 <CardsGrid
 cards={cards}
 banks={banks}
 noCardsLabel={t('no_cards')}
 hideCoBrandFilter
 />
 </div>
 </div>
 );
}
