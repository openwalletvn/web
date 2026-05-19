import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const TITLE = 'Thẻ Ghi Nợ JCB';
const DESCRIPTION = 'Tra cứu tất cả thẻ ghi nợ JCB từ các ngân hàng Việt Nam';
const URL = '/the-ghi-no-jcb';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const cards = await getCards({type: 'debit', network: 'jcb'});
 const {metadata} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });
 return metadata;
}

export default async function DebitJcbPage() {
 const [cards, banks] = await Promise.all([
 getCards({type: 'debit', network: 'jcb'}),
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

 <h1 className="mb-2">{'Thẻ Ghi Nợ JCB'}</h1>
 <p className="text-slate-500 mb-8">{'So sánh thẻ ghi nợ JCB từ các ngân hàng Việt Nam'}</p>

 <CardsGrid
 cards={cards}
 banks={banks}
 hideTypeFilter
 noCardsLabel={'Không tìm thấy thẻ nào.'}
 />
 </div>
 </div>
 );
}
