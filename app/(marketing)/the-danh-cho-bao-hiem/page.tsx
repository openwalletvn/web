import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {buildIntentCategoryMeta, generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ} from '@/components/marketing/category-seo-section';

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Chi Tiêu Bảo Hiểm',
    description: 'So sánh thẻ tín dụng và ghi nợ có cashback khi đóng phí bảo hiểm nhân thọ, bảo hiểm sức khỏe tại Việt Nam. Tối ưu chi phí bảo hiểm hàng tháng.',
    url: '/the-danh-cho-bao-hiem',
    intentSlug: 'insurance',
    rankingTitle: 'Xếp hạng thẻ theo cashback bảo hiểm',
    intro: 'Phí bảo hiểm nhân thọ và bảo hiểm sức khỏe là khoản chi định kỳ lớn — thường từ vài triệu đến hàng chục triệu đồng mỗi năm. Dùng đúng thẻ, bạn có thể hoàn lại 1–3% số tiền này, tương đương hàng trăm nghìn đến vài triệu đồng mỗi năm. Lưu ý: một số thẻ loại trừ bảo hiểm khỏi danh mục cashback — kiểm tra kỹ điều khoản trước khi đăng ký.',
    faqs: [
        {q: 'Dùng thẻ đóng phí bảo hiểm nhân thọ có cashback không?', a: 'Có, nhưng không phải tất cả thẻ. Một số ngân hàng loại trừ danh mục bảo hiểm. Xem bảng xếp hạng để biết thẻ nào áp dụng.'},
        {q: 'Công ty bảo hiểm nào chấp nhận thanh toán thẻ?', a: 'Manulife, Prudential, AIA, Dai-ichi, Sun Life thường hỗ trợ thẻ Visa/Mastercard qua cổng thanh toán trực tuyến.'},
        {q: 'Thẻ nào tốt nhất để đóng phí Manulife, Prudential, AIA?', a: 'Xem bảng xếp hạng phía trên — được tính dựa trên MCC bảo hiểm thực tế.'},
        {q: 'Có thể dùng thẻ ghi nợ để đóng bảo hiểm không?', a: 'Tùy từng công ty bảo hiểm. Nhiều nơi chỉ chấp nhận thẻ tín dụng quốc tế (Visa/Mastercard).'},
    ],
    filterFn: (c) => c.intents?.includes('insurance') === true,
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, getCards);
}

export default async function BaoHiemCardsPage() {
    const [allCards, initialRanked] = await Promise.all([
        getCards(),
        getRankedCards({intents: [CONFIG.intentSlug], limit: 50}).catch(() => []),
    ]);
    const {jsonLd, breadcrumbItems} = buildIntentCategoryMeta(CONFIG, allCards);

    return (
        <MarketingPageShell title={CONFIG.title} description={CONFIG.description} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <CategoryIntro intro={CONFIG.intro}/>
            <CardRankingTable initialRanked={initialRanked} intentSlug={CONFIG.intentSlug} title={CONFIG.rankingTitle}/>
            <CategoryFAQ faqs={CONFIG.faqs}/>
            <BrowseCategories excludeHref={CONFIG.url}/>
        </MarketingPageShell>
    );
}
