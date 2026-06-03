import type {Metadata} from 'next';
import {getCards} from '@/lib/api';
import {generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {PersonaPage} from '../persona-page';

export const revalidate = 3600;

const L = ({href, children}: {href: string; children: string}) => (
    <a href={href} className="text-link">{children}</a>
);

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Gia Đình',
    description: 'So sánh thẻ ngân hàng phù hợp cho chi tiêu gia đình tại Việt Nam: siêu thị, giáo dục, y tế, bảo hiểm. Tìm thẻ hoàn tiền cao nhất cho các khoản chi thiết yếu.',
    url: '/linh-vuc/gia-dinh',
    personaSlug: 'family',
    rankingTitle: 'Xếp hạng thẻ theo ưu đãi gia đình',
    intro: 'Trang tổng hợp thẻ gia đình tốt nhất tại Việt Nam, so sánh cashback cho chi tiêu y tế, giáo dục, bảo hiểm và siêu thị trong cùng một thẻ. Mức hoàn tiền trong danh sách dao động từ 1% đến 15% tùy danh mục và điều kiện áp dụng. Khác với thẻ chuyên biệt một danh mục, phần lớn thẻ trong nhóm này không yêu cầu chi tiêu tối thiểu để kích hoạt cashback, và trần hoàn dao động từ 300.000 đến 1.000.000 VND mỗi kỳ sao kê. Bảng xếp hạng dưới đây giúp bạn so sánh số tiền hoàn thực tế theo mức chi tiêu gia đình hàng tháng để chọn thẻ phù hợp nhất.',
    faqs: [
        {
            q: 'Dùng LPBank JCB Ultimate như thế nào cho tối ưu?',
            a: <><L href="/the/lpbank-jcb-ultimate">LPBank JCB Ultimate</L> hoàn 15% cho y tế, giáo dục và bảo hiểm, trần 800.000 VND/kỳ (riêng bảo hiểm tối đa 400.000 VND). Không cần chi tiêu tối thiểu, chỉ cần chi khoảng 5,3 triệu trong các danh mục này là đạt trần hoàn tối đa. Phù hợp nhất khi dùng riêng cho y tế, học phí và bảo hiểm mỗi tháng.</>,
            aText: 'LPBank JCB Ultimate hoàn 15% cho y tế, giáo dục và bảo hiểm, trần 800.000 VND/kỳ (riêng bảo hiểm tối đa 400.000 VND). Không cần chi tiêu tối thiểu, chỉ cần chi khoảng 5,3 triệu trong các danh mục này là đạt trần hoàn tối đa.',
        },
        {
            q: 'Chi khoảng 5 triệu mỗi tháng cho y tế, giáo dục và bảo hiểm, dùng thẻ nào?',
            a: <>Chi 5 triệu/tháng, <L href="/the/lpbank-jcb-ultimate">LPBank JCB Ultimate</L> hoàn khoảng 750.000 VND (15%), vượt xa <L href="/the/msb-visa-signature">MSB Visa Signature</L> và <L href="/the/msb-mastercard-family">MSB Mastercard Family</L> cùng ở mức 500.000 VND (10%). Khi chi đủ 5,3 triệu trong các danh mục này, LPBank đạt trần 800.000 VND.</>,
            aText: 'Chi 5 triệu/tháng, LPBank JCB Ultimate hoàn khoảng 750.000 VND (15%), vượt xa MSB Visa Signature và MSB Mastercard Family cùng ở mức 500.000 VND (10%). Khi chi đủ 5,3 triệu trong các danh mục này, LPBank đạt trần 800.000 VND.',
        },
        {
            q: 'Chi 10 triệu mỗi tháng cho chi tiêu gia đình, thẻ nào hoàn nhiều nhất?',
            a: <>Từ 10 triệu/kỳ, <L href="/the/msb-visa-signature">MSB Visa Signature</L> vươn lên dẫn đầu với 1.000.000 VND (10% cho y tế, bảo hiểm, giáo dục và ẩm thực), trong khi <L href="/the/lpbank-jcb-ultimate">LPBank JCB Ultimate</L> bị giới hạn ở 800.000 VND. Ở mức chi tiêu này, <L href="/the/msb-mastercard-family">MSB Mastercard Family</L> cũng tăng lên bậc 2 với tỷ lệ 20% nhưng trần 700.000 VND.</>,
            aText: 'Từ 10 triệu/kỳ, MSB Visa Signature vươn lên dẫn đầu với 1.000.000 VND (10% cho y tế, bảo hiểm, giáo dục và ẩm thực), trong khi LPBank JCB Ultimate bị giới hạn ở 800.000 VND. Ở mức chi tiêu này, MSB Mastercard Family cũng tăng lên bậc 2 với tỷ lệ 20% nhưng trần 700.000 VND.',
        },
        {
            q: 'Thẻ gia đình nào hoàn tiền cao nhất hiện tại?',
            a: <><L href="/the/lpbank-jcb-ultimate">LPBank JCB Ultimate</L> có tỷ lệ hoàn cao nhất với 15% cho y tế, giáo dục và bảo hiểm, nhưng trần 800.000 VND/kỳ giới hạn lợi ích ở mức chi khoảng 5 triệu. Từ 10 triệu trở lên, <L href="/the/msb-visa-signature">MSB Visa Signature</L> hoàn nhiều tiền hơn nhờ trần 1.000.000 VND dù tỷ lệ chỉ 10%. Xem bảng xếp hạng để so sánh số tiền thực tế theo mức chi tiêu của bạn.</>,
            aText: 'LPBank JCB Ultimate có tỷ lệ hoàn cao nhất với 15% cho y tế, giáo dục và bảo hiểm, nhưng trần 800.000 VND/kỳ giới hạn lợi ích ở mức chi khoảng 5 triệu. Từ 10 triệu trở lên, MSB Visa Signature hoàn nhiều tiền hơn nhờ trần 1.000.000 VND dù tỷ lệ chỉ 10%.',
        },
        {
            q: 'Mức hoàn tiền tối đa hàng tháng cho chi tiêu gia đình là bao nhiêu?',
            a: <>Trần hoàn trong nhóm dao động từ 300.000 đến 1.000.000 VND/kỳ. <L href="/the/msb-visa-signature">MSB Visa Signature</L> có trần cao nhất với 1.000.000 VND áp dụng chung cho y tế, bảo hiểm, giáo dục và ẩm thực. <L href="/the/msb-mastercard-family">MSB Mastercard Family</L> đạt tối đa 900.000 VND khi chi từ 30 triệu/kỳ với bậc hoàn 30%.</>,
            aText: 'Trần hoàn trong nhóm dao động từ 300.000 đến 1.000.000 VND/kỳ. MSB Visa Signature có trần cao nhất với 1.000.000 VND áp dụng chung cho y tế, bảo hiểm, giáo dục và ẩm thực. MSB Mastercard Family đạt tối đa 900.000 VND khi chi từ 30 triệu/kỳ với bậc hoàn 30%.',
        },
        {
            q: 'Thẻ gia đình nào miễn phí thường niên?',
            a: <>Trong nhóm thẻ có cashback cho y tế, giáo dục và bảo hiểm, chưa có thẻ nào miễn phí thường niên hoàn toàn. <L href="/the/msb-super-free">MSB Super Free</L> miễn phí thường niên nhưng chỉ hoàn 1% tại siêu thị (trần 300.000 VND), không áp dụng cho y tế hay học phí. Các thẻ có cashback tốt cho chi tiêu gia đình thu phí từ 799.000 đến 1.499.000 VND/năm.</>,
            aText: 'Trong nhóm thẻ có cashback cho y tế, giáo dục và bảo hiểm, chưa có thẻ nào miễn phí thường niên hoàn toàn. MSB Super Free miễn phí thường niên nhưng chỉ hoàn 1% tại siêu thị (trần 300.000 VND), không áp dụng cho y tế hay học phí.',
        },
        {
            q: 'Thẻ gia đình có hoàn tiền cho cả siêu thị lẫn y tế trong cùng một thẻ không?',
            a: <>Có. <L href="/the/msb-mastercard-family">MSB Mastercard Family</L> hoàn 5% tại siêu thị và 10-30% (tùy bậc chi tiêu) cho y tế, giáo dục và giải trí, với trần tăng dần khi tổng chi tiêu đạt 10 triệu và 30 triệu/kỳ. Đây là điểm khác biệt so với thẻ chuyên siêu thị vốn không có cashback cho y tế hay học phí.</>,
            aText: 'Có. MSB Mastercard Family hoàn 5% tại siêu thị và 10-30% (tùy bậc chi tiêu) cho y tế, giáo dục và giải trí, với trần tăng dần khi tổng chi tiêu đạt 10 triệu và 30 triệu/kỳ.',
        },
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Lĩnh vực', href: '/linh-vuc'},
        {label: 'Thẻ Gia Đình'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default function FamilyCardsPage() {
    return <PersonaPage config={CONFIG}/>;
}
