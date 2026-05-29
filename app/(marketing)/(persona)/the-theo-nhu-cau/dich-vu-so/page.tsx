import type {Metadata} from 'next';
import {getCards} from '@/lib/api';
import {generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {PersonaPage} from '../persona-page';

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Dịch Vụ Số',
    description: 'So sánh thẻ thanh toán dịch vụ số quốc tế tại Việt Nam: ChatGPT, Claude, Netflix, Spotify. Tìm thẻ không bị từ chối, không tính phí ngoại tệ cao.',
    url: '/the-theo-nhu-cau/dich-vu-so',
    personaSlug: 'digital',
    rankingTitle: 'Xếp hạng thẻ theo cashback dịch vụ số',
    intro: 'Thanh toán ChatGPT Plus, Netflix, Spotify hay các AI tool quốc tế không hề đơn giản với thẻ Việt Nam. Nhiều thẻ bị từ chối giao dịch nước ngoài hoặc tính phí chuyển đổi ngoại tệ 1,5–3%. Chọn đúng thẻ giúp bạn tránh bị từ chối và tiết kiệm phí hàng tháng.',
    faqs: [
        {q: 'Thẻ Việt Nam nào thanh toán ChatGPT Plus không bị từ chối?', a: 'Xem bảng xếp hạng phía trên — tập trung vào thẻ Visa/Mastercard quốc tế có bật thanh toán online nước ngoài trong app ngân hàng.'},
        {q: 'Phí ngoại tệ khi dùng thẻ Việt thanh toán Netflix là bao nhiêu?', a: 'Thường 1,5–3% trên giá trị giao dịch. Một số thẻ premium miễn phí ngoại tệ hoàn toàn.'},
        {q: 'Thẻ ghi nợ có thanh toán dịch vụ số quốc tế được không?', a: 'Có, nếu là thẻ Visa/Mastercard quốc tế và đã bật tính năng thanh toán online nước ngoài trong app ngân hàng.'},
        {q: 'Đăng ký ChatGPT Plus bằng thẻ Việt có cần VPN không?', a: 'Thẻ Visa/Mastercard quốc tế thường không cần VPN. Vấn đề chủ yếu là ngân hàng chặn giao dịch, không phải giới hạn địa lý.'},
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Thẻ theo nhu cầu', href: '/the-theo-nhu-cau'},
        {label: 'Thẻ Dịch Vụ Số'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default function DichVuSoCardsPage() {
    return <PersonaPage config={CONFIG}/>;
}
