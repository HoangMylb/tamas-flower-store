# Quy tắc danh sách sản phẩm

1. Lưới sản phẩm dùng dòng chảy tự nhiên; mọi `.product-grid` bắt buộc đặt `grid-column` và `grid-row` là `auto`, nên không được có ô trống do thứ tự dữ liệu.
2. Mọi bộ lọc trên catalog phải cập nhật danh sách tại chỗ, giữ nguyên vị trí cuộn và đồng bộ URL bằng History API.
3. Thanh tìm kiếm và ít nhất ba lựa chọn danh mục chính phải cùng một hàng trên màn hình lớn; danh mục còn lại nằm trong menu chọn.
4. Danh sách phải có trạng thái không có kết quả, phân trang tối đa tám sản phẩm và thông báo số lượng kết quả cho trình đọc màn hình.
5. Thông tin liên hệ chính thức chỉ được duy trì ở footer và trang Liên hệ, dùng dữ liệu từ `src/data/business.ts` để tránh lặp hoặc sai lệch.
6. Mỗi lần thay đổi lưới sản phẩm phải chạy `npm run check:listing-grid`; lệnh này sẽ chặn build checklist nếu lớp bảo vệ tự động bị xóa.
