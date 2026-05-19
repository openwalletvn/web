import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ, type FAQ} from '@/components/marketing/category-seo-section';

const TITLE = 'Thẻ Chi Tiêu Dịch Vụ Số';
const DESCRIPTION = 'So sánh thẻ thanh toán dịch vụ số quốc tế tại Việt Nam: ChatGPT, Claude, Netflix, Spotify. Tìm thẻ không bị từ chối, không tính phí ngoại tệ cao.';
const URL = '/the-chi-tieu-dich-vu-so';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: '/the'},
    {label: TITLE},
];
const INTRO = 'Thanh toán ChatGPT Plus, Netflix, Spotify hay các AI tool quốc tế không hề đơn giản với thẻ Việt Nam — nhiều thẻ bị từ chối giao dịch nước ngoài hoặc tính phí chuyển đổi ngoại tệ 1,5–3%. Chọn đúng thẻ giúp bạn tránh bị từ chối và tiết kiệm phí hàng tháng. Danh sách dưới đây tổng hợp các thẻ phù hợp nhất cho chi tiêu dịch vụ số định kỳ.';
const FAQS: FAQ[] = [
    {q: 'Thẻ Việt Nam nào thanh toán ChatGPT Plus không bị từ chối?', a: 'Xem bảng xếp hạng phía trên — tập trung vào thẻ Visa/Mastercard quốc tế có bật thanh toán online nước ngoài trong app ngân hàng.'},
    {q: 'Phí ngoại tệ khi dùng thẻ Việt thanh toán Netflix là bao nhiêu?', a: 'Thường 1,5–3% trên giá trị giao dịch. Một số thẻ premium miễn phí ngoại tệ hoàn toàn.'},
    {q: 'Thẻ ghi nợ có thanh toán dịch vụ số quốc tế được không?', a: 'Có, nếu là thẻ Visa/Mastercard quốc tế và đã bật tính năng thanh toán online nước ngoài trong app ngân hàng.'},
    {q: 'Đăng ký ChatGPT Plus bằng thẻ Việt có cần VPN không?', a: 'Thẻ Visa/Mastercard quốc tế thường không cần VPN. Vấn đề chủ yếu là ngân hàng chặn giao dịch, không phải giới hạn địa lý.'},
];

export async function generateMetadata(): Promise<Metadata> {
    const allCards = await getCards();
    const cards = allCards.filter((c) => c.intents?.includes('digital'));
    const {metadata} = buildCollectionPageMeta({
        title: `${TITLE} | Open Wallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function DichVuSoCardsPage() {
    const [allCards, banks] = await Promise.all([getCards(), getBanks()]);
    const cards = allCards.filter((c) => c.intents?.includes('digital'));

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
            <CardRankingTable cards={cards} banks={banks} intentSlug="digital" title="Xếp hạng thẻ theo cashback dịch vụ số"/>
            <CategoryFAQ faqs={FAQS}/>
            <BrowseCategories excludeHref={URL}/>
        </MarketingPageShell>
    );
}
