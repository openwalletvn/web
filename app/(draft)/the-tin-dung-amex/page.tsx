import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';

const TITLE = 'Thẻ Tín Dụng Amex';
const DESCRIPTION = 'Tra cứu tất cả thẻ tín dụng American Express từ các ngân hàng Việt Nam';
const URL = '/the-tin-dung-amex';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const cards = await getCards({type: 'credit', network: 'amex'});
 const {metadata} = buildCollectionPageMeta({
 title: 'Thẻ Tín Dụng American Express | Open Wallet',
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });
 return metadata;
}

export default async function CreditAmexPage() {
 const [cards, banks] = await Promise.all([
 getCards({type: 'credit', network: 'amex'}),
 getBanks(),
 ]);

 const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
 title: 'Thẻ Tín Dụng American Express | Open Wallet',
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });

 return (
 <MarketingPageShell title={'Thẻ Tín Dụng Amex'} description={'So sánh thẻ tín dụng Amex từ các ngân hàng Việt Nam'} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
 <CardsGrid
 cards={cards}
 banks={banks}
 hideTypeFilter
 noCardsLabel={'Không tìm thấy thẻ nào.'}
 />
 </MarketingPageShell>
 );
}
