import type {Metadata} from 'next';
import Link from 'next/link';
import {OwButton} from '@/components/owui/ow-button';
import {ProsePageShell} from '@/components/layout/prose-page-shell';
import {buildTitle} from '@/lib/page-meta/title';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';

export const metadata: Metadata = {
    title: buildTitle('Chính Sách Bảo Mật'),
    description: 'Chính sách bảo mật của OpenWallet: cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.',
};

export default function Page() {
    const jsonLd = buildBreadcrumbJsonLd([
        {label: 'Trang chủ', href: '/'},
        {label: 'Chính sách bảo mật'},
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <ProsePageShell title="Chính sách bảo mật" subtitle="Cập nhật lần cuối: 7 tháng 6, 2026">
                <div className="flex flex-col gap-10">
                    <Section title="1. Cam kết bảo mật">
                        <p>OpenWallet (<strong>openwallet.vn</strong>) coi trọng sự riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin khi bạn sử dụng dịch vụ.</p>
                    </Section>

                    <Section title="2. Thông tin chúng tôi thu thập">
                        <p><strong>Thông tin tự động:</strong> Khi truy cập website, hệ thống tự động ghi nhận địa chỉ IP, loại trình duyệt, hệ điều hành, trang bạn truy cập và thời gian truy cập. Dữ liệu này được dùng để phân tích lưu lượng và cải thiện dịch vụ.</p>
                        <p><strong>Dữ liệu cục bộ:</strong> Một số tính năng của OpenWallet cho phép lưu trữ dữ liệu trực tiếp trên thiết bị của bạn (IndexedDB). Chúng tôi <strong>không</strong> có quyền truy cập vào dữ liệu này.</p>
                        <p><strong>Lịch sử chat Owie:</strong> Tin nhắn bạn gửi cho Owie được lưu trên thiết bị của bạn qua localStorage. Chúng tôi không lưu lịch sử chat trên server. Nếu bạn dùng chế độ ẩn danh hoặc xóa dữ liệu trình duyệt, lịch sử chat sẽ mất và không thể khôi phục.</p>
                        <p><strong>Log chat Owie qua Langfuse:</strong> Câu hỏi bạn gửi Owie, câu trả lời và các công cụ Owie đã dùng được ghi log qua <a href="https://langfuse.com" className="text-link" target="_blank" rel="noopener noreferrer">Langfuse</a>, dịch vụ bên thứ ba chúng tôi dùng để theo dõi chất lượng và cải thiện Owie. Dữ liệu này không được bán hay chia sẻ cho bên thứ ba vì mục đích thương mại.</p>
                        <p><strong>Cookie và công nghệ theo dõi:</strong> Chúng tôi sử dụng cookie cần thiết để website hoạt động bình thường, và cookie phân tích để hiểu cách người dùng tương tác với dịch vụ.</p>
                    </Section>

                    <Section title="3. Mục đích sử dụng thông tin">
                        <p>Thông tin thu thập được sử dụng để:</p>
                        <ul>
                            <li>Cải thiện tính năng và nội dung của website.</li>
                            <li>Phân tích lưu lượng truy cập và hành vi người dùng.</li>
                            <li>Theo dõi chất lượng và cải thiện trợ lý Owie.</li>
                            <li>Ngăn chặn gian lận và đảm bảo an toàn hệ thống.</li>
                            <li>Tuân thủ nghĩa vụ pháp lý.</li>
                        </ul>
                        <p>Chúng tôi không bán, cho thuê hay trao đổi thông tin cá nhân của bạn với bên thứ ba vì mục đích thương mại.</p>
                    </Section>

                    <Section title="4. Chia sẻ thông tin">
                        <p>Chúng tôi có thể chia sẻ thông tin trong các trường hợp sau:</p>
                        <ul>
                            <li><strong>Nhà cung cấp dịch vụ:</strong> Các đối tác kỹ thuật giúp vận hành website (hosting, phân tích, giám sát chất lượng AI), chỉ trong phạm vi cần thiết và có ràng buộc bảo mật.</li>
                            <li><strong>Yêu cầu pháp lý:</strong> Khi có yêu cầu từ cơ quan nhà nước có thẩm quyền theo quy định pháp luật Việt Nam.</li>
                            <li><strong>Bảo vệ quyền lợi:</strong> Khi cần thiết để bảo vệ quyền lợi, tài sản hoặc sự an toàn của OpenWallet, người dùng hoặc công chúng.</li>
                        </ul>
                    </Section>

                    <Section title="5. Lưu trữ và bảo mật dữ liệu">
                        <p>Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu khỏi truy cập trái phép, mất mát hoặc tiết lộ. Tuy nhiên, không có hệ thống nào đảm bảo an toàn tuyệt đối qua internet.</p>
                        <p>Dữ liệu phân tích được lưu giữ trong thời gian tối đa 26 tháng, sau đó tự động xóa.</p>
                    </Section>

                    <Section title="6. Quyền của bạn">
                        <p>Bạn có quyền:</p>
                        <ul>
                            <li>Yêu cầu biết chúng tôi lưu giữ thông tin gì về bạn.</li>
                            <li>Yêu cầu xóa dữ liệu cá nhân (nơi chúng tôi kiểm soát).</li>
                            <li>Từ chối cookie phân tích thông qua cài đặt trình duyệt.</li>
                            <li>Xuất hoặc xóa dữ liệu ví cục bộ bất kỳ lúc nào từ thiết bị của bạn.</li>
                        </ul>
                    </Section>

                    <Section title="7. Website của bên thứ ba">
                        <p>OpenWallet có thể chứa liên kết đến website của ngân hàng và tổ chức tài chính. Chính sách bảo mật này không áp dụng cho các website đó. Chúng tôi khuyến khích bạn đọc chính sách bảo mật của từng website trước khi cung cấp thông tin cá nhân.</p>
                    </Section>

                    <Section title="8. Thay đổi chính sách">
                        <p>Chúng tôi có thể cập nhật chính sách này khi cần thiết. Mọi thay đổi sẽ được đăng tại trang này với ngày cập nhật mới. Chúng tôi khuyến khích bạn kiểm tra định kỳ.</p>
                    </Section>

                    <Section title="9. Liên hệ">
                        <p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ với chúng tôi.</p>
                        <div>
                            <OwButton asChild size="sm">
                                <Link href="/lien-he">Liên hệ với chúng tôi</Link>
                            </OwButton>
                        </div>
                    </Section>
                </div>
            </ProsePageShell>
        </>
    );
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="heading-3">{title}</h2>
            <div className="flex flex-col gap-3 text-body text-slate-700 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ul]:list-disc [&_strong]:font-semibold">
                {children}
            </div>
        </section>
    );
}
