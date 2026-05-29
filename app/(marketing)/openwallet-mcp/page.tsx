import type { Metadata } from 'next';
import Link from 'next/link';
import { buildBreadcrumbJsonLd } from '@/lib/page-meta/breadcrumb';
import { ProsePageShell } from '@/components/layout/prose-page-shell';
import { McpVersionBadge } from '@/components/mcp/mcp-version-badge';
import {buildTitle} from '@/lib/page-meta/title';

export const metadata: Metadata = {
    title: buildTitle('OpenWallet MCP'),
    description: 'OpenWallet MCP là MCP server cho phép các AI tools như Claude, ChatGPT truy cập dữ liệu thẻ ngân hàng Việt Nam. Không giới hạn trong ứng dụng OpenWallet, dữ liệu có thể được khai thác qua bất kỳ AI assistant nào hỗ trợ MCP.',
    openGraph: {
        title: 'OpenWallet MCP',
        description: 'MCP server mang dữ liệu thẻ ngân hàng Việt Nam đến mọi AI tool hỗ trợ Model Context Protocol.',
        url: 'https://openwallet.vn/openwallet-mcp',
    },
};

const TOOLS = [
    {
        name: 'listBanks',
        label: 'Danh sách ngân hàng',
        desc: 'Liệt kê tất cả ngân hàng phát hành thẻ tại Việt Nam kèm thông tin mạng lưới.',
    },
    {
        name: 'resolveBank',
        label: 'Tìm ngân hàng',
        desc: 'Tra cứu ID ngân hàng từ tên thông thường hoặc tên viết tắt.',
    },
    {
        name: 'listIntents',
        label: 'Danh mục chi tiêu',
        desc: 'Liệt kê các mục đích chi tiêu được hỗ trợ để lọc và xếp hạng thẻ.',
    },
    {
        name: 'searchCards',
        label: 'Tìm kiếm thẻ',
        desc: 'Tìm thẻ theo từ khoá, ngân hàng, loại thẻ, mạng lưới hoặc danh mục chi tiêu.',
    },
    {
        name: 'resolveCard',
        label: 'Tìm thẻ theo tên',
        desc: 'Tra cứu ID thẻ từ tên thông thường để dùng với các công cụ khác.',
    },
    {
        name: 'getCardDetail',
        label: 'Chi tiết thẻ',
        desc: 'Xem đầy đủ thông tin thẻ: phí thường niên, hạn mức, ưu đãi hoàn tiền và điều kiện.',
    },
    {
        name: 'rankCardsForSpend',
        label: 'Xếp hạng theo chi tiêu',
        desc: 'Xếp hạng thẻ tối ưu dựa trên thói quen chi tiêu thực tế của người dùng.',
    },
    {
        name: 'compareCards',
        label: 'So sánh thẻ',
        desc: 'So sánh song song hai hoặc nhiều thẻ về phí, ưu đãi và điều kiện.',
    },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="heading-3">{title}</h2>
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
                url: 'https://openwallet.vn/openwallet-mcp',
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
                { label: 'OpenWallet MCP', href: '/openwallet-mcp' },
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
                    <Section title="Tại sao chúng tôi xây dựng điều này?">
                        <p>
                            OpenWallet được xây dựng trước tiên như một thư mục dữ liệu thẻ ngân hàng Việt Nam, nơi tổng hợp và chuẩn hoá thông tin từ nhiều nguồn. Chúng tôi nhận ra rằng dữ liệu này có giá trị hơn nhiều khi nó có thể được khai thác qua AI, không bị giới hạn trong một ứng dụng cụ thể.
                        </p>
                        <p>
                            OpenWallet MCP được xây dựng trên nền API của OpenWallet, cho phép các AI tools như Claude hay ChatGPT truy cập và lý luận trực tiếp trên dữ liệu thẻ ngân hàng Việt Nam theo thời gian thực. Người dùng có thể hỏi AI về thẻ tín dụng ngay trong công cụ quen thuộc của mình, thay vì phải mở thêm một ứng dụng khác.
                        </p>
                    </Section>

                    <Section title="8 công cụ có sẵn">
                        <div className="grid gap-3">
                            {TOOLS.map(tool => (
                                <div key={tool.name} className="flex gap-4 p-4 border border-border rounded-lg">
                                    <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded h-fit shrink-0 mt-0.5">{tool.name}</code>
                                    <div>
                                        <p className="text-sm font-medium mb-0.5">{tool.label}</p>
                                        <p className="text-sm text-slate-500">{tool.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Thử ngay">
                        <p>
                            Chúng tôi có public MCP inspector tại{' '}
                            <a
                                href="https://inspector.openwallet.vn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-link"
                            >
                                inspector.openwallet.vn
                            </a>
                            , bạn có thể gọi trực tiếp các tool và xem kết quả ngay trong trình duyệt mà không cần cài đặt gì.
                        </p>
                    </Section>

                    <Section title="Ứng dụng đầu tiên">
                        <p>
                            Consumer đầu tiên của OpenWallet MCP là{' '}
                            <Link href="/openwallet-chat" className="text-link">
                                OpenWallet Chat
                            </Link>
                            , tính năng chat AI được tích hợp trực tiếp vào OpenWallet. Đây là minh chứng thực tế cho thấy MCP có thể mang lại trải nghiệm tư vấn thẻ ngân hàng qua AI như thế nào.
                        </p>
                    </Section>
                </div>
            </ProsePageShell>
        </>
    );
}
