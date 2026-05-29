import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {buildIntentCategoryMeta, generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {PersonaPoolCards} from '@/components/marketing/persona-pool-cards';
import {CategoryIntro, CategoryFAQ} from '@/components/marketing/category-seo-section';

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Doanh Nghiệp',
    description: 'So sánh thẻ tín dụng và ghi nợ dành cho doanh nghiệp, hộ kinh doanh tại Việt Nam. Tìm thẻ công ty phù hợp với quy mô và nhu cầu chi tiêu.',
    url: '/the-theo-nhu-cau/doanh-nghiep',
    personaSlug: 'business',
    rankingTitle: 'Xếp hạng thẻ doanh nghiệp',
    intro: 'Thẻ ngân hàng dành riêng cho doanh nghiệp khác thẻ cá nhân ở hạn mức, điều kiện mở thẻ và khả năng quản lý chi tiêu nhóm. Doanh nghiệp vừa và nhỏ có thể mở từ 1 thẻ, trong khi công ty lớn thường phát hành thẻ phụ cho từng bộ phận. Open Wallet tổng hợp thẻ doanh nghiệp từ các ngân hàng Việt Nam, bao gồm hạn mức, phí thường niên và điều kiện mở thẻ cho hộ kinh doanh và công ty TNHH/cổ phần.',
    faqs: [
        {q: 'Doanh nghiệp mới thành lập có mở được thẻ công ty không?', a: 'Có, nhưng thường cần tài khoản doanh nghiệp ít nhất 3–6 tháng và có doanh thu chứng minh với một số ngân hàng.'},
        {q: 'Thẻ doanh nghiệp có hạn mức cao hơn thẻ cá nhân không?', a: 'Thường có — hạn mức tính trên tài chính doanh nghiệp, không phải thu nhập cá nhân.'},
        {q: 'Hộ kinh doanh cá thể có mở thẻ doanh nghiệp được không?', a: 'Có, cần giấy phép kinh doanh và tài khoản doanh nghiệp riêng biệt với tài khoản cá nhân.'},
        {q: 'Chi tiêu bằng thẻ doanh nghiệp có được khấu trừ thuế không?', a: 'Có thể, nếu có hóa đơn VAT hợp lệ cho từng giao dịch. Tham khảo kế toán để đảm bảo đúng quy định.'},
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Thẻ theo nhu cầu', href: '/the-theo-nhu-cau'},
        {label: 'Thẻ Doanh Nghiệp'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default async function BusinessCardsPage() {
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
