import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {ROUTES} from '@/lib/routes';
import {CardsGrid} from '@/components/cards/cards-grid';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ, type FAQ} from '@/components/marketing/category-seo-section';

const TITLE = 'Thẻ Doanh Nghiệp';
const DESCRIPTION = 'So sánh thẻ tín dụng và ghi nợ dành cho doanh nghiệp, hộ kinh doanh tại Việt Nam. Tìm thẻ công ty phù hợp với quy mô và nhu cầu chi tiêu.';
const URL = '/the-doanh-nghiep';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: ROUTES.cards},
    {label: TITLE},
];
const INTRO = 'Thẻ ngân hàng dành riêng cho doanh nghiệp khác thẻ cá nhân ở hạn mức, điều kiện mở thẻ và khả năng quản lý chi tiêu nhóm. Doanh nghiệp vừa và nhỏ có thể mở từ 1 thẻ, trong khi công ty lớn thường phát hành thẻ phụ cho từng bộ phận. Open Wallet tổng hợp thẻ doanh nghiệp từ các ngân hàng Việt Nam, bao gồm hạn mức, phí thường niên và điều kiện mở thẻ cho hộ kinh doanh và công ty TNHH/cổ phần.';
const FAQS: FAQ[] = [
    {q: 'Doanh nghiệp mới thành lập có mở được thẻ công ty không?', a: 'Có, nhưng thường cần tài khoản doanh nghiệp ít nhất 3–6 tháng và có doanh thu chứng minh với một số ngân hàng.'},
    {q: 'Thẻ doanh nghiệp có hạn mức cao hơn thẻ cá nhân không?', a: 'Thường có — hạn mức tính trên tài chính doanh nghiệp, không phải thu nhập cá nhân.'},
    {q: 'Hộ kinh doanh cá thể có mở thẻ doanh nghiệp được không?', a: 'Có, cần giấy phép kinh doanh và tài khoản doanh nghiệp riêng biệt với tài khoản cá nhân.'},
    {q: 'Chi tiêu bằng thẻ doanh nghiệp có được khấu trừ thuế không?', a: 'Có thể, nếu có hóa đơn VAT hợp lệ cho từng giao dịch. Tham khảo kế toán để đảm bảo đúng quy định.'},
];

const PAGE_META_INPUT = (cards: Awaited<ReturnType<typeof getCards>>) => ({
    title: `${TITLE} | Open Wallet`,
    description: DESCRIPTION,
    url: URL,
    items: cards.map((c) => ({name: c.name, url: ROUTES.card(c.id)})),
    breadcrumbItems: BREADCRUMB_ITEMS,
});

export async function generateMetadata(): Promise<Metadata> {
    const cards = await getCards({for_business: true});
    return buildCollectionPageMeta(PAGE_META_INPUT(cards)).metadata;
}

export default async function BusinessCardsPage() {
    const [cards, banks] = await Promise.all([getCards({for_business: true}), getBanks()]);
    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta(PAGE_META_INPUT(cards));

    return (
        <MarketingPageShell title={TITLE} description={DESCRIPTION} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <CategoryIntro intro={INTRO}/>
            <CardsGrid cards={cards} banks={banks} hideTypeFilter noCardsLabel="Không tìm thấy thẻ nào."/>
            <CategoryFAQ faqs={FAQS}/>
            <BrowseCategories excludeHref={URL}/>
        </MarketingPageShell>
    );
}
