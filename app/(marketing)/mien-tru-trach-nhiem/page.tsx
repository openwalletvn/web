import type {Metadata} from 'next';
import {ProsePageShell} from '@/components/layout/prose-page-shell';
import {buildTitle} from '@/lib/page-meta/title';

export const metadata: Metadata = {
    title: buildTitle('Miễn Trừ Trách Nhiệm'),
    description: 'Tuyên bố miễn trừ trách nhiệm của OpenWallet về tính chính xác của thông tin và quyết định tài chính cá nhân.',
};

export default function Page() {
    return (
        <ProsePageShell title="Miễn trừ trách nhiệm" subtitle="Cập nhật lần cuối: 19 tháng 5, 2026">
                    <div className="flex flex-col gap-10">
                        <Section title="1. Thông tin chỉ mang tính tham khảo">
                            <p>Toàn bộ nội dung trên <strong>openwallet.vn</strong>, bao gồm thông tin thẻ ngân hàng, so sánh sản phẩm, bài viết phân tích và hướng dẫn, chỉ mang tính chất thông tin và tham khảo.</p>
                            <p>OpenWallet <strong>không phải</strong> tổ chức tài chính, ngân hàng hay công ty tư vấn đầu tư được cấp phép. Nội dung trên website không cấu thành lời khuyên tài chính, đầu tư, tín dụng hay pháp lý dưới bất kỳ hình thức nào.</p>
                        </Section>

                        <Section title="2. Độ chính xác của thông tin">
                            <p>Chúng tôi nỗ lực duy trì thông tin chính xác và cập nhật. Tuy nhiên, các điều kiện sản phẩm tài chính (lãi suất, phí, ưu đãi và chính sách) có thể thay đổi bất kỳ lúc nào theo quyết định của từng ngân hàng và tổ chức phát hành.</p>
                            <p>OpenWallet không đảm bảo tính đầy đủ, chính xác hay cập nhật của bất kỳ thông tin nào trên website. Trước khi đưa ra quyết định tài chính, bạn nên xác minh trực tiếp với ngân hàng hoặc tổ chức phát hành thẻ.</p>
                        </Section>

                        <Section title="3. Quyết định tài chính cá nhân">
                            <p>Mọi quyết định tài chính, bao gồm việc đăng ký thẻ, vay vốn, đầu tư hay chuyển ngân hàng, hoàn toàn thuộc trách nhiệm cá nhân của bạn. OpenWallet không chịu trách nhiệm về bất kỳ tổn thất tài chính, thiệt hại hay hậu quả nào phát sinh từ:</p>
                            <ul>
                                <li>Quyết định được đưa ra dựa trên thông tin từ website</li>
                                <li>Sự sai lệch giữa thông tin trên website và điều kiện thực tế của sản phẩm</li>
                                <li>Thay đổi chính sách sản phẩm sau khi thông tin được đăng tải</li>
                                <li>Gián đoạn hoặc lỗi trong việc truy cập website</li>
                            </ul>
                        </Section>

                        <Section title="4. Quan hệ với ngân hàng và đối tác">
                            <p>Hiện tại OpenWallet không có quan hệ đối tác thương mại với bất kỳ ngân hàng hay tổ chức tài chính nào. Nếu trong tương lai các quan hệ đó được thiết lập, chúng tôi cam kết công khai rõ ràng tại các vị trí liên quan trên website.</p>
                            <p>Sự xuất hiện của một sản phẩm hoặc ngân hàng trên OpenWallet không đồng nghĩa với việc chúng tôi bảo lãnh hay khuyến nghị sản phẩm đó.</p>
                        </Section>

                        <Section title="5. Hiệu suất trong quá khứ">
                            <p>Đối với các nội dung liên quan đến lợi suất, cashback hay ưu đãi: kết quả và lợi ích trong quá khứ không đảm bảo cho kết quả tương lai. Giá trị thực tế phụ thuộc vào hành vi chi tiêu cá nhân và điều kiện áp dụng cụ thể của từng sản phẩm.</p>
                        </Section>

                        <Section title="6. Giới hạn bồi thường">
                            <p>Trong phạm vi tối đa được pháp luật Việt Nam cho phép, OpenWallet và các thành viên, nhân viên, đối tác không chịu trách nhiệm bồi thường về bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên hay hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.</p>
                        </Section>

                        <Section title="7. Tư vấn chuyên nghiệp">
                            <p>Chúng tôi khuyến khích bạn tham khảo ý kiến của chuyên gia tài chính, cố vấn đầu tư hoặc luật sư có chứng chỉ hành nghề trước khi đưa ra các quyết định tài chính quan trọng.</p>
                        </Section>

                        <Section title="8. Liên hệ">
                            <p>Nếu bạn phát hiện thông tin không chính xác hoặc cần làm rõ, vui lòng liên hệ qua <a href="/lien-he" className="text-link">trang liên hệ</a>.</p>
                        </Section>
                    </div>
        </ProsePageShell>
    );
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-display-md">{title}</h2>
            <div className="flex flex-col gap-3 text-body text-slate-700 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ul]:list-disc [&_strong]:font-semibold [&_a]:text-[#EF3C23]">
                {children}
            </div>
        </section>
    );
}
