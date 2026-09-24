# Báo cáo QA — Tamas Flower Store V1

Ngày kiểm tra: 24/09/2026

## Kết quả

| Hạng mục | Trạng thái | Ghi chú |
| --- | --- | --- |
| Trang chủ `/` | Đạt | Không còn scroll ngang; hero có khoảng đệm phải cho “Tamas Flower Store”. |
| Catalog `/san-pham` | Đạt | Đã bỏ khoảng trống do rule grid toàn cục và ổn định lưới 4 / 3 / 2 cột. |
| Chi tiết sản phẩm `/san-pham/[slug]` | Đạt | CTA Zalo/điện thoại rõ ràng, metadata và canonical theo từng mẫu. |
| Về Tamas `/ve-tamas` | Đạt | Tiêu đề desktop không còn vỡ dòng dọc; ảnh điện thoại được giới hạn kích thước hiển thị. |
| Liên hệ `/lien-he` | Đạt | Liên kết liên hệ, mạng xã hội và Google Maps hoạt động theo cấu trúc tĩnh. |
| Mobile 375px | Đạt | Hero, menu, catalog 2 cột và thanh liên hệ cố định không che nội dung. |
| Tablet 768px | Đạt | Catalog, bộ lọc cuộn ngang và thanh liên hệ hiển thị đúng. |
| Desktop 1440px | Đạt | Hero, catalog, chi tiết và Về Tamas giữ bố cục editorial, không tràn ngang. |
| Lint | Đạt | `npm run lint` không lỗi. |
| TypeScript + production build | Đạt | `npm run build` hoàn tất, 24 trang tĩnh/SSG được tạo. |

## Các lỗi đã xử lý

- Khoảng trống giữa thẻ sản phẩm: nguyên nhân là selector `:nth-child(4)` của grid trang chủ tác động sang catalog.
- Chữ tiêu đề bị xuống dòng quá nhiều: giới hạn chiều rộng và thang chữ được điều chỉnh theo breakpoint.
- Ảnh nguồn từ điện thoại: giảm khung hiển thị trên các vùng lớn, dùng `sizes` theo ngữ cảnh; hero chính dùng ảnh độ phân giải cao.
- Scroll ngang ở trang chủ: hero được clip theo trục ngang và ghi chú dọc có khoảng đệm phải.
- Mobile safe area: thanh Gọi / Zalo / Facebook tính thêm vùng đáy của iPhone.
- SEO: metadata tĩnh cho các route chính; metadata, canonical và Open Graph theo từng chi tiết sản phẩm.
- Bảo mật liên kết: toàn bộ liên kết ngoài mở tab mới dùng `noopener noreferrer`.

## Hạn chế cần chủ shop xác nhận

- Các ảnh sản phẩm gốc ngoài hero phần lớn có độ phân giải thấp (ảnh điện thoại); giới hạn kích thước giúp giảm vỡ ảnh nhưng không thể thay thế ảnh gốc chất lượng cao.
- Tên mẫu, giá, giá giao hàng, tình trạng hoa mỗi ngày và mô tả chi tiết phải được Tamas xác nhận trước khi công khai.
- Chưa có tên miền production nên sitemap/robots/canonical chỉ hoàn chỉnh khi khai báo `NEXT_PUBLIC_SITE_URL`.
- Production build nhắc `metadataBase` đang dùng localhost cho ảnh Open Graph; đây là hệ quả của việc chưa có tên miền chính thức, không phải lỗi giao diện.

## Rà soát giao diện

Kiểm tra cơ học giao diện chỉ trả về các advisory nhầm cho thang chữ `42–75px` và `60px`; các giá trị này đã được ghi trong DESIGN.md hoặc cần thiết để giữ tiếng Việt dễ đọc ở mobile. Không có lỗi cấu trúc hoặc lỗi UI mức chặn được phát hiện.
