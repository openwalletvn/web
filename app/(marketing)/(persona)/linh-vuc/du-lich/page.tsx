import type {Metadata} from 'next';
import {getCards} from '@/lib/api';
import {generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {PersonaPage} from '../persona-page';

export const revalidate = 3600;

function L({href, children}: {href: string; children: React.ReactNode}) {
    return <a href={href} className="text-link">{children}</a>;
}

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Du Lịch',
    description: 'So sánh thẻ ngân hàng tốt nhất cho du lịch tại Việt Nam: hoàn tiền vé máy bay, khách sạn, miễn phí phòng chờ sân bay, không tính phí ngoại tệ. Xếp hạng tự động theo ưu đãi thực tế.',
    url: '/linh-vuc/du-lich',
    personaSlug: 'traveler',
    rankingTitle: 'Xếp hạng thẻ theo ưu đãi du lịch',
    intro: 'Trang này so sánh thẻ du lịch tốt nhất tại Việt Nam, từ thẻ hoàn tiền vé máy bay, khách sạn đến thẻ cashback cho mọi giao dịch phân loại du lịch. Tỷ lệ hoàn trong danh sách dao động từ 0,1% đến 20%, tùy theo danh mục chi tiêu và điều kiện từng thẻ. Phần lớn thẻ có trần hoàn tháng từ 300.000 đến 800.000 VND, nhưng một số thẻ không giới hạn hoàn tiền, phù hợp hơn cho người chi tiêu du lịch lớn và đều đặn. Bảng xếp hạng dưới đây giúp bạn so sánh số tiền hoàn thực tế tại các mức chi tiêu khác nhau để chọn thẻ phù hợp với lịch trình và ngân sách của bạn.',
    faqs: [
        {
            q: 'Dùng Sacombank Platinum American Express như thế nào cho tối ưu?',
            a: <><L href="/the/sacombank-platinum-american-express">Sacombank Platinum American Express</L> hoàn 20% cho chi tiêu phân loại du lịch, không có trần hoàn tháng. Dùng thẻ này thanh toán trực tiếp vé máy bay, khách sạn để đảm bảo giao dịch được phân loại đúng danh mục. Phí thường niên 599.000 VND, có thể thu hồi nếu chi tiêu du lịch đạt từ 3 triệu/tháng trở lên.</>,
            aText: 'Sacombank Platinum American Express hoàn 20% cho chi tiêu phân loại du lịch, không có trần hoàn tháng. Dùng thẻ này thanh toán trực tiếp vé máy bay, khách sạn để đảm bảo giao dịch được phân loại đúng danh mục. Phí thường niên 599.000 VND, có thể thu hồi nếu chi tiêu du lịch đạt từ 3 triệu/tháng trở lên.',
        },
        {
            q: 'Chi khoảng 5 triệu tại du lịch mỗi tháng, dùng thẻ nào?',
            a: <>Ở mức 5 triệu/tháng, <L href="/the/sacombank-platinum-american-express">Sacombank Platinum American Express</L> hoàn khoảng 1.000.000 VND (20%), bỏ xa nhóm tiếp theo. <L href="/the/lpbank-jcb-ultimate">LPBank JCB Ultimate</L> và <L href="/the/ocb-bamboo-mastercard">OCB Bamboo Airways</L> đứng thứ hai với khoảng 500.000 VND mỗi thẻ, phù hợp nếu muốn thẻ chuyên hàng không hoặc ưu đãi liên quan đến dặm bay.</>,
            aText: 'Ở mức 5 triệu/tháng, Sacombank Platinum American Express hoàn khoảng 1.000.000 VND (20%), bỏ xa nhóm tiếp theo. LPBank JCB Ultimate và OCB Bamboo Airways đứng thứ hai với khoảng 500.000 VND mỗi thẻ, phù hợp nếu muốn thẻ chuyên hàng không hoặc ưu đãi liên quan đến dặm bay.',
        },
        {
            q: 'Chi 20 triệu tại du lịch mỗi tháng, thẻ nào hoàn nhiều nhất?',
            a: <>Ở mức 20 triệu/tháng, <L href="/the/sacombank-platinum-american-express">Sacombank Platinum American Express</L> tiếp tục dẫn đầu với khoảng 4.000.000 VND (không trần). <L href="/the/eximbank-jcb-ultimate">Eximbank JCB Ultimate</L> hoàn khoảng 2.000.000 VND (10%, không trần). <L href="/the/lpbank-jcb-ultimate">LPBank JCB Ultimate</L> đã chạm trần 800.000 VND từ mức chi 8 triệu nên không tăng thêm ở mức này.</>,
            aText: 'Ở mức 20 triệu/tháng, Sacombank Platinum American Express tiếp tục dẫn đầu với khoảng 4.000.000 VND (không trần). Eximbank JCB Ultimate hoàn khoảng 2.000.000 VND (10%, không trần). LPBank JCB Ultimate đã chạm trần 800.000 VND từ mức chi 8 triệu nên không tăng thêm ở mức này.',
        },
        {
            q: 'Thẻ du lịch nào hoàn tiền cao nhất hiện tại?',
            a: <><L href="/the/sacombank-platinum-american-express">Sacombank Platinum American Express</L> có tỷ lệ hoàn du lịch cao nhất theo dữ liệu hiện tại ở mức 20%, không giới hạn trần. Tỷ lệ này chỉ áp cho chi tiêu phân loại du lịch nên số tiền hoàn thực tế phụ thuộc vào loại giao dịch bạn thực hiện. Xem bảng để so sánh số tiền hoàn thực tế tại mức chi tiêu của bạn.</>,
            aText: 'Sacombank Platinum American Express có tỷ lệ hoàn du lịch cao nhất theo dữ liệu hiện tại ở mức 20%, không giới hạn trần. Tỷ lệ này chỉ áp cho chi tiêu phân loại du lịch nên số tiền hoàn thực tế phụ thuộc vào loại giao dịch bạn thực hiện. Xem bảng để so sánh số tiền hoàn thực tế tại mức chi tiêu của bạn.',
        },
        {
            q: 'Mức hoàn tiền tối đa hàng tháng là bao nhiêu?',
            a: <>Trần hoàn trong danh sách dao động từ 300.000 VND (<L href="/the/woori-vv-hype-point-gold">Woori VV Hype Point Gold</L>, <L href="/the/woori-vv-plus-point-classic">Woori VV Plus Point Classic</L>) đến 800.000 VND (<L href="/the/lpbank-jcb-ultimate">LPBank JCB Ultimate</L>). Một số thẻ như <L href="/the/sacombank-platinum-american-express">Sacombank Platinum American Express</L>, <L href="/the/eximbank-jcb-ultimate">Eximbank JCB Ultimate</L> và <L href="/the/techcombank-visa-signature">Techcombank Visa Signature</L> không có trần hoàn cho danh mục du lịch, phù hợp hơn cho người chi tiêu lớn.</>,
            aText: 'Trần hoàn trong danh sách dao động từ 300.000 VND đến 800.000 VND. Một số thẻ như Sacombank Platinum American Express, Eximbank JCB Ultimate và Techcombank Visa Signature không có trần hoàn cho danh mục du lịch, phù hợp hơn cho người chi tiêu lớn.',
        },
        {
            q: 'Thẻ du lịch nào miễn phí thường niên?',
            a: <>Trong danh sách hiện tại, <L href="/the/woori-visa">Woori Visa</L> không có phí thường niên nhưng tỷ lệ hoàn chỉ ở mức 0,1% cho mọi giao dịch. Hầu hết thẻ có cashback du lịch đáng kể đều có phí thường niên từ 300.000 đến 1.499.000 VND/năm.</>,
            aText: 'Trong danh sách hiện tại, Woori Visa không có phí thường niên nhưng tỷ lệ hoàn chỉ ở mức 0,1% cho mọi giao dịch. Hầu hết thẻ có cashback du lịch đáng kể đều có phí thường niên từ 300.000 đến 1.499.000 VND/năm.',
        },
        {
            q: 'Thẻ trong danh sách có hoàn tiền khi đặt phòng qua Booking.com, Agoda không?',
            a: 'Phụ thuộc vào cách ngân hàng phân loại giao dịch. Nhiều thẻ áp cashback cho mã MCC du lịch, bao gồm đặt phòng qua nền tảng quốc tế. Một số thẻ chỉ áp dụng cho hãng hàng không hoặc đại lý du lịch trực tiếp nên nên kiểm tra điều khoản trước khi thanh toán.',
        },
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Lĩnh vực', href: '/linh-vuc'},
        {label: 'Thẻ Du Lịch'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default function TravelerCardsPage() {
    return <PersonaPage config={CONFIG}/>;
}
