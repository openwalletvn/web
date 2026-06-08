import Link from 'next/link';
import {ROUTES} from '@/lib/routes';
import {OwWobbleCard} from '@/components/ow-ui/ow-wobble-card';
import {OwButton} from '@/components/ow-ui/ow-button';
const PRIMARY_TOOLS = [
    {
        name: 'Card Match',
        href: ROUTES.cardMatch,
        description: 'Nhập thói quen chi tiêu, nhận đề xuất thẻ phù hợp nhất theo nhu cầu cụ thể.',
        color: '#EF3C23',
    },
    {
        name: 'Card Battle',
        href: ROUTES.cardBattle,
        description: 'So sánh hai thẻ bất kỳ cạnh nhau, dựa trên dữ liệu thực về phí, hoàn tiền và ưu đãi.',
        color: '#1a1a1a',
    },
];

export function ToolsSection() {
    return (
        <section className="ow-tools-section py-12 relative z-1">
            <div className="ow-container flex flex-col gap-8">
                <h2>Công cụ</h2>

                {/* Primary: Card Match + Card Battle — feature tiles → OwWobbleCard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PRIMARY_TOOLS.map((tool) => (
                        <Link key={tool.href} href={tool.href}>
                            <OwWobbleCard brandColor={tool.color} className="items-start text-left gap-3 min-h-[160px]">
                                <h3 className="text-white">{tool.name} →</h3>
                                <p className="text-body text-white/70">{tool.description}</p>
                            </OwWobbleCard>
                        </Link>
                    ))}
                </div>

                {/* Secondary: Owie Chat — AI-forward, full width */}
                <OwButton asChild color="default" size="full">
                    <Link
                        href={ROUTES.owieChat}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 !max-w-full ow-rounded-large p-8"
                    >
                        <span className="flex flex-col gap-1 flex-1 text-left">
                            <h3 className="text-white">Owie Chat</h3>
                            <span className="text-body text-white/70">
                                Trợ lý AI tư vấn thẻ, trả lời dựa trên dữ liệu thực từ OpenWallet. Miễn phí, không cần đăng ký.
                            </span>
                        </span>
                        <span className="text-white/60 text-body shrink-0">Thử ngay →</span>
                    </Link>
                </OwButton>

                {/* Tertiary: MCP — dev-facing */}
                <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-body-sm text-text-muted">Dành cho developer</span>
                    <Link href={ROUTES.openwalletMcp} className="text-body-sm text-text-muted hover:text-black transition-colors">
                        OpenWallet MCP →
                    </Link>
                </div>
            </div>
        </section>
    );
}
