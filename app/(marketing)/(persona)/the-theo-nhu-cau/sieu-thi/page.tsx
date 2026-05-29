import type {Metadata} from 'next';
import {getCards} from '@/lib/api';
import {generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {PersonaPage} from '../persona-page';

const L = ({href, children}: {href: string; children: string}) => (
    <a href={href} className="text-link">{children}</a>
);

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Siêu Thị',
    description: 'So sánh thẻ tín dụng và ghi nợ có cashback khi mua sắm tại Coopmart, Go!, Lotte Mart, AEON. Tìm thẻ hoàn tiền siêu thị tốt nhất tại Việt Nam.',
    url: '/the-theo-nhu-cau/sieu-thi',
    personaSlug: 'groceries',
    rankingTitle: 'Xếp hạng thẻ theo cashback siêu thị',
    intro: 'Trang so sánh thẻ hoàn tiền siêu thị tốt nhất tại Việt Nam, tổng hợp các thẻ tín dụng có ưu đãi cashback khi mua sắm tại các chuỗi siêu thị lớn như Coopmart, Go!, Lotte Mart và AEON. Mức hoàn tiền trong danh sách dao động từ 1% đến 20% tùy thẻ và điều kiện áp dụng. Hầu hết thẻ có trần hoàn từ 300.000 đến 1.000.000 VND mỗi tháng, một số yêu cầu chi tiêu tối thiểu mỗi kỳ sao kê mới được kích hoạt cashback, và một số có cơ chế bậc chi tiêu giúp mức hoàn tăng theo doanh số. Bảng xếp hạng dưới đây giúp bạn so sánh mức hoàn thực tế theo ngân sách chi tiêu siêu thị hàng tháng của mình.',
    faqs: [
        {
            q: 'Dùng thẻ Sacombank Visa Uniq mua siêu thị như thế nào cho tối ưu?',
            a: <><L href="/the/sacombank-uniq">Sacombank Visa Uniq</L> hoàn 20% không giới hạn mức chi tiêu tối thiểu, nhưng trần hoàn chỉ 300.000 VND/tháng, tức là đạt tối đa chỉ cần chi 1,5 triệu/tháng tại siêu thị. Dùng thẻ này để thanh toán siêu thị đến khi đạt trần, sau đó chuyển sang thẻ khác cho các giao dịch tiếp theo trong tháng để tối đa hóa tổng hoàn tiền.</>,
            aText: 'Sacombank Visa Uniq hoàn 20% không giới hạn mức chi tiêu tối thiểu, nhưng trần hoàn chỉ 300.000 VND/tháng, tức là đạt tối đa chỉ cần chi 1,5 triệu/tháng tại siêu thị. Dùng thẻ này để thanh toán siêu thị đến khi đạt trần, sau đó chuyển sang thẻ khác cho các giao dịch tiếp theo trong tháng.',
        },
        {
            q: 'Chi khoảng 3-8 triệu mỗi tháng tại siêu thị, dùng thẻ nào?',
            a: <>Chi 3 triệu/tháng, <L href="/the/sacombank-uniq">Sacombank Visa Uniq</L> hoàn 300.000 VND (20%) đứng đầu, gấp đôi so với các thẻ còn lại ở mức này. Từ 8 triệu trở lên, <L href="/the/msb-mastercard-family">MSB Mastercard Family</L> vượt lên với trần cao hơn, hoàn khoảng 400.000 VND so với 300.000 VND của Uniq vốn đã đạt trần từ 1,5 triệu chi tiêu.</>,
            aText: 'Chi 3 triệu/tháng, Sacombank Visa Uniq hoàn 300.000 VND (20%) đứng đầu. Từ 8 triệu trở lên, MSB Mastercard Family vượt lên với trần cao hơn, hoàn khoảng 400.000 VND so với 300.000 VND của Uniq vốn đã đạt trần từ 1,5 triệu chi tiêu.',
        },
        {
            q: 'Chi 30-50 triệu mỗi tháng tại siêu thị (nhập hàng, kinh doanh), thẻ nào hoàn nhiều nhất?',
            a: <>Từ 30 triệu/kỳ sao kê trở lên, <L href="/the/vpbank-diamond-world">VPBank Diamond World</L> hoàn 5% siêu thị với trần chung 1.000.000 VND (bao gồm ăn uống và thời trang), cao hơn mức tối đa 900.000 VND của <L href="/the/msb-mastercard-family">MSB Mastercard Family</L>. Dưới 30 triệu/kỳ, Diamond World chỉ hoàn 3% siêu thị với trần 500.000 VND, cần chi tối thiểu 4 triệu/kỳ để kích hoạt cashback. Chi tiêu tại nhiều danh mục (siêu thị, ăn uống, thời trang) cùng lúc sẽ dùng chung trần hoàn này.</>,
            aText: 'Từ 30 triệu/kỳ sao kê, VPBank Diamond World hoàn 5% siêu thị với trần chung 1.000.000 VND, cao hơn MSB Mastercard Family (tối đa 900.000 VND). Dưới 30 triệu/kỳ, Diamond World chỉ hoàn 3% với trần 500.000 VND, cần chi tối thiểu 4 triệu/kỳ.',
        },
        {
            q: 'Thẻ nào hoàn tiền siêu thị cao nhất theo tỷ lệ phần trăm?',
            a: <><L href="/the/sacombank-uniq">Sacombank Visa Uniq</L> có tỷ lệ hoàn cao nhất ở mức 20%, nhưng trần 300.000 VND/tháng. Tỷ lệ cao không đồng nghĩa hoàn nhiều tiền hơn ở mức chi tiêu cao vì trần hoàn mới là yếu tố quyết định. Xem bảng xếp hạng để so sánh số tiền hoàn thực tế theo mức chi tiêu của bạn.</>,
            aText: 'Sacombank Visa Uniq có tỷ lệ hoàn cao nhất ở mức 20%, nhưng trần 300.000 VND/tháng. Tỷ lệ cao không đồng nghĩa hoàn nhiều tiền hơn ở mức chi tiêu cao.',
        },
        {
            q: 'Mức hoàn tiền tối đa hàng tháng tại siêu thị là bao nhiêu?',
            a: <>Hầu hết thẻ có trần từ 300.000 đến 500.000 VND/tháng. <L href="/the/msb-mastercard-family">MSB Mastercard Family</L> có trần cao nhất trong nhóm thẻ phổ thông với 900.000 VND khi chi từ 30 triệu/tháng. <L href="/the/vpbank-diamond-world">VPBank Diamond World</L> đạt tối đa 1.000.000 VND/kỳ khi chi từ 30 triệu trở lên, nhưng trần này dùng chung cho cả siêu thị, ăn uống và thời trang.</>,
            aText: 'Hầu hết thẻ có trần từ 300.000 đến 500.000 VND/tháng. MSB Mastercard Family có trần cao nhất với 900.000 VND khi chi từ 30 triệu/tháng. VPBank Diamond World đạt tối đa 1.000.000 VND/kỳ khi chi từ 30 triệu, nhưng trần này dùng chung cho siêu thị, ăn uống và thời trang.',
        },
        {
            q: 'Thẻ hoàn tiền siêu thị nào miễn phí thường niên?',
            a: <><L href="/the/msb-super-free">MSB Super Free</L> miễn phí thường niên hoàn toàn, hoàn 1% tại siêu thị (trần 300.000 VND/tháng). Các thẻ có tỷ lệ hoàn cao hơn thường thu phí từ 500.000 đến hơn 1.000.000 VND/năm, một số miễn phí nếu đạt doanh số chi tiêu nhất định. Tính phí thường niên vào tổng lợi ích khi so sánh để có con số chính xác.</>,
            aText: 'MSB Super Free miễn phí thường niên hoàn toàn, hoàn 1% tại siêu thị. Các thẻ có tỷ lệ hoàn cao hơn thường thu phí từ 500.000 đến hơn 1.000.000 VND/năm.',
        },
        {
            q: 'Thẻ tín dụng siêu thị có dùng được ở cửa hàng tiện lợi không?',
            a: 'Phụ thuộc vào cách ngân hàng phân loại mã giao dịch (MCC). Một số thẻ áp hoàn tiền cho nhóm bán lẻ rộng bao gồm cả cửa hàng tiện lợi, số khác chỉ áp tại siêu thị lớn có MCC riêng. Liên hệ ngân hàng hoặc kiểm tra điều khoản để xác nhận trước khi chi tiêu.',
        },
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
