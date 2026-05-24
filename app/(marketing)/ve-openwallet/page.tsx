import type {Metadata} from 'next';
import {ProsePageShell} from '@/components/layout/prose-page-shell';

export const metadata: Metadata = {
    title: 'Về OpenWallet | Ai đứng sau dự án này',
    description: 'OpenWallet là dự án với mong muốn giúp người Việt so sánh thẻ ngân hàng một cách độc lập và minh bạch, không bị ảnh hưởng bởi hoa hồng hay quan hệ đối tác với ngân hàng.',
};

export default function Page() {
    return (
        <ProsePageShell title="Về OpenWallet">
                    <div className="flex flex-col gap-10">
                        <Section title="Chúng tôi là ai">
                            <p>OpenWallet được vận hành bởi một development studio nhỏ tại Sài Gòn.</p>
                            <p>Người sáng lập là kỹ sư phần mềm với sở thích làm việc với dữ liệu và đam mê đóng góp cho các dự án mã nguồn mở. OpenWallet là điểm giao thoa giữa hai mối quan tâm đó: dữ liệu tài chính thực và một sản phẩm có thể giúp ích cho người dùng Việt Nam.</p>
                        </Section>

                        <Section title="Tại sao xây dựng OpenWallet">
                            <p>OpenWallet không được xây dựng để cạnh tranh với bất kỳ nền tảng nào đang tồn tại.</p>
                            <p>Dự án bắt đầu từ mục tiêu cụ thể: thực hành kỹ năng kỹ thuật với dữ liệu tài chính thực, và xây dựng một sản phẩm có thể giúp người dùng đưa ra quyết định về thẻ ngân hàng mà không bị ảnh hưởng bởi hoa hồng hay quan hệ đối tác với ngân hàng.</p>
                            <p>Hầu hết các trang so sánh thẻ hiện tại có nguồn thu từ hoa hồng giới thiệu. Điều đó không có gì sai, nhưng nó tạo ra động lực ngầm để ưu tiên thẻ trả hoa hồng cao hơn thẻ thực sự phù hợp với người dùng. OpenWallet không nhận hoa hồng từ bất kỳ ngân hàng nào. Toàn bộ hệ thống gợi ý thẻ hoạt động độc lập.</p>
                        </Section>

                        <Section title="Tương lai">
                            <p>Một số tính năng đang được phát triển, tùy theo thời gian cho phép:</p>
                            <ul>
                                <li><strong>Gợi ý thẻ cá nhân hóa:</strong> người dùng nhập thói quen chi tiêu, hệ thống đề xuất thẻ phù hợp nhất dựa trên dữ liệu thực, không phải mức độ quảng cáo.</li>
                                <li><strong>Đóng góp dữ liệu cộng đồng:</strong> người dùng có thể gửi chỉnh sửa thông tin thẻ, qua quy trình xét duyệt trước khi được cập nhật.</li>
                                <li><strong>Chatbot hỏi đáp về thẻ:</strong> dựa trên RAG, để trả lời các câu hỏi cụ thể mà không cần tự tìm kiếm thủ công.</li>
                                <li><strong>Mã nguồn mở:</strong> khi codebase đủ ổn định, dự án sẽ được public để cộng đồng cùng đóng góp.</li>
                            </ul>
                            <p>Tiến độ phụ thuộc vào thời gian rảnh. Không có cam kết ngày ra mắt cụ thể cho bất kỳ tính năng nào.</p>
                        </Section>

                        <Section title="Một lời muốn nói">
                            <p>OpenWallet không cạnh tranh với bất kỳ nền tảng nào đang tồn tại. Nhiều cá nhân và cộng đồng đã bỏ thời gian thực sự để tạo ra nội dung chất lượng mà không có lợi ích thương mại, và chúng tôi tôn trọng điều đó.</p>
                            <p>Đây là dự án được xây dựng với sự thận trọng. Nếu bạn phát hiện thông tin không chính xác hoặc có góp ý, hãy liên hệ qua <a href="/lien-he" className="underline hover:opacity-70 transition-opacity">trang liên hệ</a>.</p>
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
