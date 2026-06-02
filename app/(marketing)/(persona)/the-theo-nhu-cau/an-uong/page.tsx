import type {Metadata} from 'next';
import {getCards} from '@/lib/api';
import {generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {PersonaPage} from '../persona-page';

const L = ({href, children}: {href: string; children: string}) => (
    <a href={href} className="text-link">{children}</a>
);

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Ăn Uống',
    description: 'So sánh thẻ tín dụng hoàn tiền khi ăn uống tại nhà hàng, quán cà phê và đặt đồ ăn qua Shopee Food, GrabFood. Tìm thẻ cashback ăn uống phù hợp theo mức chi tiêu hàng tháng.',
    url: '/the-theo-nhu-cau/an-uong',
    personaSlug: 'dining',
    rankingTitle: 'Xếp hạng thẻ theo cashback ăn uống',
    intro: 'Trang so sánh thẻ hoàn tiền ăn uống tổng hợp các thẻ tín dụng có cashback khi chi tiêu tại nhà hàng, quán cà phê, và đặt đồ ăn qua ứng dụng như Shopee Food hoặc GrabFood, theo dữ liệu hiện tại của OpenWallet. Mức hoàn trong danh sách dao động từ 2% đến 20% tùy thẻ và điều kiện áp dụng. Đáng chú ý là một số thẻ không có trần hoàn tiền, giúp mức cashback tăng tuyến tính theo chi tiêu, trong khi các thẻ có trần thường phù hợp hơn với mức chi tiêu thấp do tỷ lệ hoàn cao hơn. Bảng xếp hạng dưới đây giúp bạn so sánh số tiền hoàn thực tế theo ngân sách ăn uống hàng tháng để chọn thẻ phù hợp nhất với thói quen của mình. Hãy kiểm tra chính sách của ngân hàng để có thông tin chính xác nhất trước khi đăng ký.',
    faqs: [
        {
            q: 'Dùng MSB mDigi như thế nào để hoàn tiền ăn uống tối ưu?',
            a: <><L href="/the/msb-mdigi">MSB mDigi</L> hoàn 20% ăn uống nhưng trần chỉ 300.000 VND/tháng, tức là chi khoảng 1,5 triệu là đạt tối đa. Chiến lược tối ưu: dùng thẻ này để thanh toán các bữa ăn đầu tiên trong tháng cho đến khi đạt trần 300.000 VND, sau đó chuyển sang thẻ không có trần (như Techcombank Visa Signature hoặc Sacombank Platinum Amex) cho các giao dịch còn lại. Hãy xác nhận điều kiện áp dụng với MSB trước khi sử dụng.</>,
            aText: 'MSB mDigi hoàn 20% ăn uống nhưng trần chỉ 300.000 VND/tháng, tức là chi khoảng 1,5 triệu là đạt tối đa. Chiến lược tối ưu: dùng thẻ này cho các giao dịch ăn uống đầu tiên trong tháng đến khi đạt trần, sau đó chuyển sang thẻ không có trần cho các giao dịch còn lại.',
        },
        {
            q: 'Chi khoảng 3-5 triệu mỗi tháng cho ăn uống, dùng thẻ nào?',
            a: <>Ở mức 3-5 triệu/tháng, <L href="/the/techcombank-visa-signature">Techcombank Visa Signature</L> và <L href="/the/sacombank-platinum-american-express">Sacombank Platinum American Express</L> đều hoàn 10% không giới hạn, tương đương 300.000-500.000 VND/tháng, vượt trội so với các thẻ có trần. <L href="/the/msb-visa-signature">MSB Visa Signature</L> cũng hoàn 10% với trần 1.000.000 VND, đủ bao phủ mức chi tiêu này. Phí thường niên là yếu tố cần cân nhắc thêm khi so sánh ba thẻ này.</>,
            aText: 'Ở mức 3-5 triệu/tháng, Techcombank Visa Signature và Sacombank Platinum American Express đều hoàn 10% không giới hạn, tương đương 300.000-500.000 VND/tháng. MSB Visa Signature cũng hoàn 10% với trần 1.000.000 VND, đủ bao phủ mức chi tiêu này.',
        },
        {
            q: 'Chi 20-50 triệu mỗi tháng cho ăn uống (kinh doanh, tiếp khách), thẻ nào hoàn nhiều nhất?',
            a: <>Ở mức chi tiêu cao từ 20-50 triệu/tháng, <L href="/the/techcombank-visa-signature">Techcombank Visa Signature</L>, <L href="/the/sacombank-platinum-american-express">Sacombank Platinum American Express</L> và <L href="/the/vpbank-diamond-world">VPBank Diamond World</L> (từ 30 triệu trở lên) đều không có trần hoàn. Chi 30 triệu/tháng, ba thẻ này hoàn 3.000.000 VND, cao hơn nhiều so với các thẻ có giới hạn. <L href="/the/eximbank-visa-violet">Eximbank Visa Violet</L> cũng không có trần (5%) nhưng mức hoàn thấp hơn. Chính sách có thể thay đổi, nên xác nhận với ngân hàng trước khi đăng ký.</>,
            aText: 'Ở mức 20-50 triệu/tháng, Techcombank Visa Signature, Sacombank Platinum Amex và VPBank Diamond World (từ 30M) đều không có trần. Chi 30 triệu, ba thẻ này hoàn khoảng 3.000.000 VND/tháng.',
        },
        {
            q: 'Thẻ ăn uống nào có tỷ lệ hoàn tiền cao nhất?',
            a: <><L href="/the/msb-mdigi">MSB mDigi</L> có tỷ lệ 20%, cao nhất trong nhóm, nhưng trần 300.000 VND/tháng. Tỷ lệ cao không có nghĩa là hoàn nhiều tiền hơn ở mức chi tiêu lớn. Từ 3 triệu/tháng trở lên, các thẻ 10% không trần như <L href="/the/techcombank-visa-signature">Techcombank Visa Signature</L> thực tế hoàn nhiều hơn. Xem bảng xếp hạng để so sánh số tiền cụ thể theo mức chi tiêu của bạn.</>,
            aText: 'MSB mDigi có tỷ lệ 20% nhưng trần 300.000 VND/tháng. Từ 3 triệu/tháng, Techcombank Visa Signature (10% không trần) thực tế hoàn nhiều hơn.',
        },
        {
            q: 'Mức hoàn tiền ăn uống tối đa hàng tháng là bao nhiêu?',
            a: <>Với các thẻ không có trần như <L href="/the/techcombank-visa-signature">Techcombank Visa Signature</L> và <L href="/the/sacombank-platinum-american-express">Sacombank Platinum American Express</L>, mức hoàn tăng theo chi tiêu, không bị giới hạn cố định. Các thẻ có trần dao động từ 300.000 VND (<L href="/the/msb-mdigi">MSB mDigi</L>, <L href="/the/woori-vv-hype-point-gold">Woori Hype Point Gold</L>) đến 1.000.000 VND (<L href="/the/msb-visa-signature">MSB Visa Signature</L>). Kiểm tra điều kiện cụ thể với ngân hàng để có thông tin chính xác nhất.</>,
            aText: 'Techcombank Visa Signature và Sacombank Platinum Amex không có trần hoàn. Các thẻ có trần dao động từ 300.000 VND (MSB mDigi) đến 1.000.000 VND (MSB Visa Signature).',
        },
        {
            q: 'Thẻ hoàn tiền ăn uống nào miễn phí thường niên?',
            a: <><L href="/the/woori-visa-z">Woori Visa Z</L> miễn phí thường niên hoàn toàn, hoàn 2% ăn uống với trần 500.000 VND/tháng. <L href="/the/msb-mdigi">MSB mDigi</L> (399.000 VND/năm, có điều kiện miễn) là lựa chọn phí thấp với tỷ lệ cao nhất nhóm. Các thẻ 10% không trần như Techcombank hay Sacombank Amex có phí thường niên cao hơn từ 599.000 đến 1.499.000 VND/năm, cần tính toán xem mức chi tiêu thực tế có đủ bù đắp phí không.</>,
            aText: 'Woori Visa Z miễn phí thường niên hoàn toàn, hoàn 2% với trần 500.000 VND/tháng. MSB mDigi (399.000 VND/năm) là lựa chọn phí thấp với tỷ lệ cao nhất.',
        },
        {
            q: 'Thẻ ăn uống có hoàn tiền khi đặt đồ ăn qua app không?',
            a: 'Phụ thuộc vào thẻ và ngân hàng. Một số thẻ trong danh sách có quy tắc riêng cho Shopee Food và GrabFood, trong khi thẻ khác chỉ áp dụng cho giao dịch tại nhà hàng trực tiếp (theo mã MCC). Kiểm tra điều khoản cashback cụ thể của từng thẻ hoặc liên hệ ngân hàng để xác nhận trước khi sử dụng.',
        },
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Thẻ theo nhu cầu', href: '/the-theo-nhu-cau'},
        {label: 'Thẻ Ăn Uống'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default function AnUongCardsPage() {
    return <PersonaPage config={CONFIG}/>;
}
