import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ, type FAQ} from '@/components/marketing/category-seo-section';

const TITLE = 'Thẻ Chi Tiêu Bảo Hiểm';
const DESCRIPTION = 'So sánh thẻ tín dụng và ghi nợ có cashback khi đóng phí bảo hiểm nhân thọ, bảo hiểm sức khỏe tại Việt Nam. Tối ưu chi phí bảo hiểm hàng tháng.';
const URL = '/the-danh-cho-bao-hiem';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: '/the'},
    {label: TITLE},
];
const INTRO = 'Phí bảo hiểm nhân thọ và bảo hiểm sức khỏe là khoản chi định kỳ lớn — thường từ vài triệu đến hàng chục triệu đồng mỗi năm. Dùng đúng thẻ, bạn có thể hoàn lại 1–3% số tiền này, tương đương hàng trăm nghìn đến vài triệu đồng mỗi năm. Lưu ý: một số thẻ loại trừ bảo hiểm khỏi danh mục cashback — kiểm tra kỹ điều khoản trước khi đăng ký.';
const FAQS: FAQ[] = [
    {q: 'Dùng thẻ đóng phí bảo hiểm nhân thọ có cashback không?', a: 'Có, nhưng không phải tất cả thẻ. Một số ngân hàng loại trừ danh mục bảo hiểm. Xem bảng xếp hạng để biết thẻ nào áp dụng.'},
    {q: 'Công ty bảo hiểm nào chấp nhận thanh toán thẻ?', a: 'Manulife, Prudential, AIA, Dai-ichi, Sun Life thường hỗ trợ thẻ Visa/Mastercard qua cổng thanh toán trực tuyến.'},
    {q: 'Thẻ nào tốt nhất để đóng phí Manulife, Prudential, AIA?', a: 'Xem bảng xếp hạng phía trên — được tính dựa trên MCC bảo hiểm thực tế.'},
    {q: 'Có thể dùng thẻ ghi nợ để đóng bảo hiểm không?', a: 'Tùy từng công ty bảo hiểm. Nhiều nơi chỉ chấp nhận thẻ tín dụng quốc tế (Visa/Mastercard).'},
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
    const [allCards, initialRanked] = await Promise.all([
        getCards(),
        getRankedCards({spend: {insurance: 3_000_000}, limit: 50}).catch(() => []),
    ]);
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
            <CategoryIntro intro={INTRO}/>
            <CardRankingTable initialRanked={initialRanked} intentSlug="insurance" title="Xếp hạng thẻ theo cashback bảo hiểm"/>
            <CategoryFAQ faqs={FAQS}/>
            <BrowseCategories excludeHref={URL}/>
        </MarketingPageShell>
    );
}
