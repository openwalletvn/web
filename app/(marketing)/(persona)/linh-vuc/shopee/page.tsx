import type {Metadata} from 'next';
import {getCards} from '@/lib/api';
import {generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {PersonaPage} from '../persona-page';

export const revalidate = 3600;

const L = ({href, children}: {href: string; children: string}) => (
    <a href={href} className="text-link">{children}</a>
);

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Shopee',
    description: 'So sánh thẻ tín dụng và ghi nợ có cashback Shopee từ các ngân hàng Việt Nam. Xếp hạng tự động theo tỷ lệ hoàn tiền thực tế, phí thường niên và điều kiện áp dụng.',
    url: '/linh-vuc/shopee',
    personaSlug: 'shopee',
    rankingTitle: 'Xếp hạng thẻ hoàn tiền Shopee tốt nhất',
    intro: 'Trang so sánh thẻ hoàn tiền Shopee tốt nhất tại Việt Nam, tổng hợp các thẻ tín dụng có ưu đãi cashback khi mua sắm trên sàn thương mại điện tử lớn nhất Việt Nam. Mức hoàn tiền trong danh sách dao động từ 1% đến 10% tùy thẻ và điều kiện áp dụng. Một số thẻ yêu cầu chi tiêu tối thiểu mỗi tháng mới được kích hoạt cashback, trong khi một số thẻ khác áp dụng ngay từ giao dịch đầu tiên mà không có điều kiện. Bảng xếp hạng dưới đây giúp bạn so sánh mức hoàn thực tế theo ngân sách chi tiêu Shopee của mình.',
    faqs: [
        {
            q: 'Dùng MSB Visa Online mua sắm Shopee như thế nào cho tối ưu?',
            a: <><L href="/the/msb-visa-online">MSB Visa Online</L> hoàn 10% khi mua sắm Shopee, nhưng yêu cầu chi tiêu tối thiểu 3 triệu/tháng mới được tính điểm. Ở đúng mức 3 triệu, thẻ đạt trần hoàn 300.000 VND ngay, vì vậy không cần chi thêm để tối đa cashback Shopee. Điểm Loyalty tích lũy cần yêu cầu hoàn thủ công qua app MSB mBank, không tự động vào sao kê.</>,
            aText: 'MSB Visa Online hoàn 10% khi mua sắm Shopee, nhưng yêu cầu chi tiêu tối thiểu 3 triệu/tháng mới được tính điểm. Ở đúng mức 3 triệu, thẻ đạt trần hoàn 300.000 VND ngay. Điểm Loyalty tích lũy cần yêu cầu hoàn thủ công qua app MSB mBank.',
        },
        {
            q: 'Chi khoảng 3 triệu tại Shopee mỗi tháng, dùng thẻ nào?',
            a: <>Ở mức 3 triệu/tháng, <L href="/the/msb-visa-online">MSB Visa Online</L> hoàn khoảng 300.000 VND (10%) nếu đạt đủ ngưỡng tối thiểu. Nếu không chắc chi đủ 3 triệu mỗi tháng, <L href="/the/woori-vv-hype-point-gold">Woori VV Hype Point Gold</L> hoàn khoảng 240.000 VND (8%) mà không có điều kiện chi tiêu tối thiểu, ít rủi ro hơn.</>,
            aText: 'Ở mức 3 triệu/tháng, MSB Visa Online hoàn khoảng 300.000 VND (10%) nếu đạt đủ ngưỡng tối thiểu. Nếu không chắc chi đủ 3 triệu mỗi tháng, Woori VV Hype Point Gold hoàn khoảng 240.000 VND (8%) mà không có điều kiện chi tiêu tối thiểu.',
        },
        {
            q: 'Chi 20-50 triệu tại Shopee mỗi tháng (kinh doanh, dropship), thẻ nào hoàn nhiều nhất?',
            a: <>Ở mức chi tiêu cao, tất cả thẻ chuyên Shopee đều bị giới hạn cashback ở 300.000 VND/tháng. <L href="/the/woori-visa-z">Woori Visa Z</L> (2% mọi giao dịch, không phí thường niên) thực tế hoàn cao hơn ở mức này với trần 500.000 VND, đạt khi chi khoảng 25 triệu/tháng. Đây là lựa chọn phù hợp hơn cho người có doanh số Shopee lớn.</>,
            aText: 'Ở mức chi tiêu cao, tất cả thẻ chuyên Shopee đều bị giới hạn cashback ở 300.000 VND/tháng. Woori Visa Z (2% mọi giao dịch, không phí thường niên) hoàn cao hơn với trần 500.000 VND, đạt khi chi khoảng 25 triệu/tháng.',
        },
        {
            q: 'Thẻ cashback Shopee nào hoàn tiền cao nhất theo tỷ lệ phần trăm?',
            a: <>Theo bảng xếp hạng hiện tại, <L href="/the/msb-visa-online">MSB Visa Online</L> có tỷ lệ hoàn Shopee cao nhất ở mức 10%, nhưng có trần 300.000 VND/tháng và yêu cầu chi tối thiểu 3 triệu. Tỷ lệ cao không đồng nghĩa hoàn nhiều tiền hơn ở mọi mức chi vì trần hoàn mới là yếu tố quyết định số tiền thực nhận.</>,
            aText: 'MSB Visa Online có tỷ lệ hoàn Shopee cao nhất ở mức 10%, nhưng có trần 300.000 VND/tháng và yêu cầu chi tối thiểu 3 triệu. Tỷ lệ cao không đồng nghĩa hoàn nhiều tiền hơn ở mọi mức chi.',
        },
        {
            q: 'Mức hoàn tiền tối đa hàng tháng khi mua sắm Shopee là bao nhiêu?',
            a: <>Hầu hết thẻ chuyên Shopee trong danh sách có trần hoàn 300.000 VND/tháng. <L href="/the/woori-visa-z">Woori Visa Z</L> có trần cao hơn ở mức 500.000 VND, áp dụng cho mọi giao dịch bao gồm Shopee, đạt khi chi khoảng 25 triệu/tháng.</>,
            aText: 'Hầu hết thẻ chuyên Shopee trong danh sách có trần hoàn 300.000 VND/tháng. Woori Visa Z có trần cao hơn ở mức 500.000 VND, đạt khi chi khoảng 25 triệu/tháng.',
        },
        {
            q: 'Thẻ hoàn tiền Shopee nào miễn phí thường niên?',
            a: <><L href="/the/woori-visa-z">Woori Visa Z</L> miễn phí thường niên hoàn toàn, hoàn 2% mọi giao dịch bao gồm Shopee với trần 500.000 VND/tháng. Các thẻ có tỷ lệ hoàn Shopee cao hơn như <L href="/the/msb-visa-online">MSB Visa Online</L> (399.000 VND/năm) hoặc <L href="/the/woori-vv-hype-point-gold">Woori VV Hype Point Gold</L> (500.000 VND/năm) đều thu phí và không có chương trình miễn phí theo điều kiện.</>,
            aText: 'Woori Visa Z miễn phí thường niên hoàn toàn, hoàn 2% mọi giao dịch bao gồm Shopee với trần 500.000 VND/tháng. MSB Visa Online (399.000 VND/năm) và Woori VV Hype Point Gold (500.000 VND/năm) đều thu phí.',
        },
        {
            q: 'Thanh toán Shopee qua ShopeePay có được tính hoàn tiền không?',
            a: 'Nạp tiền vào ShopeePay rồi dùng số dư ShopeePay để thanh toán thường không được tính vì đó là giao dịch nạp ví, không phải giao dịch mua sắm trực tiếp bằng thẻ. Thanh toán qua thẻ liên kết trực tiếp trong app Shopee, hoặc Apple Pay và Samsung Pay đã liên kết với thẻ, thường được tính hoàn tiền. Kiểm tra điều khoản của từng thẻ để xác nhận trước khi chi tiêu.',
        },
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Lĩnh vực', href: '/linh-vuc'},
        {label: 'Thẻ Shopee'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default function ShopeeCardsPage() {
    return <PersonaPage config={CONFIG}/>;
}
