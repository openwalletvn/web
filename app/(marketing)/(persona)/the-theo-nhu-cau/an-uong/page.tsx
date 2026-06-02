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
    intro: 'Trang so sánh thẻ hoàn tiền ăn uống tổng hợp các thẻ tín dụng có cashback khi chi tiêu tại nhà hàng, quán cà phê, và đặt đồ ăn qua ứng dụng như Shopee Food hoặc GrabFood, theo dữ liệu hiện tại của OpenWallet. Mức hoàn trong danh sách dao động từ 2% đến 20% tùy thẻ và điều kiện áp dụng. Một số thẻ có trần hoàn theo danh mục, trong khi một số khác áp dụng trần chung toàn thẻ mỗi tháng. Bảng xếp hạng dưới đây giúp bạn so sánh số tiền hoàn thực tế theo ngân sách ăn uống hàng tháng để chọn thẻ phù hợp nhất với thói quen của mình. Hãy kiểm tra chính sách cụ thể của ngân hàng để có thông tin chính xác nhất trước khi đăng ký.',
    faqs: [
        {
            q: 'Dùng MSB mDigi như thế nào để hoàn tiền ăn uống tối ưu?',
            a: <><L href="/the/msb-mdigi">MSB mDigi</L> hoàn 20% ăn uống nhưng trần danh mục chỉ 300.000 VND/tháng, tức là chi khoảng 1,5 triệu là đạt tối đa theo quy tắc này. Chiến lược tối ưu: dùng thẻ này để thanh toán các bữa ăn đầu tiên trong tháng cho đến khi đạt trần 300.000 VND, sau đó chuyển sang thẻ có tỷ lệ hoàn cao hơn ở mức chi tiêu còn lại. Hãy xác nhận điều kiện và trần hoàn tổng thẻ với MSB trước khi sử dụng.</>,
            aText: 'MSB mDigi hoàn 20% ăn uống nhưng trần danh mục chỉ 300.000 VND/tháng, tức là chi khoảng 1,5 triệu là đạt tối đa theo quy tắc này. Dùng thẻ này cho các giao dịch ăn uống đầu tiên trong tháng đến khi đạt trần, sau đó chuyển sang thẻ khác.',
        },
        {
            q: 'Chi khoảng 3-5 triệu mỗi tháng cho ăn uống, dùng thẻ nào?',
            a: <>Ở mức 3-5 triệu/tháng, <L href="/the/techcombank-visa-signature">Techcombank Visa Signature</L> và <L href="/the/sacombank-platinum-american-express">Sacombank Platinum American Express</L> đều hoàn 10%, tương đương 300.000-500.000 VND/tháng theo dữ liệu chúng tôi có. <L href="/the/msb-visa-signature">MSB Visa Signature</L> cũng hoàn 10% với trần danh mục 1.000.000 VND, đủ bao phủ mức chi tiêu này. Phí thường niên và trần hoàn tổng thẻ là yếu tố cần xác nhận thêm với ngân hàng.</>,
            aText: 'Ở mức 3-5 triệu/tháng, Techcombank Visa Signature và Sacombank Platinum American Express đều hoàn 10%, tương đương 300.000-500.000 VND/tháng. MSB Visa Signature cũng hoàn 10% với trần danh mục 1.000.000 VND.',
        },
        {
            q: 'Chi 20-50 triệu mỗi tháng cho ăn uống (kinh doanh, tiếp khách), thẻ nào hoàn nhiều nhất?',
            a: <>Ở mức 20-50 triệu/tháng, <L href="/the/techcombank-visa-signature">Techcombank Visa Signature</L>, <L href="/the/sacombank-platinum-american-express">Sacombank Platinum American Express</L> và <L href="/the/vpbank-diamond-world">VPBank Diamond World</L> (từ 30 triệu trở lên) đều không ghi nhận trần theo danh mục trong dữ liệu hiện tại, tương đương khoảng 3.000.000 VND khi chi 30 triệu/tháng. Lưu ý rằng các thẻ này vẫn có thể áp dụng trần hoàn chung toàn thẻ, cần xác nhận với ngân hàng trước khi sử dụng ở mức chi tiêu cao.</>,
            aText: 'Ở mức 20-50 triệu/tháng, Techcombank Visa Signature, Sacombank Platinum Amex và VPBank Diamond World (từ 30M) không ghi nhận trần theo danh mục, tương đương khoảng 3.000.000 VND khi chi 30 triệu. Vẫn có thể có trần hoàn chung toàn thẻ, cần xác nhận với ngân hàng.',
        },
        {
            q: 'Thẻ ăn uống nào có tỷ lệ hoàn tiền cao nhất?',
            a: <><L href="/the/msb-mdigi">MSB mDigi</L> có tỷ lệ 20%, cao nhất trong nhóm, nhưng trần danh mục 300.000 VND/tháng. Tỷ lệ cao không có nghĩa là hoàn nhiều tiền hơn ở mức chi tiêu lớn. Từ 3 triệu/tháng trở lên, <L href="/the/techcombank-visa-signature">Techcombank Visa Signature</L> (10%) thực tế hoàn nhiều hơn do không có trần theo danh mục. Xem bảng xếp hạng để so sánh số tiền cụ thể theo mức chi tiêu của bạn.</>,
            aText: 'MSB mDigi có tỷ lệ 20% nhưng trần danh mục 300.000 VND/tháng. Từ 3 triệu/tháng, Techcombank Visa Signature (10%) thực tế hoàn nhiều hơn do không có trần theo danh mục.',
        },
        {
            q: 'Mức hoàn tiền ăn uống tối đa hàng tháng là bao nhiêu?',
            a: <>Các thẻ có trần theo danh mục trong dữ liệu dao động từ 300.000 VND (<L href="/the/msb-mdigi">MSB mDigi</L>, <L href="/the/woori-vv-hype-point-gold">Woori Hype Point Gold</L>) đến 1.000.000 VND (<L href="/the/msb-visa-signature">MSB Visa Signature</L>). Một số thẻ như <L href="/the/techcombank-visa-signature">Techcombank Visa Signature</L> không ghi nhận trần theo danh mục nhưng vẫn có thể áp dụng trần hoàn chung toàn thẻ. Kiểm tra điều kiện cụ thể với ngân hàng để có thông tin chính xác nhất.</>,
            aText: 'Trần theo danh mục dao động từ 300.000 VND (MSB mDigi) đến 1.000.000 VND (MSB Visa Signature). Một số thẻ không ghi nhận trần danh mục nhưng vẫn có thể có trần hoàn chung toàn thẻ.',
        },
        {
            q: 'Thẻ hoàn tiền ăn uống nào miễn phí thường niên?',
            a: <><L href="/the/woori-visa-z">Woori Visa Z</L> miễn phí thường niên hoàn toàn, tích 2% tất cả giao dịch online (tối đa 500.000 điểm/tháng) — thẻ này xuất hiện trong danh sách vì đặt đồ ăn qua Shopee Food và GrabFood là giao dịch online, nên được tính điểm. Tuy nhiên đây không phải cashback ăn uống riêng, thanh toán trực tiếp tại nhà hàng sẽ không được tích điểm. <L href="/the/msb-mdigi">MSB mDigi</L> (399.000 VND/năm, có điều kiện miễn) là lựa chọn phí thấp nếu bạn cần hoàn tiền cả ăn tại chỗ lẫn đặt app.</>,
            aText: 'Woori Visa Z miễn phí thường niên, tích 2% giao dịch online (tối đa 500.000 điểm/tháng). Xuất hiện trong danh sách vì Shopee Food và GrabFood là giao dịch online — nhưng thanh toán trực tiếp tại nhà hàng không được tích điểm. MSB mDigi là lựa chọn nếu cần hoàn tiền cả ăn tại chỗ lẫn đặt app.',
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
