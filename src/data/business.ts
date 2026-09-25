export const business = {
  name: "Tamas Flower Store",
  address: "79 Xuân Hồng, Phường Bảy Hiền, TP. Hồ Chí Minh",
  email: "steppe.thaonguyen41197@gmail.com",
  facebook: "https://www.facebook.com/profile.php?id=100055054099654",
  instagram: "https://www.instagram.com/tamas.flower/",
  zalo: "https://zalo.me/0708884022",
  hours: "09:00–19:00 mỗi ngày",
  holidayHours: "20/10, 8/3 và Valentine: mở cửa 24/24.",
};

export const zaloHref = (product?: string) =>
  `${business.zalo}?text=${encodeURIComponent(product ? `Xin chào Tamas, mình muốn hỏi về mẫu ${product}.` : "Xin chào Tamas, mình muốn được tư vấn đặt hoa.")}`;
