import type {Metadata} from 'next';
import Link from 'next/link';
import {OwButton} from '@/components/owui/ow-button';
import {ProsePageShell} from '@/components/layout/prose-page-shell';
import {buildTitle} from '@/lib/page-meta/title';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';
import {OpenOwieButton} from '@/components/chat/open-owie-button';

export const metadata: Metadata = {
    title: buildTitle('Về OpenWallet'),
    description: 'OpenWallet là dự án với mong muốn giúp người Việt so sánh thẻ ngân hàng một cách độc lập và minh bạch, với thuật toán xếp hạng và gợi ý thẻ không bị chi phối bởi quan hệ thương mại với bất kỳ ngân hàng nào.',
};

export default function Page() {
    const jsonLd = buildBreadcrumbJsonLd([
        {label: 'Trang chủ', href: '/'},
        {label: 'Về OpenWallet'},
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <ProsePageShell title="Về OpenWallet">
                    <div className="flex flex-col gap-10">
                        <Section title="Chúng tôi là ai">
                            <p>OpenWallet là công cụ so sánh và tư vấn thẻ ngân hàng Việt Nam, xây dựng trên nguyên tắc độc lập về biên tập: thuật toán xếp hạng và gợi ý thẻ không bị chi phối bởi quan hệ thương mại với bất kỳ ngân hàng nào.</p>
                        </Section>

                        <Section title="Tại sao xây dựng OpenWallet">
                            <p>OpenWallet bắt đầu từ một nhu cầu cá nhân: khi có trong tay vài tấm thẻ tín dụng và bắt đầu muốn dùng chúng thông minh hơn. Mỗi lần chi tiêu đều có câu hỏi: thẻ nào hoàn tiền nhiều hơn cho khoản này? Có thể hỏi trên các hội nhóm Facebook, nhưng với tư duy của một kỹ sư phần mềm, câu trả lời tự nhiên là xây một hệ thống.</p>
                            <p>Phiên bản đầu tiên ra đời từ ngày 16/8/2025, với cơ sở dữ liệu thẻ và MCC dưới một tên khác. OpenWallet là phiên bản 2026, kế thừa từ đó nhưng với kiến trúc database trưởng thành hơn, đủ sức xử lý từng quy tắc hoàn tiền riêng của từng thẻ. Schema đó mất nhiều tháng thử và sai để có được, và kết quả là <Link href="/card-match" className="text-link">Card Match</Link> và <Link href="/card-battle" className="text-link">Card Battle</Link> như ngày hôm nay.</p>
                            <p>Vẫn còn nhiều thứ cần cải thiện, nhưng nền móng đã được đặt. Thuật toán xếp hạng và gợi ý thẻ hoạt động độc lập, không bị chi phối bởi bất kỳ quan hệ thương mại nào với ngân hàng.</p>
                        </Section>

                        <Section title="Owie - Trợ lý tư vấn thẻ AI">
                            <p>
                                Owie là trợ lý AI do OpenWallet xây dựng, chuyên tư vấn thẻ tín dụng và thẻ ghi nợ tại Việt Nam.
                                Owie trả lời dựa trên dữ liệu thực từ cơ sở dữ liệu OpenWallet: không tìm kiếm web, không suy đoán, không bịa số.
                            </p>
                            <p>
                                Owie hoàn toàn miễn phí, không cần tạo tài khoản.{' '}
                                <Link href="/owie-chat" className="text-link">Tìm hiểu thêm về Owie</Link> hoặc bắt đầu hỏi ngay:
                            </p>
                            <div>
                                <OpenOwieButton label="Hỏi Owie" size="sm" />
                            </div>
                        </Section>

                        <Section title="Những gì OpenWallet có hôm nay">
                            <ul>
                                <li><strong><Link href="/card-battle" className="text-link">Card Battle:</Link></strong> so sánh hai thẻ bất kỳ cạnh nhau, dựa trên dữ liệu thực về phí, hoàn tiền và ưu đãi.</li>
                                <li><strong><Link href="/card-match" className="text-link">Card Match:</Link></strong> nhập thói quen chi tiêu, hệ thống xếp hạng thẻ phù hợp nhất theo nhu cầu cụ thể.</li>
                                <li><strong><Link href="/owie-chat" className="text-link">Owie Chat:</Link></strong> trợ lý AI tư vấn thẻ, trả lời dựa trên dữ liệu thực, miễn phí, không cần đăng ký.</li>
                                <li><strong><Link href="/mcp" className="text-link">OpenWallet MCP</Link>:</strong> kết nối dữ liệu thẻ OpenWallet với AI chatbot của bạn như Claude hay ChatGPT qua Model Context Protocol.</li>
                            </ul>
                        </Section>

                        <Section title="Mã nguồn mở và cộng đồng">
                            <p>
                                Website OpenWallet là mã nguồn mở tại{' '}
                                <Link href="https://github.com/openwalletvn" target="_blank" rel="noopener noreferrer" className="text-link">github.com/openwalletvn</Link>{' '}
                                với giấy phép phù hợp. Bạn có thể xem code, báo lỗi, hoặc đề xuất tính năng qua GitHub.
                            </p>
                            <p>
                                Cơ sở dữ liệu thẻ không mở để chỉnh sửa trực tiếp. Chúng tôi duy trì quy trình kiểm duyệt nội bộ để đảm bảo chất lượng và tính chính xác của dữ liệu.
                                Nếu bạn phát hiện thông tin thẻ không chính xác, vui lòng{' '}
                                <Link href="/lien-he" className="text-link">liên hệ với chúng tôi</Link>.
                            </p>
                        </Section>

                        <Section title="Một lời muốn nói">
                            <p>OpenWallet không cạnh tranh với bất kỳ nền tảng nào đang tồn tại. Nhiều cá nhân và cộng đồng đã bỏ thời gian thực sự để tạo ra nội dung chất lượng mà không có lợi ích thương mại, và chúng tôi tôn trọng điều đó.</p>
                            <p>Đây là dự án được xây dựng với sự thận trọng. Nếu bạn phát hiện thông tin không chính xác hoặc có góp ý, vui lòng liên hệ với chúng tôi.</p>
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
