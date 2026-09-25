# Hướng dẫn quản lý website Tamas Flower Store

Tài liệu này dành cho chị chủ shop. Chị chỉ cần dùng phần **Sản phẩm** trong trang quản lý để thêm, sửa, ẩn và kiểm tra các mẫu hoa trên website.

## 1. Website hoạt động như thế nào

**Sanity** là nơi chị nhập và quản lý thông tin sản phẩm. **Website** là nơi khách xem sản phẩm.

```text
Chị cập nhật sản phẩm trong trang quản lý
              ↓
        Nhấn Publish
              ↓
  Website hiển thị thông tin mới
```

Website hiện tại chỉ để khách xem và liên hệ đặt hoa qua Zalo hoặc điện thoại. Website chưa có giỏ hàng, thanh toán, quản lý đơn hàng hay tài khoản khách hàng.

## 2. Hai đường link cần lưu

- **Website khách xem:** https://tamas-flower-store-olive.vercel.app/
- **Trang quản lý sản phẩm:** https://tamas-flower-store-olive.vercel.app/admin

Chị nên mở mỗi link một lần rồi lưu vào Dấu trang trên trình duyệt.

## 3. Đăng nhập bằng tài khoản Google

Chị **không cần tạo hay ghi nhớ mật khẩu Sanity riêng**. Chị dùng chính tài khoản Google của mình.

Trước lần đăng nhập đầu tiên, người quản lý dự án cần mời đúng địa chỉ Gmail của chị vào **Sanity Manage → Project → Members**. Sau khi nhận lời mời:

1. Mở link trang quản lý ở trên.
2. Chọn nút **Google**.
3. Chọn đúng tài khoản Gmail đã được mời.
4. Vào mục **Sản phẩm**.

### Lưu ý cho người quản lý dự án

Mời chị chủ vào Project Members là đủ để chị dùng CMS, miễn là chị đăng nhập bằng đúng phương thức **Google** đã được mời. Sanity phân biệt tài khoản theo cách đăng nhập, nên cùng một email nhưng đăng nhập bằng Email/password thay vì Google có thể không có quyền vào project.

Hãy cấp quyền thấp nhất nhưng vẫn cho phép chị tạo, sửa và Publish sản phẩm:

- Gói có quyền **Editor**: chọn **Editor**.
- Nếu project đang dùng **Free**: Sanity hiện chỉ có Viewer và Administrator. Viewer không thể sửa/publish, vì vậy cần cân nhắc cấp **Administrator** cho chị chủ hoặc nâng gói trước khi bàn giao. Administrator có thể vào phần cài đặt, nên chị chỉ cần dùng mục **Sản phẩm**.

Không gửi mã xác thực Google, mật khẩu Google, token hay thông tin cài đặt kỹ thuật cho bất kỳ ai.

## 4. Khu vực chị dùng hằng ngày

Trong thanh bên của CMS, chị chọn **Sản phẩm** rồi chọn **Tất cả sản phẩm**. Tại đây chị có thể:

- tìm sản phẩm bằng ô tìm kiếm;
- mở một sản phẩm để sửa;
- tạo sản phẩm mới bằng **Create**;
- Publish để lưu nội dung mới lên website.

Các mục danh mục bên dưới Sản phẩm chỉ giúp xem nhanh từng nhóm hoa. Chị không cần vào phần cài đặt của project.

## 5. Thêm một sản phẩm mới

1. Vào **Sản phẩm → Tất cả sản phẩm**.
2. Chọn **Create** và chọn **Products** nếu CMS hỏi loại nội dung.
3. Điền các mục dưới đây theo thứ tự.
4. Chọn **Publish** ở góc trên bên phải.
5. Mở website để kiểm tra lại.

### Tên sản phẩm

Điền **Tên sản phẩm**. Ví dụ: `Bó hoa Pink Love`.

### Đường dẫn

Sau khi nhập tên, bấm tạo đường dẫn từ tên nếu CMS chưa tự điền. Phần này giúp website mở đúng trang chi tiết sản phẩm. Không tự ý sửa đường dẫn của sản phẩm đang bán nếu không cần thiết.

