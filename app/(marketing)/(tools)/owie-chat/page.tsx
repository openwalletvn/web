import type {Metadata} from 'next';
import Link from 'next/link';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';
import {getTool} from '@/lib/tools';
import {ProsePageShell} from '@/components/layout/prose-page-shell';
import {buildTitle} from '@/lib/page-meta/title';
import {OpenOwieButton} from '@/components/chat/open-owie-button';

const BASE_URL = 'https://openwallet.vn';
const tool = getTool('Owie Chat');

export const metadata: Metadata = {
    title: buildTitle('Owie - Trợ lý tư vấn thẻ AI'),
    description: 'Owie là trợ lý AI của OpenWallet, giúp bạn tìm thẻ ngân hàng phù hợp, so sánh hoàn tiền, và tra cứu phí. Hoàn toàn miễn phí, không cần đăng ký.',
    openGraph: {
        title: 'Owie - Trợ lý tư vấn thẻ AI của OpenWallet',
        description: 'Hỏi Owie về thẻ ngân hàng Việt Nam: hoàn tiền, phí thường niên, thẻ tốt nhất cho nhu cầu của bạn.',
        url: `${BASE_URL}${tool.href}`,
    },
};


function Section({title, children}: { title: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="heading-3">{title}</h2>
            <div className="flex flex-col gap-3 text-body text-slate-700">
                {children}
            </div>
        </section>
    );
}

function InfoBox({children}: { children: React.ReactNode }) {
    return (
        <div className="border-l-4 border-slate-300 pl-4 text-sm text-slate-600 flex flex-col gap-2">
            {children}
        </div>
    );
}

