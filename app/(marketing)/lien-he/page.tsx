import type {Metadata} from 'next';
import {ProsePageShell} from '@/components/layout/prose-page-shell';

export const metadata: Metadata = {
    title: 'Liên hệ | OpenWallet',
    description: 'Liên hệ với đội ngũ OpenWallet để góp ý, báo lỗi dữ liệu, hoặc yêu cầu API key cho OpenWallet MCP.',
};

export default function Page() {
    return (
        <ProsePageShell title="Liên hệ">
                    <div className="flex flex-col gap-10">
                        <Section title="Liên hệ chung">
                            <p>Mọi góp ý, báo lỗi dữ liệu thẻ, hoặc thắc mắc về dịch vụ, vui lòng gửi đến:</p>
                            <p>
                                <a href="mailto:hello@openwallet.vn" className="underline hover:opacity-70 transition-opacity font-medium">
                                    hello@openwallet.vn
                                </a>
                            </p>
                            <p>Chúng tôi cố gắng phản hồi trong vòng 2 ngày làm việc.</p>
                        </Section>

                        <Section title="Yêu cầu API key (OpenWallet MCP)">
                            <p>OpenWallet MCP hiện đang trong giai đoạn beta. Để yêu cầu key thử nghiệm, gửi email với tiêu đề <strong>OpenWallet MCP Key Request</strong> đến:</p>
                            <p>
                                <a
                                    href="mailto:hello@openwallet.vn?subject=OpenWallet MCP Key Request"
                                    className="underline hover:opacity-70 transition-opacity font-medium"
                                >
                                    hello@openwallet.vn
                                </a>
                            </p>
                            <p>Key có thời hạn và được quản lý thủ công trong giai đoạn này. Chúng tôi sẽ phản hồi kèm hướng dẫn cấu hình.</p>
                        </Section>

                        <Section title="Báo lỗi dữ liệu">
                            <p>Nếu bạn phát hiện thông tin thẻ không chính xác (lãi suất, phí, ưu đãi), hãy gửi email kèm tên thẻ và nội dung cần chỉnh sửa. Chúng tôi xem xét và cập nhật trong thời gian sớm nhất.</p>
                        </Section>
                    </div>
        </ProsePageShell>
    );
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-display-md">{title}</h2>
            <div className="flex flex-col gap-3 text-body text-slate-700 [&_strong]:font-semibold [&_a]:text-[#EF3C23]">
                {children}
            </div>
        </section>
    );
}
