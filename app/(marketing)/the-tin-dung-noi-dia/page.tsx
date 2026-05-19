import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const TITLE = 'Thẻ Tín Dụng Nội Địa (Napas)';
const DESCRIPTION = 'Tra cứu tất cả thẻ tín dụng nội địa Napas từ các ngân hàng Việt Nam';
const URL = '/the-tin-dung-noi-dia';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: 'Thẻ Tín Dụng', href: '/the-tin-dung'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const cards = await getCards({type: 'credit', network: 'napas'});
 const {metadata} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });
 return metadata;
}

export default async function CreditNapasPage() {
 const [cards, banks] = await Promise.all([
 getCards({type: 'credit', network: 'napas'}),
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
 <div className="px-4 py-12">
 <div className="max-w-container mx-auto">
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
 <Breadcrumbs items={breadcrumbItems}/>

 <h1 className="mb-2">{'Thẻ Tín Dụng Nội Địa (Napas)'}</h1>
 <p className="text-slate-500 mb-8">{'Tra cứu tất cả thẻ tín dụng nội địa Napas từ các ngân hàng Việt Nam'}</p>

 <CardsGrid
 cards={cards}
 banks={banks}
 noCardsLabel={'Không tìm thấy thẻ nào.'}
 hideTypeFilter
 hideNetworkFilter
 />
 </div>
 </div>
 );
}
