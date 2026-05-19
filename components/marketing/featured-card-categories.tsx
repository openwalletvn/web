export function FeaturedCardCategories() {
    return (
        <section className="ow-featured-card-categories ow-container py-32 relative z-20">
            <h2>Danh mục thẻ nổi bật</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:mt-10 mt-6">
                <div className="bg-white md:rounded-xl rounded-lg p-6 flex flex-col gap-3">
                    <h3>Tiêu dùng hàng ngày</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li><a href="/the-shopee">Thẻ Shopee</a></li>
                        <li><a href="/the-sieu-thi">Thẻ Siêu thị (Coopmart, Go, Lotte, AEON,...)</a></li>
                        <li><a href="/the-danh-cho-giao-duc">Thẻ chi tiêu giáo dục, trường học</a></li>
                        <li><a href="/the-danh-cho-y-te">Thẻ chi tiêu y tế, bệnh viện</a></li>
                        <li><a href="/the-danh-cho-bao-hiem">Thẻ chi tiêu bảo hiểm, bảo hiểm nhân thọ</a></li>
                    </ul>
                </div>

                {/* Col 2: 2 half-height blocks stacked */}
                <div className="flex flex-col gap-4">
                    <div className="md:rounded-xl rounded-lg p-6 flex flex-col gap-3 flex-1 bg-primary text-white">
                        <h3>Dịch vụ số</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li><a href="/the-cho-ai">AI: ChatGPT, Claude, Gemini,...</a></li>
                            <li><a href="/the-cho-streaming">Streaming: Netflix, Spotify,...</a></li>
                        </ul>
                    </div>

                    {/* Thẻ doanh nghiệp */}
                    <div className="bg-black text-white md:rounded-xl rounded-lg p-6 flex flex-col gap-3 flex-1">
                        <h3>Thẻ doanh nghiệp</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li><a href="/the-doanh-nghiep">Thẻ tín dụng doanh nghiệp</a></li>
                            <li><a href="/the-doanh-nghiep">Thẻ ghi nợ doanh nghiệp</a></li>
                            <li><a href="/the-doanh-nghiep-mien-phi">Thẻ doanh nghiệp miễn phí</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
