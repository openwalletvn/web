import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';

const TITLE = 'Thẻ Ghi Nợ Nội Địa (Napas)';
const DESCRIPTION = 'Tra cứu tất cả thẻ ghi nợ nội địa Napas từ các ngân hàng Việt Nam';
const URL = '/the-ghi-no-noi-dia';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const cards = await getCards({type: 'debit', network: 'napas'});
 const {metadata} = buildCollectionPageMeta({
 title: 'Thẻ Ghi Nợ Nội Địa | Open Wallet',
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });
 return metadata;
}

export default async function DebitNapasPage() {
 const [cards, banks] = await Promise.all([
 getCards({type: 'debit', network: 'napas'}),
 getBanks(),
 ]);

 const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
 title: 'Thẻ Ghi Nợ Nội Địa | Open Wallet',
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });

 return (
 <MarketingPageShell title={'Thẻ Ghi Nợ Nội Địa (Napas)'} description={'Thẻ thanh toán mạng lưới nội địa Napas'} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
 <CardsGrid
 cards={cards}
 banks={banks}
 hideTypeFilter
 noCardsLabel={'Không tìm thấy thẻ nào.'}
 />
 </MarketingPageShell>
 );
}
