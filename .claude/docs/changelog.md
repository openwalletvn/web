# Changelog — Hướng dẫn quản lý

## Mục đích

Changelog tại `content/changelog.mdx` là tín hiệu tin tưởng (trust signal) cho hai nhóm đối tượng:

1. **Người dùng cuối** — thấy sản phẩm được cập nhật thường xuyên, có chiều sâu, không phải vibe coding qua đêm
2. **Developer và AI engineer** — thấy kiến trúc được xây dựng có hệ thống, dữ liệu qua pipeline chuẩn, test suite đầy đủ, quyết định kỹ thuật có lý do rõ ràng

**Mục tiêu:** Người đọc changelog phải thấy: đây là team hiểu sâu về nghiệp vụ, xây dựng cẩn thận, ra quyết định kỹ thuật dựa trên lý do thực tế.

---

## Khi nào thêm entry

Thêm entry sau khi hoàn thành:

- Thêm hoặc cập nhật dữ liệu ngân hàng/thẻ (kể cả nhỏ, nếu đi kèm cải tiến pipeline)
- Ra mắt tính năng mới (ranking, so sánh, chat, MCP, evals)
- Thay đổi API đáng kể (endpoint mới, filter mới, cải tiến response)
- Quyết định hạ tầng quan trọng (Vercel migration, Hono refactor, test suite)
- Tối ưu kỹ thuật có tác động rõ ràng (WebP/LQIP, cache headers, ISR)

**Không thêm entry cho:**
- Thay đổi giao diện thuần túy (màu sắc, spacing, typography) không kèm tính năng mới
- Sửa lỗi nhỏ không ảnh hưởng người dùng
- Thay đổi nội dung trang marketing
- Cấu hình internal không lộ ra ngoài

---

## Format

```mdx
## YYYY-MM-DD | Tiêu đề ngắn gọn, rõ ràng

- Bullet mô tả WHAT và WHY, không chỉ liệt kê tính năng
- Nếu có quyết định kỹ thuật, giải thích lý do (vd: "Cloudflare không hỗ trợ dynamicParams, chuyển sang Vercel")
- Technical terms giữ tiếng Anh (API, IndexedDB, MCP, SSR, ISR, WebP, LQIP...)
- Tối đa 4 bullets mỗi entry; ưu tiên chất lượng hơn số lượng
```

**Thứ tự:** Newest first (entry mới nhất ở trên cùng).

**Tiêu đề:** Ngắn, cụ thể. Tránh chung chung như "Cập nhật hệ thống" hay "Cải tiến hiệu năng".

---

## Tone

- **Chuyên nghiệp, cụ thể** — nêu số liệu khi có (39 ngân hàng, 320+ thẻ, 8 tools)
- **Honest về trạng thái** — tính năng beta ghi rõ "(beta)", WIP ghi "(đang phát triển)"
- **Không marketing** — không dùng từ ngữ quảng cáo như "đột phá", "tuyệt vời", "mạnh mẽ"
- **Không em dash (—) trong nội dung bullet** — dùng dấu phẩy, dấu hai chấm hoặc viết lại câu

---

## Ví dụ tốt vs xấu

**Tốt:**
```
- API refactor từ Next.js sang Hono + Cloudflare Workers, tối ưu cho Edge Runtime với bundle size nghiêm ngặt
- Mỗi ngân hàng đi qua pipeline đầy đủ: scraper thu thập, Groq trích xuất, Zod validate, admin review trước khi publish
```

**Xấu:**
```
- Cập nhật dữ liệu MB Bank
- Cải tiến hệ thống để tốt hơn
- Thêm nhiều tính năng mới
```

---

## Lệnh nhanh

Dùng `/add-changelog` để thêm entry mới theo đúng format — lệnh này đã được cấu hình để nhắc nhở các rule trên.

---

## Lưu ý cho LLM

Trước khi thêm entry, kiểm tra:
1. Tính năng đã thực sự deploy chưa, hay còn WIP?
2. URL hoặc endpoint đề cập còn hoạt động không?
3. Số liệu (số ngân hàng, số thẻ, số tools) có còn chính xác không? Verify từ code thực tế, không dùng số cũ trong memory.
4. Không nhắc đến tính năng đã bị deprecated hoặc rename mà không cập nhật URL mới.
