import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';

const TITLE = 'Thẻ Tín Dụng Mastercard';
const DESCRIPTION = 'Tra cứu tất cả thẻ tín dụng Mastercard từ các ngân hàng Việt Nam';
const URL = '/the-tin-dung-mastercard';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const cards = await getCards({type: 'credit', network: 'mastercard'});
 const {metadata} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });
 return metadata;
}

export default async function CreditMastercardPage() {
 const [cards, banks] = await Promise.all([
 getCards({type: 'credit', network: 'mastercard'}),
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
 <MarketingPageShell title={'Thẻ Tín Dụng Mastercard'} description={'So sánh thẻ tín dụng Mastercard từ các ngân hàng Việt Nam'} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
 <CardsGrid
 cards={cards}
 banks={banks}
 hideTypeFilter
 noCardsLabel={'Không tìm thấy thẻ nào.'}
 />
 </MarketingPageShell>
 );
}