### Danh mục

Chọn đúng một danh mục:

- Hoa tươi
- Hoa sáp
- Hoa lụa
- Hoa len & gấu bông
- Hộp hoa
- Hoa cưới

Danh mục quyết định sản phẩm xuất hiện ở bộ lọc nào trên trang **Hoa**. Trên website, “Hộp hoa” hiển thị với tên **Flower Box**.

## 6. Hình ảnh sản phẩm

Chọn **Hình ảnh sản phẩm** để kéo thả hoặc chọn ảnh từ máy.

- Mỗi sản phẩm cần ít nhất 1 ảnh và tối đa **5 ảnh**.
- Ảnh đầu tiên là ảnh đại diện: khách sẽ thấy ảnh này ở danh sách sản phẩm và khi vừa mở trang chi tiết.
- Muốn đổi ảnh đại diện, đặt ảnh đẹp nhất ở vị trí đầu tiên.
- Có thể xóa một ảnh không cần thiết trong CMS rồi Publish lại.

### Quy tắc ảnh đẹp

Nên dùng ảnh gốc, rõ nét, đủ sáng và để bó hoa nằm rõ trong khung. Ưu tiên ảnh dọc; chọn ảnh đẹp nhất làm ảnh đầu tiên.

Không nên dùng ảnh chụp màn hình Facebook, ảnh mờ, collage, ảnh có watermark lớn, ảnh ghi giá cũ hoặc 5 ảnh gần như giống hệt nhau.

## 7. Giá sản phẩm

Ở mục **Loại giá**, chọn một trong ba cách:

- **Giá cố định:** khách thấy một mức giá, ví dụ nhập `450000` sẽ hiển thị `450.000đ`.
- **Giá từ:** khách thấy mức giá bắt đầu, ví dụ nhập `300000` sẽ hiển thị `Từ 300.000đ`.
- **Liên hệ:** website hiển thị `Liên hệ`; không cần nhập giá.

Khi có ô **Giá**, chỉ nhập số. Ví dụ nhập `450000`, không nhập `450.000đ`.

## 8. Mô tả, tông màu và dịp tặng

### Mô tả ngắn

Viết 1 đến 3 câu. Nội dung này xuất hiện nổi bật trên trang sản phẩm.

Ví dụ: `Bó hoa tone hồng nhẹ nhàng, phù hợp sinh nhật, kỷ niệm và những dịp đặc biệt.`

### Mô tả chi tiết

Chị có thể ghi loại hoa, tone màu, ý nghĩa, dịp phù hợp hoặc lưu ý đặt trước. Viết vừa đủ để khách hiểu sản phẩm.

### Tông màu

Điền các tông màu thật của mẫu, ví dụ `Hồng`, `Kem`, `Pastel`. Khách có thể tìm sản phẩm theo từ khóa màu ở trang Hoa.

### Dịp tặng

Chọn các dịp phù hợp: **Sinh nhật, Tốt nghiệp, Kỷ niệm, Tình yêu, Cưới, Chúc mừng, Cảm ơn**.

Các lựa chọn này giúp mẫu có thể xuất hiện ở đúng trang gợi ý theo dịp, ví dụ `/dip-tang/sinh-nhat`.

## 9. Hiển thị và sản phẩm nổi bật

### Đang hiển thị trên website

- Bật: sản phẩm có thể xuất hiện trong catalog, trang chi tiết và các trang dịp tặng khi đã Publish.
- Tắt: sản phẩm vẫn còn trong CMS nhưng khách không thấy trên website.

Nếu chỉ hết hàng hoặc tạm dừng bán, chị nên tắt mục này thay vì xóa sản phẩm.

### Sản phẩm nổi bật

CMS có ô **Sản phẩm nổi bật**, nhưng trang chủ hiện đang dùng danh sách chọn riêng trong mục **Trang chủ**. Vì vậy, bật ô này một mình **chưa chắc** đưa sản phẩm lên khu “Được yêu thích tại Tamas”.

