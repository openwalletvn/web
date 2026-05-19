import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';

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
 <MarketingPageShell title={'Thẻ Ghi Nợ Miễn Phí'} description={'Thẻ ghi nợ không có phí thường niên'} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
 <CardsGrid
 cards={filteredCards}
 banks={banks}
 hideTypeFilter hideFeeFilter
 noCardsLabel={'Không tìm thấy thẻ nào.'}
 />
 </MarketingPageShell>
 );
}
