import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {buildIntentCategoryMeta, generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {PersonaPoolCards} from '@/components/marketing/persona-pool-cards';
import {CategoryIntro, CategoryFAQ} from '@/components/marketing/category-seo-section';

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Di Chuyển',
    description: 'So sánh thẻ ngân hàng hoàn tiền khi đi Grab, Be và di chuyển hàng ngày tại Việt Nam. Tìm thẻ cashback cao nhất cho chi tiêu vận chuyển.',
    url: '/the-theo-nhu-cau/di-chuyen',
    personaSlug: 'commuter',
    rankingTitle: 'Xếp hạng thẻ theo cashback di chuyển',
    intro: 'Dùng Grab, Be hoặc phương tiện công cộng mỗi ngày? Một số thẻ ngân hàng hoàn tiền trực tiếp cho danh mục vận chuyển, giúp bạn tiết kiệm đáng kể theo tháng. Mức cashback và điều kiện áp dụng khác nhau giữa các thẻ.',
    faqs: [
        {q: 'Thẻ nào cashback Grab cao nhất?', a: 'Xem bảng xếp hạng phía trên, được cập nhật theo dữ liệu thực tế từ các ngân hàng.'},
        {q: 'Thẻ ghi nợ có cashback khi đi Grab không?', a: 'Có, một số thẻ ghi nợ hỗ trợ cashback vận chuyển, nhưng tỷ lệ thường thấp hơn thẻ tín dụng.'},
        {q: 'Cashback di chuyển có áp dụng cho Be và taxi truyền thống không?', a: 'Tùy ngân hàng. Một số áp dụng theo MCC vận chuyển chung, một số chỉ áp riêng cho Grab.'},
        {q: 'Có hạn mức tối đa cho cashback di chuyển không?', a: 'Hầu hết thẻ có giới hạn cashback hàng tháng. Xem chi tiết điều khoản từng thẻ trong bảng xếp hạng.'},
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Thẻ theo nhu cầu', href: '/the-theo-nhu-cau'},
        {label: 'Thẻ Di Chuyển'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default async function CommuterCardsPage() {
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
