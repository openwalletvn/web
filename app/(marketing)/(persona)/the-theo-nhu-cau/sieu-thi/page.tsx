import type {Metadata} from 'next';
import {getCards} from '@/lib/api';
import {generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {PersonaPage} from '../persona-page';

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Siêu Thị',
    description: 'So sánh thẻ tín dụng và ghi nợ có cashback khi mua sắm tại Coopmart, Go!, Lotte Mart, AEON. Tìm thẻ hoàn tiền siêu thị tốt nhất tại Việt Nam.',
    url: '/the-theo-nhu-cau/sieu-thi',
    personaSlug: 'groceries',
    rankingTitle: 'Xếp hạng thẻ theo cashback siêu thị',
    intro: 'Mua sắm tại siêu thị là khoản chi cố định hàng tháng của hầu hết gia đình Việt. Nhiều ngân hàng hợp tác với Coopmart, Go!, Lotte Mart và AEON để cung cấp cashback từ 3–10% cho chủ thẻ, một số còn tặng voucher hoặc tích điểm riêng. Mức hoàn tiền và điều kiện áp dụng khác nhau đáng kể giữa các thẻ.',
    faqs: [
        {q: 'Thẻ nào cashback siêu thị cao nhất?', a: 'Xem bảng xếp hạng phía trên, được tính dựa trên mức chi tiêu thực tế phổ biến.'},
        {q: 'Coopmart, Go!, Lotte Mart chấp nhận thẻ nào?', a: 'Hầu hết siêu thị lớn chấp nhận Visa và Mastercard. Thẻ đồng thương hiệu riêng của từng siêu thị thường có ưu đãi cao hơn.'},
        {q: 'Thẻ siêu thị có dùng được ở cửa hàng tiện lợi không?', a: 'Phụ thuộc vào điều khoản từng thẻ. Một số thẻ áp ưu đãi cho toàn bộ nhóm MCC bán lẻ, số khác chỉ áp cho siêu thị lớn.'},
        {q: 'Có cần đăng ký thêm để nhận cashback siêu thị không?', a: 'Thường không — cashback được tính tự động theo MCC giao dịch. Kiểm tra điều khoản thẻ để chắc chắn.'},
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Thẻ theo nhu cầu', href: '/the-theo-nhu-cau'},
        {label: 'Thẻ Siêu Thị'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default function SieuThiCardsPage() {
    return <PersonaPage config={CONFIG}/>;
}
