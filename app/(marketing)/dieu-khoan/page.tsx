import type {Metadata} from 'next';
import {ProsePageShell} from '@/components/layout/prose-page-shell';

export const metadata: Metadata = {
    title: 'Điều khoản sử dụng | OpenWallet',
    description: 'Điều khoản và điều kiện sử dụng dịch vụ OpenWallet, nền tảng so sánh thẻ ngân hàng tại Việt Nam.',
};

export default function Page() {
    return (
        <ProsePageShell title="Điều khoản sử dụng" subtitle="Cập nhật lần cuối: 24 tháng 5, 2026">
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
                            <p>Dữ liệu thô về sản phẩm tài chính (lãi suất, phí, tính năng thẻ) có nguồn gốc từ thông tin công khai của các ngân hàng và tổ chức phát hành. Tuy nhiên, <strong>cơ sở dữ liệu thẻ được tuyển chọn, chuẩn hóa và cấu trúc hóa</strong> bởi OpenWallet là tài sản trí tuệ độc quyền của OpenWallet Vietnam.</p>
                            <p>Các nội dung và tính năng sau đây thuộc quyền sở hữu của OpenWallet Vietnam:</p>
                            <ul>
                                <li>Cơ sở dữ liệu thẻ được tuyển chọn và chuẩn hóa</li>
                                <li>Thuật toán xếp hạng, so sánh và gợi ý thẻ</li>
                                <li>Bài viết phân tích, hướng dẫn và nội dung biên tập gốc</li>
                                <li>Thiết kế giao diện, trải nghiệm người dùng và mã nguồn nền tảng</li>
                                <li>Tính năng gợi ý thẻ và so sánh thẻ cá nhân hóa</li>
                                <li>Các tính năng hiện tại và tương lai của nền tảng</li>
                            </ul>
                            <p>Bạn được phép chia sẻ liên kết đến website, nhưng không được sao chép, tái bản hoặc sử dụng thương mại các nội dung và tính năng thuộc sở hữu của OpenWallet Vietnam mà không có sự đồng ý bằng văn bản.</p>
                        </Section>

                        <Section title="5. Mã nguồn và giấy phép">
                            <p>Mã nguồn của nền tảng OpenWallet được công bố công khai trên GitHub với mục đích giáo dục và cộng đồng, theo giấy phép <strong>PolyForm Noncommercial License 1.0.0</strong>.</p>
                            <p>Theo giấy phép này:</p>
                            <ul>
                                <li>Bạn được phép sử dụng, sao chép và chỉnh sửa mã nguồn cho mục đích <strong>phi thương mại</strong> (học tập, nghiên cứu, dự án cá nhân)</li>
                                <li>Mọi sử dụng thương mại — bao gồm xây dựng sản phẩm cạnh tranh hoặc kiếm lợi nhuận từ mã nguồn — đều bị <strong>nghiêm cấm</strong> khi chưa có văn bản cho phép</li>
                                <li>Mọi bản phân phối hoặc tác phẩm phái sinh phải ghi rõ OpenWallet Vietnam là tác giả gốc và đính kèm giấy phép này</li>
                            </ul>
                            <p>Giấy phép đầy đủ có tại file <code>LICENSE</code> trong từng repository. Văn bản pháp lý gốc: <a href="https://polyformproject.org/licenses/noncommercial/1.0.0/" className="text-link" target="_blank" rel="noopener noreferrer">polyformproject.org/licenses/noncommercial/1.0.0</a>.</p>
                            <p>Lưu ý: giấy phép mã nguồn không bao gồm cơ sở dữ liệu thẻ — dữ liệu thẻ chịu điều khoản riêng và là tài sản độc quyền của OpenWallet Vietnam như đề cập tại mục 4.</p>
                        </Section>

                        <Section title="6. Liên kết bên ngoài">
                            <p>Website có thể chứa liên kết đến các trang web của bên thứ ba. Chúng tôi không kiểm soát và không chịu trách nhiệm về nội dung, chính sách bảo mật hay hoạt động của các trang web đó. Việc truy cập các liên kết này là quyết định của riêng bạn.</p>
                        </Section>

                        <Section title="7. Giới hạn trách nhiệm">
                            <p>OpenWallet cung cấp dịch vụ "nguyên trạng" (as-is) và không bảo đảm tính chính xác tuyệt đối, đầy đủ hay cập nhật của thông tin. Chúng tôi không chịu trách nhiệm về bất kỳ tổn thất hay thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.</p>
                        </Section>

                        <Section title="8. Thay đổi điều khoản">
                            <p>Chúng tôi có quyền cập nhật các điều khoản này bất kỳ lúc nào. Phiên bản mới nhất luôn được đăng tại trang này. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.</p>
                        </Section>

                        <Section title="9. Luật áp dụng">
                            <p>Các điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.</p>
                        </Section>

                        <Section title="10. Liên hệ">
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