Muốn đổi ba mẫu ở trang chủ, hãy nhờ developer hướng dẫn riêng hoặc mở **Trang chủ → Sản phẩm hiển thị trên trang chủ** và chỉ thay khi đã được bàn giao thao tác này.

## 10. Publish và kiểm tra trên website

Sau khi điền xong, nhấn **Publish**. Thông thường website cập nhật sau vài giây.

1. Mở https://tamas-flower-store-olive.vercel.app/san-pham
2. Tìm sản phẩm theo tên, màu hoặc dịp tặng.
3. Kiểm tra ảnh đại diện, tên, giá và danh mục.
4. Bấm vào sản phẩm để xem trang chi tiết, ảnh, mô tả, tông màu và dịp tặng.

Website tự làm phần tìm kiếm, lọc danh mục và phân trang. Chị không cần quản lý các phần này bằng tay.

## 11. Sửa sản phẩm

1. Vào **Sản phẩm → Tất cả sản phẩm**.
2. Tìm và mở sản phẩm cần chỉnh.
3. Sửa tên, ảnh, giá, mô tả, danh mục, tông màu hoặc dịp tặng.
4. Nhấn **Publish**.
5. Mở lại website để kiểm tra.

## 12. Ẩn và xóa sản phẩm

### Ẩn tạm thời

Mở sản phẩm, tắt **Đang hiển thị trên website**, rồi nhấn **Publish**. Đây là cách nên dùng khi hết hàng hoặc chưa muốn bán mẫu đó.

### Xóa hẳn

Chỉ xóa khi chắc chắn không cần giữ sản phẩm nữa. Mở sản phẩm, dùng menu tùy chọn, chọn **Delete** rồi xác nhận. Xóa có thể không khôi phục được, vì vậy ưu tiên ẩn.

## 13. Tình huống thường gặp

### Đã Publish nhưng chưa thấy sản phẩm

1. Chờ vài giây rồi tải lại website.
2. Kiểm tra đã bật **Đang hiển thị trên website**.
3. Kiểm tra sản phẩm có tên và Đường dẫn.
4. Kiểm tra đã chọn danh mục và có ít nhất một ảnh.
5. Tìm bằng tên sản phẩm trong trang Hoa.

Nếu vẫn chưa thấy, chụp màn hình trang sản phẩm trong CMS và liên hệ developer.

### Giá hiển thị không đúng

Kiểm tra lại Loại giá và ô Giá. Chỉ nhập số, không thêm dấu chấm, chữ `đ` hay từ `Từ`.

### Sản phẩm xuất hiện sai danh mục hoặc sai trang dịp tặng

Sửa **Danh mục** hoặc **Dịp tặng**, sau đó Publish lại.

### Ảnh chưa đẹp

Kiểm tra ảnh đầu tiên có phải ảnh đại diện tốt nhất không. Thay ảnh hoặc sắp xếp lại thứ tự, rồi Publish.

## 14. Những phần chị không cần chỉnh

Chị chỉ cần dùng **Sản phẩm** trong công việc hằng ngày. Không chỉnh Project Settings, API, dataset, CORS, integrations, webhooks, tokens hoặc developer settings.

## 15. Quy trình nhanh — thêm một sản phẩm

1. Mở CMS và chọn **Google**.
2. Vào **Sản phẩm**.
3. Chọn **Create**.
4. Nhập tên và tạo Đường dẫn.
5. Chọn Danh mục.
6. Thêm 1 đến 5 ảnh, đặt ảnh đẹp nhất lên đầu.
7. Chọn Loại giá và nhập giá nếu cần.
8. Viết mô tả ngắn, mô tả chi tiết.
9. Điền Tông màu và chọn Dịp tặng.
10. Bật **Đang hiển thị trên website**.
11. Nhấn **Publish**.
12. Mở website, tìm và kiểm tra sản phẩm.

## Nguồn kiểm chứng nội bộ

Nội dung hướng dẫn được đối chiếu với cấu hình CMS và website hiện tại ngày 25/09/2026. Quyền Project Members và đăng nhập Google được đối chiếu thêm với tài liệu Sanity chính thức: https://www.sanity.io/docs/user-guides/roles
