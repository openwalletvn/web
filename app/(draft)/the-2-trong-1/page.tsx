import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';

const TITLE = 'Thẻ 2 Trong 1';
const DESCRIPTION = 'Tra cứu tất cả thẻ 2 trong 1 (tín dụng + ghi nợ) từ các ngân hàng Việt Nam';
const URL = '/the-2-trong-1';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const cards = await getCards({type: '2in1'});
 const {metadata} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });
 return metadata;
}

export default async function TwoInOneCardsPage() {
 const [cards, banks] = await Promise.all([
 getCards({type: '2in1'}),
 getBanks(),
 ]);

 const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });

 return (
 <MarketingPageShell title={'Thẻ 2 Trong 1'} description={'Thẻ đa chức năng kết hợp tính năng tín dụng và ghi nợ'} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
 <CardsGrid
 cards={cards}
 banks={banks}
 hideTypeFilter
 noCardsLabel={'Không tìm thấy thẻ nào.'}
 />
 </MarketingPageShell>
 );
}
