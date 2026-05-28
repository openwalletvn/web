import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {buildIntentCategoryMeta, generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ} from '@/components/marketing/category-seo-section';

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Chi Tiêu Dịch Vụ Số',
    description: 'So sánh thẻ thanh toán dịch vụ số quốc tế tại Việt Nam: ChatGPT, Claude, Netflix, Spotify. Tìm thẻ không bị từ chối, không tính phí ngoại tệ cao.',
    url: '/the-chi-tieu-dich-vu-so',
    intentSlug: 'digital',
    rankingTitle: 'Xếp hạng thẻ theo cashback dịch vụ số',
    intro: 'Thanh toán ChatGPT Plus, Netflix, Spotify hay các AI tool quốc tế không hề đơn giản với thẻ Việt Nam — nhiều thẻ bị từ chối giao dịch nước ngoài hoặc tính phí chuyển đổi ngoại tệ 1,5–3%. Chọn đúng thẻ giúp bạn tránh bị từ chối và tiết kiệm phí hàng tháng. Danh sách dưới đây tổng hợp các thẻ phù hợp nhất cho chi tiêu dịch vụ số định kỳ.',
    faqs: [
        {q: 'Thẻ Việt Nam nào thanh toán ChatGPT Plus không bị từ chối?', a: 'Xem bảng xếp hạng phía trên — tập trung vào thẻ Visa/Mastercard quốc tế có bật thanh toán online nước ngoài trong app ngân hàng.'},
        {q: 'Phí ngoại tệ khi dùng thẻ Việt thanh toán Netflix là bao nhiêu?', a: 'Thường 1,5–3% trên giá trị giao dịch. Một số thẻ premium miễn phí ngoại tệ hoàn toàn.'},
        {q: 'Thẻ ghi nợ có thanh toán dịch vụ số quốc tế được không?', a: 'Có, nếu là thẻ Visa/Mastercard quốc tế và đã bật tính năng thanh toán online nước ngoài trong app ngân hàng.'},
        {q: 'Đăng ký ChatGPT Plus bằng thẻ Việt có cần VPN không?', a: 'Thẻ Visa/Mastercard quốc tế thường không cần VPN. Vấn đề chủ yếu là ngân hàng chặn giao dịch, không phải giới hạn địa lý.'},
    ],
    filterFn: (c) => c.intents?.includes('digital') === true,
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, getCards);
}

export default async function DichVuSoCardsPage() {
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
