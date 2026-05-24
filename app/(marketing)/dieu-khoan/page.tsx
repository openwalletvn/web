import type {Metadata} from 'next';
import {ProsePageShell} from '@/components/layout/prose-page-shell';

export const metadata: Metadata = {
    title: 'Điều khoản sử dụng | OpenWallet',
    description: 'Điều khoản và điều kiện sử dụng dịch vụ OpenWallet, nền tảng so sánh thẻ ngân hàng tại Việt Nam.',
};

export default function Page() {
    return (
        <ProsePageShell title="Điều khoản sử dụng" subtitle="Cập nhật lần cuối: 19 tháng 5, 2026">
                    <div className="flex flex-col gap-10">
                        <Section title="1. Giới thiệu">
                            <p>Chào mừng bạn đến với OpenWallet (<strong>openwallet.vn</strong>). Bằng cách truy cập hoặc sử dụng website này, bạn đồng ý bị ràng buộc bởi các điều khoản và điều kiện dưới đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ.</p>
                        </Section>

                        <Section title="2. Mô tả dịch vụ">
                            <p>OpenWallet là nền tảng thông tin và so sánh thẻ ngân hàng tại Việt Nam. Chúng tôi cung cấp:</p>
                            <ul>
                                <li>Thông tin, tính năng và điều kiện của các loại thẻ ngân hàng</li>
                                <li>Công cụ so sánh thẻ dựa trên nhu cầu cá nhân</li>
                                <li>Bài viết hướng dẫn, phân tích và tin tức tài chính cá nhân</li>
                            </ul>
                            <p>Mọi thông tin trên OpenWallet chỉ mang tính chất tham khảo. Chúng tôi không phải tổ chức tài chính và không cung cấp dịch vụ ngân hàng, tín dụng hay đầu tư.</p>
                        </Section>

                        <Section title="3. Quyền và nghĩa vụ của người dùng">
                            <p>Khi sử dụng OpenWallet, bạn đồng ý:</p>
                            <ul>
                                <li>Không sử dụng dịch vụ cho mục đích trái pháp luật hoặc gây hại cho người khác</li>
                                <li>Không cào dữ liệu (scrape), sao chép hoặc phân phối nội dung mà không có sự cho phép bằng văn bản</li>
                                <li>Không can thiệp vào hoạt động bình thường của hệ thống</li>
                                <li>Tự chịu trách nhiệm về quyết định tài chính cá nhân dựa trên thông tin từ website</li>
                            </ul>
                        </Section>

                        <Section title="4. Sở hữu trí tuệ">
                            <p>Thông tin về sản phẩm tài chính (lãi suất, phí, tính năng thẻ) là dữ liệu công khai thuộc về các ngân hàng và tổ chức phát hành tương ứng. OpenWallet không tuyên bố quyền sở hữu đối với các dữ liệu này.</p>
                            <p>Các nội dung và tính năng sau đây thuộc quyền sở hữu của OpenWallet:</p>
                            <ul>
                                <li>Bài viết phân tích, hướng dẫn và nội dung biên tập gốc</li>
                                <li>Thiết kế giao diện, trải nghiệm người dùng và mã nguồn nền tảng</li>
                                <li>Thuật toán xếp hạng và so sánh thẻ</li>
                                <li>Tính năng gợi ý thẻ và so sánh thẻ cá nhân hóa</li>
                                <li>Các tính năng hiện tại và tương lai của nền tảng</li>
                            </ul>
                            <p>Bạn được phép chia sẻ liên kết đến website, nhưng không được sao chép, tái bản hoặc sử dụng thương mại các nội dung và tính năng thuộc sở hữu của OpenWallet mà không có sự đồng ý bằng văn bản.</p>
                        </Section>

                        <Section title="5. Liên kết bên ngoài">
                            <p>Website có thể chứa liên kết đến các trang web của bên thứ ba. Chúng tôi không kiểm soát và không chịu trách nhiệm về nội dung, chính sách bảo mật hay hoạt động của các trang web đó. Việc truy cập các liên kết này là quyết định của riêng bạn.</p>
                        </Section>

                        <Section title="6. Giới hạn trách nhiệm">
                            <p>OpenWallet cung cấp dịch vụ "nguyên trạng" (as-is) và không bảo đảm tính chính xác tuyệt đối, đầy đủ hay cập nhật của thông tin. Chúng tôi không chịu trách nhiệm về bất kỳ tổn thất hay thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.</p>
                        </Section>

                        <Section title="7. Thay đổi điều khoản">
                            <p>Chúng tôi có quyền cập nhật các điều khoản này bất kỳ lúc nào. Phiên bản mới nhất luôn được đăng tại trang này. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.</p>
                        </Section>

                        <Section title="8. Luật áp dụng">
                            <p>Các điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.</p>
                        </Section>

                        <Section title="9. Liên hệ">
                            <p>Nếu có thắc mắc về điều khoản sử dụng, vui lòng liên hệ qua <a href="/lien-he" className="text-link">trang liên hệ</a>.</p>
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
