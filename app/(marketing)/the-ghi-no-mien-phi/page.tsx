import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const TITLE = 'Thẻ Ghi Nợ Miễn Phí';
const DESCRIPTION = 'Tra cứu tất cả thẻ ghi nợ miễn phí thường niên từ các ngân hàng Việt Nam';
const URL = '/the-ghi-no-mien-phi';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const allCards = await getCards();
 const cards = allCards.filter((c) => c.card_type.includes('debit') && c.fees?.annual?.amount === 0);
 const {metadata} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });
 return metadata;
}

export default async function DebitFreePage() {
 const [allCards, banks] = await Promise.all([
 getCards(),
 getBanks(),
 ]);

 const filteredCards = allCards.filter((c) =>
 c.card_type.includes('debit') && c.fees?.annual?.amount === 0
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

 <h1 className="mb-2">{'Thẻ Ghi Nợ Miễn Phí'}</h1>
 <p className="text-slate-500 mb-8">{'Thẻ ghi nợ không có phí thường niên'}</p>

 <CardsGrid
 cards={filteredCards}
 banks={banks}
 hideTypeFilter hideFeeFilter
 noCardsLabel={'Không tìm thấy thẻ nào.'}
 />
 </div>
 </div>
 );
}
