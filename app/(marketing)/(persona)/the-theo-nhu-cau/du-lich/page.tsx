import type {Metadata} from 'next';
import {getCards} from '@/lib/api';
import {generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {PersonaPage} from '../persona-page';

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

export default function TravelerCardsPage() {
    return <PersonaPage config={CONFIG}/>;
}
