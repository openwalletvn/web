import type {Metadata} from 'next';
import {getCards} from '@/lib/api';
import {generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {PersonaPage} from '../persona-page';

const L = ({href, children}: {href: string; children: string}) => (
    <a href={href} className="text-link">{children}</a>
);

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Di Chuyển',
    description: 'So sánh thẻ ngân hàng hoàn tiền khi đi Grab, Be và di chuyển hàng ngày tại Việt Nam. Xếp hạng tự động theo cashback vận chuyển thực tế.',
    url: '/the-theo-nhu-cau/di-chuyen',
    personaSlug: 'commuter',
    rankingTitle: 'Xếp hạng thẻ theo cashback di chuyển',
    intro: 'Trang tổng hợp thẻ hoàn tiền di chuyển tại Việt Nam, so sánh các thẻ tín dụng có cashback cho Grab, Be và dịch vụ vận chuyển, theo dữ liệu hiện tại của OpenWallet. Mức hoàn tiền trong pool dao động từ 0,1% đến 20% tùy thẻ và điều kiện áp dụng. Hầu hết thẻ có trần hoàn cố định theo tháng, thường từ 200.000 đến 1.000.000 VND, nên tỷ lệ hoàn cao không đồng nghĩa với số tiền thực nhận nhiều hơn ở mọi mức chi tiêu. Bảng xếp hạng dưới đây giúp bạn so sánh cashback thực tế theo mức chi tiêu di chuyển của mình để chọn thẻ phù hợp. Hãy kiểm tra chính sách của ngân hàng để có thông tin chính xác nhất trước khi đăng ký.',
    faqs: [
        {
            q: 'Dùng Sacombank Visa Uniq như thế nào cho tối ưu?',
            a: <><L href="/the/sacombank-uniq">Sacombank Visa Uniq</L> hoàn 20% cho chi tiêu vận chuyển, nhưng trần hoàn chỉ 300.000 VND/tháng, đạt khi chi khoảng 1,5 triệu. Chi vượt mức đó không tăng thêm cashback di chuyển, vì vậy thẻ phù hợp nhất cho người chi dưới 1,5 triệu/tháng cho Grab hoặc Be. Hãy kiểm tra danh mục MCC di chuyển được áp dụng trực tiếp với ngân hàng để xác nhận.</>,
            aText: 'Sacombank Visa Uniq hoàn 20% cho chi tiêu vận chuyển, nhưng trần hoàn chỉ 300.000 VND/tháng, đạt khi chi khoảng 1,5 triệu. Chi vượt mức đó không tăng thêm cashback di chuyển. Hãy kiểm tra danh mục MCC di chuyển được áp dụng trực tiếp với ngân hàng để xác nhận.',
        },
        {
            q: 'Chi khoảng 2 triệu tại di chuyển mỗi tháng, dùng thẻ nào?',
            a: <>Ở mức 2 triệu/tháng, <L href="/the/sacombank-uniq">Sacombank Visa Uniq</L> hoàn khoảng 300.000 VND (đã đạt trần 20%), trong khi <L href="/the/uob-one">UOB One</L> hoàn khoảng 200.000 VND (10%). Sacombank Visa Uniq phù hợp nhất ở mức chi này nếu chi tiêu của bạn nằm trong danh mục MCC vận chuyển được ngân hàng công nhận.</>,
            aText: 'Ở mức 2 triệu/tháng, Sacombank Visa Uniq hoàn khoảng 300.000 VND (đã đạt trần 20%), trong khi UOB One hoàn khoảng 200.000 VND (10%). Sacombank Visa Uniq phù hợp nhất ở mức chi này.',
        },
        {
            q: 'Chi 10 triệu tại di chuyển mỗi tháng, thẻ nào hoàn nhiều nhất?',
            a: <>Ở mức 10 triệu/tháng, <L href="/the/uob-one">UOB One</L> hoàn khoảng 1.000.000 VND (10%, đã đạt trần), vượt xa <L href="/the/sacombank-uniq">Sacombank Visa Uniq</L> bị giới hạn ở 300.000 VND và <L href="/the/msb-visa-travel">MSB Visa Travel</L> ở 600.000 VND. Trần 1 triệu VND/tháng của UOB One là cao nhất trong pool hiện tại cho danh mục di chuyển. Chính sách có thể thay đổi, nên xác nhận với ngân hàng trước khi đăng ký.</>,
            aText: 'Ở mức 10 triệu/tháng, UOB One hoàn khoảng 1.000.000 VND (10%, đã đạt trần), vượt xa Sacombank Visa Uniq bị giới hạn ở 300.000 VND và MSB Visa Travel ở 600.000 VND. Trần 1 triệu VND/tháng của UOB One là cao nhất trong pool hiện tại cho danh mục di chuyển.',
        },
        {
            q: 'Thẻ di chuyển nào hoàn tiền cao nhất theo tỷ lệ phần trăm?',
            a: <>Theo dữ liệu chúng tôi có, <L href="/the/sacombank-uniq">Sacombank Visa Uniq</L> có tỷ lệ hoàn vận chuyển cao nhất ở mức 20%, nhưng trần hoàn chỉ 300.000 VND/tháng. Tỷ lệ cao không đồng nghĩa hoàn nhiều hơn ở mọi mức chi vì trần hoàn mới là yếu tố quyết định số tiền thực nhận.</>,
            aText: 'Theo dữ liệu chúng tôi có, Sacombank Visa Uniq có tỷ lệ hoàn vận chuyển cao nhất ở mức 20%, nhưng trần hoàn chỉ 300.000 VND/tháng. Tỷ lệ cao không đồng nghĩa hoàn nhiều hơn ở mọi mức chi.',
        },
        {
            q: 'Mức hoàn tiền tối đa hàng tháng là bao nhiêu?',
            a: <>Trong pool hiện tại, mức hoàn tối đa dao động từ 200.000 đến 1.000.000 VND/tháng. <L href="/the/uob-one">UOB One</L> có global cap cao nhất ở mức 1.000.000 VND áp dụng cho tổng chi tiêu bao gồm vận chuyển và Grab. <L href="/the/msb-visa-travel">MSB Visa Travel</L> có trần 600.000 VND cho tất cả giao dịch.</>,
            aText: 'Trong pool hiện tại, mức hoàn tối đa dao động từ 200.000 đến 1.000.000 VND/tháng. UOB One có global cap cao nhất ở mức 1.000.000 VND áp dụng cho tổng chi tiêu bao gồm vận chuyển và Grab. MSB Visa Travel có trần 600.000 VND cho tất cả giao dịch.',
        },
        {
            q: 'Thẻ di chuyển nào miễn phí thường niên?',
            a: <><L href="/the/woori-visa">Woori Visa</L> miễn phí thường niên hoàn toàn và hoàn 0,1% mọi giao dịch không giới hạn, nhưng tỷ lệ thấp hơn nhiều so với thẻ chuyên di chuyển. Nếu muốn cashback di chuyển cao hơn, <L href="/the/sacombank-uniq">Sacombank Visa Uniq</L> và <L href="/the/msb-visa-travel">MSB Visa Travel</L> đều có phí 599.000 VND/năm, là mức thấp nhất trong nhóm chuyên di chuyển.</>,
            aText: 'Woori Visa miễn phí thường niên hoàn toàn và hoàn 0,1% mọi giao dịch không giới hạn. Sacombank Visa Uniq và MSB Visa Travel đều có phí 599.000 VND/năm, là mức thấp nhất trong nhóm chuyên di chuyển.',
        },
        {
            q: 'Cashback di chuyển có áp dụng cho Be và taxi truyền thống không?',
            a: <>Tùy ngân hàng và cách định nghĩa danh mục. Thẻ áp theo MCC vận chuyển chung như <L href="/the/msb-visa-travel">MSB Visa Travel</L> thường tính cả Be, taxi và xe ôm công nghệ khác. Thẻ ghi Grab cụ thể trong điều khoản như <L href="/the/uob-one">UOB One</L> cần xác nhận xem Be có được tính hay không. Kiểm tra điều khoản từng thẻ trước khi chi tiêu để tránh nhầm lẫn.</>,
            aText: 'Tùy ngân hàng và cách định nghĩa danh mục. Thẻ áp theo MCC vận chuyển chung như MSB Visa Travel thường tính cả Be, taxi và xe ôm công nghệ khác. Thẻ ghi Grab cụ thể trong điều khoản như UOB One cần xác nhận xem Be có được tính hay không.',
        },
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Thẻ theo nhu cầu', href: '/the-theo-nhu-cau'},
        {label: 'Thẻ Di Chuyển'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default function CommuterCardsPage() {
    return <PersonaPage config={CONFIG}/>;
}
