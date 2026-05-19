import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';

const TITLE = 'Thẻ Chi Tiêu Bảo Hiểm';
const DESCRIPTION = 'Tổng hợp thẻ tín dụng và ghi nợ có ưu đãi thanh toán bảo hiểm, bảo hiểm nhân thọ';
const URL = '/the-danh-cho-bao-hiem';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const allCards = await getCards();
 const cards = allCards.filter((c) => c.intents?.includes('insurance'));
 const {metadata} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });
 return metadata;
}

export default async function BaoHiemCardsPage() {
 const [allCards, banks] = await Promise.all([getCards(), getBanks()]);
 const cards = allCards.filter((c) => c.intents?.includes('insurance'));

 const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });

 return (
 <MarketingPageShell title={TITLE} description={DESCRIPTION} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
 <CardRankingTable cards={cards} banks={banks} intentSlug="insurance" title="Xếp hạng thẻ theo cashback bảo hiểm"/>
 </MarketingPageShell>
 );
}
