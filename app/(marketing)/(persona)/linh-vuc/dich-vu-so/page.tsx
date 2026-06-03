import type {Metadata} from 'next';
import {getCards} from '@/lib/api';
import {generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {PersonaPage} from '../persona-page';

const L = ({href, children}: {href: string; children: string}) => (
    <a href={href} className="text-link">{children}</a>
);

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Dịch Vụ Số',
    description: 'So sánh thẻ thanh toán dịch vụ số quốc tế tại Việt Nam: ChatGPT, Claude, Netflix, Spotify. Tìm thẻ ít bị từ chối, phí ngoại tệ thấp. Xếp hạng tự động theo thực tế.',
    url: '/linh-vuc/dich-vu-so',
    personaSlug: 'digital',
    rankingTitle: 'Xếp hạng thẻ theo cashback dịch vụ số',
    intro: 'Trang so sánh thẻ hoàn tiền dịch vụ số tốt nhất tại Việt Nam tổng hợp các thẻ có cashback khi thanh toán ChatGPT Plus, Claude, Netflix, Spotify và các nền tảng số quốc tế định kỳ. Mức hoàn tiền dao động từ 3% đến 20%, nhưng các thẻ có tỷ lệ cao nhất thường đi kèm trần hoàn rất thấp, có thể bị đạt chỉ sau 500.000 đến 1,5 triệu đồng chi tiêu mỗi tháng. Đặc điểm chung của danh mục này là không yêu cầu chi tiêu tối thiểu, nhưng trần hoàn theo tháng quyết định số tiền thực nhận nhiều hơn tỷ lệ phần trăm. Bảng xếp hạng dưới đây tính toán số tiền hoàn theo từng mức chi để bạn chọn thẻ phù hợp với ngân sách đăng ký dịch vụ số hàng tháng.',
    faqs: [
        {
            q: 'Dùng MSB mDigi như thế nào cho tối ưu với danh mục dịch vụ số?',
            a: <><L href="/the/msb-mdigi">MSB mDigi</L> hoàn 20% cho dịch vụ số nhưng yêu cầu chọn đúng danh mục "Sản phẩm số" qua app MSB mBank trước khi kỳ mới bắt đầu. Danh mục tự động giữ nguyên sang kỳ tiếp theo nếu không thay đổi, nên chỉ cần thiết lập một lần. Trần hoàn 300.000 VND đạt khi chi khoảng 1,5 triệu, và tiền hoàn cần yêu cầu thủ công qua app, hết hạn sau 12 tháng nếu không rút.</>,
            aText: 'MSB mDigi hoàn 20% cho dịch vụ số nhưng yêu cầu chọn đúng danh mục "Sản phẩm số" qua app MSB mBank trước khi kỳ mới bắt đầu. Danh mục tự động giữ nguyên sang kỳ tiếp theo nếu không thay đổi. Trần hoàn 300.000 VND đạt khi chi khoảng 1,5 triệu.',
        },
        {
            q: 'Chi khoảng 1,5 triệu tại dịch vụ số mỗi tháng, dùng thẻ nào?',
            a: <>Ở mức 1,5 triệu/tháng, <L href="/the/msb-mdigi">MSB mDigi</L> hoàn khoảng 300.000 VND (20%) nếu đã chọn danh mục dịch vụ số trong kỳ, đây là mức hoàn cao nhất ở ngưỡng chi tiêu này. Nếu không muốn quản lý việc chọn danh mục mỗi tháng, <L href="/the/vcb-digicard">VCB DigiCard</L> hoàn khoảng 75.000 VND (5%) mà không có điều kiện gì, không thu phí thường niên.</>,
            aText: 'Ở mức 1,5 triệu/tháng, MSB mDigi hoàn khoảng 300.000 VND (20%) nếu đã chọn danh mục dịch vụ số trong kỳ. VCB DigiCard hoàn khoảng 75.000 VND (5%) không có điều kiện, không thu phí thường niên.',
        },
        {
            q: 'Chi 20 triệu tại dịch vụ số mỗi tháng, thẻ nào hoàn nhiều nhất?',
            a: <>Ở mức chi tiêu cao, <L href="/the/uob-one">UOB One</L> hoàn khoảng 1.000.000 VND (5%, không giới hạn theo danh mục số riêng) vượt trội so với <L href="/the/ocb-mastercard-lifestyle">OCB Mastercard Lifestyle</L> bị trần 600.000 VND. Các thẻ chuyên digital như MSB mDigi đều bị trần 300.000 VND từ mức 1,5 triệu trở đi, không tăng thêm dù chi nhiều hơn.</>,
            aText: 'Ở mức 20 triệu/tháng, UOB One hoàn khoảng 1.000.000 VND vượt OCB Mastercard Lifestyle (trần 600.000 VND). Các thẻ chuyên digital như MSB mDigi bị trần 300.000 VND từ 1,5 triệu trở đi.',
        },
        {
            q: 'Thẻ dịch vụ số nào hoàn tiền cao nhất theo tỷ lệ phần trăm hiện tại?',
            a: <><L href="/the/msb-mdigi">MSB mDigi</L> và <L href="/the/bidv-jcb-hybrid">BIDV JCB Hybrid</L> đều có tỷ lệ hoàn 20% cho dịch vụ số, nhưng cơ chế khác nhau đáng kể. BIDV chỉ hoàn cho 305 khách hàng có giao dịch sớm nhất mỗi tháng và trần chỉ 100.000 VND, nên phụ thuộc vào may mắn. MSB mDigi trần 300.000 VND và áp dụng ổn định hơn, nhưng cần chọn đúng danh mục mỗi kỳ. Tỷ lệ cao không đảm bảo hoàn nhiều hơn ở mọi mức chi, trần hoàn mới là yếu tố quyết định.</>,
            aText: 'MSB mDigi và BIDV JCB Hybrid đều hoàn 20% cho dịch vụ số. BIDV chỉ áp dụng cho 305 khách đầu tiên mỗi tháng, trần 100.000 VND. MSB mDigi ổn định hơn với trần 300.000 VND nhưng cần chọn danh mục mỗi kỳ.',
        },
        {
            q: 'Mức hoàn tiền tối đa hàng tháng cho dịch vụ số là bao nhiêu?',
            a: <>Mức trần hoàn dao động từ 100.000 VND (<L href="/the/bidv-jcb-hybrid">BIDV JCB Hybrid</L>) đến 1.000.000 VND (<L href="/the/uob-one">UOB One</L>). Với chi tiêu dịch vụ số thông thường dưới 5 triệu/tháng, <L href="/the/msb-mdigi">MSB mDigi</L> cho trần 300.000 VND là mức cao nhất thực tế đạt được. Trần cao hơn của UOB One chỉ có lợi từ mức chi khoảng 12 triệu trở lên.</>,
            aText: 'Mức trần hoàn dao động từ 100.000 VND (BIDV JCB Hybrid) đến 1.000.000 VND (UOB One). Với chi tiêu dưới 5 triệu/tháng, MSB mDigi trần 300.000 VND là cao nhất thực tế. UOB One có lợi từ khoảng 12 triệu/tháng trở lên.',
        },
        {
            q: 'Thẻ dịch vụ số nào miễn phí thường niên?',
            a: <><L href="/the/vcb-digicard">VCB DigiCard</L> miễn phí thường niên hoàn toàn và hoàn 5% cho dịch vụ số với trần 300.000 VND/tháng, phù hợp nếu không muốn lo phí hàng năm. <L href="/the/bidv-jcb-hybrid">BIDV JCB Hybrid</L> có phí thấp nhất trong số các thẻ còn lại ở mức 180.000 VND/năm, không có điều kiện miễn phí.</>,
            aText: 'VCB DigiCard miễn phí thường niên hoàn toàn, hoàn 5% dịch vụ số trần 300.000 VND/tháng. BIDV JCB Hybrid có phí thấp nhất ở mức 180.000 VND/năm, không có điều kiện miễn.',
        },
        {
            q: 'MSB mDigi có bắt buộc chọn danh mục dịch vụ số mỗi tháng không?',
            a: 'Không cần chọn lại mỗi tháng. MSB mDigi tự động giữ nguyên danh mục đã chọn sang kỳ tiếp theo, chỉ cần thiết lập một lần và thay đổi khi muốn chuyển sang danh mục khác. Mỗi kỳ chỉ được đổi một lần, nên cần quyết định trước khi kỳ mới bắt đầu nếu muốn chuyển danh mục.',
        },
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Lĩnh vực', href: '/linh-vuc'},
        {label: 'Thẻ Dịch Vụ Số'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default function DichVuSoCardsPage() {
    return <PersonaPage config={CONFIG}/>;
}
