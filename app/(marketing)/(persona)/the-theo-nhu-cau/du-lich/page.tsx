import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {buildIntentCategoryMeta, generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {PersonaPoolCards} from '@/components/marketing/persona-pool-cards';
import {CategoryIntro, CategoryFAQ} from '@/components/marketing/category-seo-section';

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Du Lịch',
    description: 'So sánh thẻ ngân hàng tốt nhất cho du lịch tại Việt Nam. Tìm thẻ hoàn tiền vé máy bay, khách sạn Agoda, miễn phí phòng chờ sân bay và không tính phí ngoại tệ.',
    url: '/the-theo-nhu-cau/du-lich',
    personaSlug: 'traveler',
    rankingTitle: 'Xếp hạng thẻ theo ưu đãi du lịch',
    intro: 'Đặt vé máy bay, khách sạn hay dùng Agoda thường xuyên? Thẻ du lịch phù hợp giúp bạn hoàn tiền mỗi chuyến đi, miễn phí phòng chờ sân bay và tránh phí ngoại tệ khi thanh toán quốc tế. Mức ưu đãi và điều kiện áp dụng khác nhau đáng kể giữa các thẻ.',
    faqs: [
        {q: 'Thẻ nào tốt nhất cho du lịch quốc tế?', a: 'Xem bảng xếp hạng phía trên. Ưu tiên thẻ miễn phí ngoại tệ và có cashback vé máy bay hoặc khách sạn.'},
        {q: 'Thẻ du lịch có miễn phí phòng chờ sân bay không?', a: 'Một số thẻ cao cấp hỗ trợ phòng chờ qua LoungeKey hoặc Priority Pass. Xem chi tiết từng thẻ trong bảng xếp hạng.'},
        {q: 'Đặt Agoda bằng thẻ Việt có được hoàn tiền không?', a: 'Có, nếu thẻ có quy tắc cashback cho danh mục du lịch hoặc đặt phòng trực tuyến. Kiểm tra điều khoản trước khi đặt.'},
        {q: 'Phí ngoại tệ khi dùng thẻ Việt ở nước ngoài là bao nhiêu?', a: 'Thường 1,5–3% trên giá trị giao dịch. Một số thẻ premium miễn phí ngoại tệ hoàn toàn.'},
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Thẻ theo nhu cầu', href: '/the-theo-nhu-cau'},
        {label: 'Thẻ Du Lịch'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default async function TravelerCardsPage() {
    const [poolCards, initialRanked] = await Promise.all([
        getCards({persona: CONFIG.personaSlug}),
        getRankedCards({persona: CONFIG.personaSlug, intents: [], limit: 10}).catch(() => []),
    ]);
    const {jsonLd, breadcrumbItems} = buildIntentCategoryMeta(CONFIG, poolCards);
    const rankedIds = new Set(initialRanked.map((r) => r.card.id));

    return (
        <MarketingPageShell title={CONFIG.title} description={CONFIG.description} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <CategoryIntro intro={CONFIG.intro}/>
            <CardRankingTable initialRanked={initialRanked} personaSlug={CONFIG.personaSlug} title={CONFIG.rankingTitle}/>
            <CategoryFAQ faqs={CONFIG.faqs}/>
            <BrowseCategories excludeHref={CONFIG.url}/>
            <PersonaPoolCards poolCards={poolCards} excludeIds={rankedIds} excludeRanked={true}/>
        </MarketingPageShell>
    );
}
