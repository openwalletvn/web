import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const TITLE = 'Thẻ Đồng Thương Hiệu';
const DESCRIPTION = 'Tra cứu tất cả thẻ đồng thương hiệu từ các ngân hàng Việt Nam';
const URL = '/the-dong-thuong-hieu';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const cards = await getCards({co_brand: true});
 const {metadata} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });
 return metadata;
}

export default async function CoBrandedCardsPage() {
 const [cards, banks] = await Promise.all([
 getCards({co_brand: true}),
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

 <h1 className="mb-2">{'Thẻ Đồng Thương Hiệu'}</h1>
 <p className="text-slate-500 mb-8">{'Khám phá thẻ đồng thương hiệu với ưu đãi độc quyền'}</p>

 <CardsGrid
 cards={cards}
 banks={banks}
 noCardsLabel={'Không tìm thấy thẻ nào.'}
 />
 </div>
 </div>
 );
}
