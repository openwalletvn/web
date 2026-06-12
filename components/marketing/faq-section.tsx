import {OwAccordion} from '@/components/owui/ow-accordion';
import NeuralBackground from "@/components/ui/flow-field-background";
import Link from 'next/link';

const faqs = [
  {
    value: 'faq-1',
    trigger: 'OpenWallet là gì?',
    content: (
      <p>OpenWallet là công cụ so sánh và tư vấn thẻ ngân hàng độc lập tại Việt Nam. Chúng tôi giúp bạn tìm thẻ phù hợp nhất với thói quen chi tiêu của mình, dựa trên dữ liệu thực tế, không quảng cáo. Thử ngay <Link href="/card-match" className="text-link">Card Match</Link> hoặc <Link href="/card-battle" className="text-link">Card Battle</Link>.</p>
    ),
  },
  {
    value: 'faq-3',
    trigger: 'Card Match hoạt động như thế nào?',
    content: (
      <p>Bạn nhập thói quen chi tiêu hàng tháng (ăn uống, di chuyển, mua sắm...) và mức chi tiêu tương ứng. Hệ thống tính toán cashback thực tế từng thẻ và xếp hạng theo lợi ích cao nhất cho bạn. <Link href="/card-match" className="text-link">Dùng Card Match ngay.</Link></p>
    ),
  },
  {
    value: 'faq-5',
    trigger: 'Owie là gì?',
    content: (
      <p>Owie là trợ lý AI do OpenWallet xây dựng, chuyên tư vấn thẻ tín dụng. Owie truy vấn trực tiếp database của chúng tôi, không tìm kiếm web, không bịa số liệu. Hoàn toàn miễn phí, không cần tạo tài khoản. <Link href="/owie-chat" className="text-link">Tìm hiểu về Owie.</Link></p>
    ),
  },
  {
    value: 'faq-6',
    trigger: 'Owie có lưu lịch sử chat của tôi không?',
    content: (
      <p>Không. Lịch sử chat chỉ lưu trên trình duyệt của bạn (localStorage), không gửi lên server. Xóa cache trình duyệt là xóa hoàn toàn lịch sử. <Link href="/owie-chat" className="text-link">Xem chi tiết về Owie.</Link></p>
    ),
  },
  {
    value: 'faq-7',
    trigger: 'Dữ liệu thẻ lấy từ đâu?',
    content: (
      <p>Từ database nội bộ của OpenWallet, được xây dựng và kiểm duyệt thủ công. Owie và các công cụ so sánh đều truy vấn trực tiếp nguồn này, không dùng tìm kiếm web hay dữ liệu bên ngoài. Bạn cũng có thể kết nối database này qua <Link href="/mcp" className="text-link">OpenWallet MCP</Link>.</p>
    ),
  },
  {
    value: 'faq-8',
    trigger: 'Tôi có cần tạo tài khoản để dùng OpenWallet không?',
    content: (
      <p>Không. Tất cả tính năng, bao gồm <Link href="/card-match" className="text-link">Card Match</Link>, <Link href="/card-battle" className="text-link">Card Battle</Link> và <Link href="/owie-chat" className="text-link">Owie Chat</Link>, đều hoàn toàn miễn phí và không yêu cầu đăng ký hay đăng nhập.</p>
    ),
  },
  {
    value: 'faq-10',
    trigger: 'Làm sao để liên hệ hoặc góp ý cho OpenWallet?',
    content: (
      <p>Bạn có thể liên hệ qua trang <Link href="/lien-he" className="text-link">Liên hệ</Link>, tham gia cộng đồng trên <Link href="https://discord.gg/bsnHax5BYZ" target="_blank" rel="noopener noreferrer" className="text-link">Discord</Link>, hoặc mở issue trên <Link href="https://github.com/openwalletvn" target="_blank" rel="noopener noreferrer" className="text-link">GitHub</Link>. Chúng tôi không nhận chỉnh sửa database trực tiếp, mọi cập nhật dữ liệu đều qua quy trình kiểm duyệt nội bộ.</p>
    ),
  },
];

export function FaqSection() {
  return (
    <section className="ow-faq-section md:py-16 py-12 relative min-h-screen flex justify-center items-center">

      <NeuralBackground
        color="#E8321A" // Indigo-400
        scale={1}
        trailOpacity={0.05} // Lower = longer trails
        speed={0.1}
      />

      <div className="ow-container relative z-2">
        <div className="bg-primary md:p-20 px-3 py-6 ow-rounded-large">
          <div className=" mx-auto">
            <h2 className="ow-section-title text-center sm:mb-8 mb-6 text-white">Câu hỏi thường gặp</h2>
            <OwAccordion items={faqs} className=""/>
          </div>
        </div>
      </div>
    </section>
  );
}
