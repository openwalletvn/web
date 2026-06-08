import type {Metadata} from 'next';
import Link from 'next/link';
import {buildBreadcrumbJsonLd} from '@/lib/page-meta/breadcrumb';
import {ProsePageShell} from '@/components/layout/prose-page-shell';
import {McpVersionBadge} from '@/components/mcp/mcp-version-badge';
import {buildTitle} from '@/lib/page-meta/title';
import {OpenOwieButton} from '@/components/chat/open-owie-button';

export const metadata: Metadata = {
    title: buildTitle('OpenWallet MCP'),
    description: 'OpenWallet MCP là MCP server cho phép các AI tools như Claude, ChatGPT truy cập dữ liệu thẻ ngân hàng Việt Nam. Không giới hạn trong ứng dụng OpenWallet, dữ liệu có thể được khai thác qua bất kỳ AI assistant nào hỗ trợ MCP.',
    openGraph: {
        title: 'OpenWallet MCP',
        description: 'MCP server mang dữ liệu thẻ ngân hàng Việt Nam đến mọi AI tool hỗ trợ Model Context Protocol.',
        url: 'https://openwallet.vn/mcp',
    },
};

const GITHUB_URL = 'https://github.com/openwalletvn/mcp';
const MCP_SPEC_URL = 'https://modelcontextprotocol.io/';
const INSPECTOR_URL = 'https://inspector.openwallet.vn';

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-4">
            {title && <h2 className="heading-3">{title}</h2>}
            <div className="flex flex-col gap-3 text-body text-slate-700">
                {children}
            </div>
        </section>
    );
}

export default function McpPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'SoftwareApplication',
                name: 'OpenWallet MCP',
                url: 'https://openwallet.vn/mcp',
                description: 'Model Context Protocol server cung cấp dữ liệu thẻ ngân hàng Việt Nam cho các AI assistant.',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'All',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'VND',
                },
            },
            buildBreadcrumbJsonLd([
                { label: 'Trang chủ', href: '/' },
                { label: 'OpenWallet MCP', href: '/mcp' },
            ]),
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProsePageShell
                title="OpenWallet MCP"
                subtitle="MCP server mang dữ liệu thẻ ngân hàng Việt Nam đến mọi AI tool hỗ trợ Model Context Protocol."
            >
                <McpVersionBadge />
                <div className="flex flex-col gap-10">
                    <Section>
                        <p>
                            OpenWallet MCP là cầu nối giữa OpenWallet API và thế giới AI. Thông qua giao thức{' '}
                            <a href={MCP_SPEC_URL} target="_blank" rel="noopener noreferrer" className="text-link">
                                Model Context Protocol
                            </a>
                            , bất kỳ AI assistant nào như Claude, ChatGPT, hay Cursor đều có thể truy cập toàn bộ dữ
                            liệu thẻ ngân hàng tại OpenWallet, tìm kiếm, xếp hạng và so sánh thẻ theo nhu cầu chi tiêu
                            thực tế mà không cần mở thêm ứng dụng nào.
                        </p>
                        <p>
                            API của OpenWallet hiện là private, OpenWallet MCP là con đường chính thức để các AI tool
                            khai thác dữ liệu này.
                        </p>
                    </Section>

                    <Section title="Thử với Owie">
                        <p>
                            <Link href="/owie-chat" className="text-link">Owie</Link> là AI assistant của OpenWallet,
                            được xây dựng trực tiếp trên OpenWallet MCP. Đây là cách nhanh nhất để trải nghiệm những gì
                            MCP này có thể làm.
                        </p>
                        <p><OpenOwieButton label="Hỏi Owie ngay"/></p>
                    </Section>

                    <Section title="MCP Inspector">
                        <p>
                            MCP Inspector là giao diện web cho phép gọi trực tiếp từng tool của OpenWallet MCP và xem
                            kết quả trả về ngay trong trình duyệt, không cần cài đặt hay cấu hình gì.
                        </p>
                        <p>
                            Thay vì phải tích hợp MCP vào một AI client, Inspector cho phép kiểm tra từng tool một cách
                            độc lập: xem danh sách tool có sẵn, truyền tham số, và đọc response thô từ server. Đây là
                            cách nhanh nhất để hiểu OpenWallet MCP cung cấp những gì trước khi tích hợp vào workflow
                            của bạn.
                        </p>
                        <p>
                            Truy cập{' '}
                            <a href={INSPECTOR_URL} target="_blank" rel="noopener noreferrer" className="text-link">
                                inspector.openwallet.vn
                            </a>
                            {' '}để bắt đầu ngay.
                        </p>
                        <div className="rounded-2xl overflow-hidden border border-slate-200 mt-2">
                            <video
                                src="/videos/mcp-inspector.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full"
                            />
                        </div>
                    </Section>

                    <Section title="Kết nối MCP vào AI của bạn">
                        <p>
                            Hướng dẫn kết nối OpenWallet MCP vào Claude Desktop, Cursor và các AI tool khác đang được
                            chuẩn bị. Theo dõi cập nhật qua{' '}
                            <Link href="/lien-he" className="text-link">
                                kênh liên hệ
                            </Link>
                            {' '}hoặc tham gia Discord server của chúng tôi để nhận thông báo sớm nhất.
                        </p>
                    </Section>

                    <Section title="Mã nguồn mở">
                        <p>
                            OpenWallet MCP được phát triển mở. Xem mã nguồn, báo lỗi hoặc đóng góp tại{' '}
                            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-link">
                                github.com/openwalletvn/mcp
                            </a>
                            .
                        </p>
                    </Section>
                </div>
            </ProsePageShell>
        </>
    );
}