export default function OwieChatPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'SoftwareApplication',
                name: 'Owie - Trợ lý tư vấn thẻ AI OpenWallet',
                url: `${BASE_URL}${tool.href}`,
                description: 'Trợ lý AI giúp tìm và so sánh thẻ ngân hàng Việt Nam. Miễn phí, không cần tài khoản.',
                applicationCategory: 'FinanceApplication',
                operatingSystem: 'All',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'VND',
                },
            },
            buildBreadcrumbJsonLd([
                {label: 'Trang chủ', href: '/'},
                {label: 'Owie Chat', href: tool.href},
            ]),
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <ProsePageShell
                title="Owie - Trợ lý tư vấn thẻ AI"
                subtitle="CT ơi, hôm nay cần Owie giải đáp điều gì? Owie ở đây luôn sẵn sàng tư vấn thẻ ngân hàng, miễn phí, không cần đăng ký."
            >
                <div className="flex flex-col gap-10">
                    <section>
                        <OpenOwieButton/>
                    </section>

                    <Section title="Owie là ai?">
                        <p>
                            Owie là trợ lý AI do team <Link href="/ve-openwallet"
                                                            className="text-link">OpenWallet</Link> xây dựng,
                            chuyên tư vấn thẻ tín dụng và thẻ ghi nợ tại Việt Nam.
                            Owie không hoạt động như chatbot thông thường. Thay vì trả lời từ trí nhớ,
                            Owie truy vấn trực tiếp cơ sở dữ liệu OpenWallet qua MCP để lấy thông tin mới nhất trước khi
                            trả lời.
                        </p>
                        <p>
                            Owie không tìm kiếm web. Không suy đoán. Không bịa số.
                            Nếu không có dữ liệu, Owie sẽ nói thẳng thay vì đưa ra con số không chính xác.
                        </p>
                    </Section>

                    <Section title="Owie làm được gì?">
                        <p className="font-semibold">Miễn phí, không cần tài khoản</p>
                        <p>Không đăng ký, không mật khẩu. Mở chat là dùng được ngay.</p>
                        <p className="font-semibold mt-3">Dữ liệu thực, không bịa đặt thông tin</p>
                        <p>Owie không tìm kiếm web. Mọi câu trả lời đều dựa trên dữ liệu thẻ thực tế từ cơ sở dữ liệu
                            OpenWallet, cập nhật liên tục qua <Link href="/mcp" className="text-link">OpenWallet MCP</Link>. Owie không bịa số, không suy đoán. Nếu
                            không tìm thấy dữ liệu, Owie sẽ nói thẳng.</p>
                        <p className="font-semibold mt-3">Hỏi tự nhiên vu vơ và nhận gợi ý cụ thể</p>
                        <p>Không cần biết tên thẻ. Chỉ cần mô tả: &ldquo;tôi hay đặt đồ ăn và đi cafe, thẻ nào phù
                            hợp?&rdquo; Owie sẽ tìm và gợi ý giúp bạn.</p>
                    </Section>

                    <Section title="Ví dụ câu hỏi">
                        <div className="grid gap-3">
                            {[
                                'Thẻ nào hoàn tiền tốt nhất cho mua sắm siêu thị?',
                                'So sánh Vietcombank Cashback với MB JCB Sakura.',
                                'Tôi chi 5 triệu/tháng cho ăn uống và cafe, thẻ nào phù hợp?',
                                'Techcombank có thẻ nào miễn phí thường niên không?',
                                'Thẻ nào tốt nhất để dùng ở nước ngoài?',
                            ].map(q => (
                                <div key={q} className="px-4 py-3 bg-muted rounded-2xl text-sm text-slate-600 font-mono">
                                    &ldquo;{q}&rdquo;
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Minh bạch">
                        <InfoBox>
                            <p>
                                <strong>Owie chạy trên model AI miễn phí từ.</strong>{' '}
                                Chúng tôi chọn miễn phí để Owie có thể dùng được mà không cần đăng ký hay trả tiền.
                                OpenWallet là dự án phi thương mại, không có quảng cáo, không nhận hoa hồng từ ngân
                                hàng.
                            </p>
                            <p>
                                Mỗi model miễn phí có giới hạn lượt dùng theo ngày. Khi giới hạn đạt,
                                Owie sẽ thông báo trong chat. Nếu điều này xảy ra thường xuyên,{' '}
                                <Link href="/lien-he" className="text-link">liên hệ với chúng tôi</Link>.
                                Phản hồi của bạn giúp chúng tôi biết khi nào cần nâng cấp lên model trả phí và tìm cách
                                tài trợ cho chi phí đó.
                            </p>
                            <p>
                                <strong>Tin nhắn của bạn được lưu trên thiết bị của bạn</strong> qua localStorage.
                                Nếu bạn dùng chế độ ẩn danh, đổi trình duyệt, hoặc xóa dữ liệu trình duyệt,
                                lịch sử chat sẽ mất và không thể khôi phục. Chúng tôi không lưu lịch sử trên server.
                            </p>
                            <p>
                                <strong>Câu hỏi và câu trả lời của bạn được ghi log qua
                                    Langfuse</strong> (langfuse.com),
                                một dịch vụ bên thứ ba chúng tôi dùng để theo dõi chất lượng và cải thiện Owie.
                                Log bao gồm: câu hỏi bạn gửi, câu trả lời của Owie, và các công cụ Owie đã dùng.
                                Dữ liệu này không được bán hay chia sẻ cho bên thứ ba vì mục đích thương mại.
                            </p>
                        </InfoBox>
                    </Section>

                    <Section title="Góp ý và yêu cầu">
                        <p>
                            Nếu bạn có góp ý cho Owie, muốn Owie biết thêm về loại thẻ nào đó,
                            hoặc muốn trao đổi về khả năng dùng Owie không giới hạn hoặc tích hợp riêng, hãy{' '}
                            <Link href="/lien-he" className="text-link">liên hệ với chúng tôi</Link>.
                            Chúng tôi đọc mọi phản hồi.
                        </p>
                        <div>
                            <OpenOwieButton label="Bắt đầu hỏi Owie"/>
                        </div>
                    </Section>
                </div>
            </ProsePageShell>
        </>
    );
}
