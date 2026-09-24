export type OccasionGuide = {
  slug: string;
  occasion: string;
  title: string;
  introduction: string;
  recommendations: {category: string; reason: string}[];
};

export const occasionGuides: OccasionGuide[] = [
  {slug: "sinh-nhat", occasion: "Sinh nhật", title: "Hoa sinh nhật: một món quà vừa đủ để người nhận thấy mình được nhớ đến.", introduction: "Hoa tươi cho cảm giác rạng rỡ, hoa sáp giữ được lâu và flower box phù hợp khi muốn món quà có điểm nhấn. Tamas có thể điều chỉnh tone hồng, trắng, vàng hoặc pastel theo người nhận.", recommendations: [{category: "Hoa tươi", reason: "Tươi sáng, tự nhiên và phù hợp với hầu hết độ tuổi."}, {category: "Hoa sáp", reason: "Bền đẹp để lưu giữ, dễ chọn theo tone yêu thích."}, {category: "Flower Box", reason: "Gọn gàng, nổi bật và phù hợp cho một món quà kỷ niệm."}]},
  {slug: "tot-nghiep", occasion: "Tốt nghiệp", title: "Hoa tốt nghiệp để chúc mừng một cột mốc mới.", introduction: "Một bó hoa có sắc sáng, dáng bó thoáng sẽ lên hình đẹp cùng lễ phục và giữ trọn sự vui tươi của ngày tốt nghiệp.", recommendations: [{category: "Hoa tươi", reason: "Sắc hoa theo mùa tạo cảm giác rực rỡ và giàu sức sống."}, {category: "Hoa sáp", reason: "Bền lâu, thuận tiện để mang theo sau buổi lễ."}, {category: "Hoa len & gấu bông", reason: "Đáng yêu, dễ tạo bất ngờ và có thể giữ làm kỷ niệm."}]},
  {slug: "ky-niem", occasion: "Kỷ niệm", title: "Hoa kỷ niệm cho những điều đã cùng nhau đi qua.", introduction: "Tone hồng, kem, đỏ hoặc màu gắn với một kỷ niệm riêng sẽ khiến món quà có cảm giác được chuẩn bị riêng cho hai người.", recommendations: [{category: "Hoa tươi", reason: "Mềm mại và giàu cảm xúc cho một buổi hẹn hoặc lời cảm ơn."}, {category: "Hoa sáp", reason: "Lưu giữ lâu hơn như một dấu mốc nhỏ."}, {category: "Flower Box", reason: "Tạo cảm giác đầy đặn, phù hợp để tặng trong dịp đặc biệt."}]},
  {slug: "tinh-yeu", occasion: "Tình yêu", title: "Hoa tình yêu không cần quá nhiều lời để vẫn thật rõ ràng.", introduction: "Hoa hồng, tulip, mao lương và các tone hồng hoặc đỏ có thể được phối nhẹ nhàng, không nhất thiết phải quá rực rỡ.", recommendations: [{category: "Hoa tươi", reason: "Tạo khoảnh khắc tặng hoa tự nhiên và lãng mạn."}, {category: "Hoa sáp", reason: "Bền màu, phù hợp khi muốn giữ món quà lâu hơn."}, {category: "Flower Box", reason: "Một lựa chọn nổi bật cho ngày kỷ niệm hoặc lời tỏ tình."}]},
  {slug: "cuoi", occasion: "Cưới", title: "Hoa cưới để hoàn thiện tổng thể nhẹ nhàng của ngày trọng đại.", introduction: "Tamas có thể gợi ý tone hoa hợp váy, ảnh cưới và không gian buổi lễ; dáng bó được cân chỉnh để cầm lâu vẫn thoải mái.", recommendations: [{category: "Hoa cưới", reason: "Được ưu tiên về dáng bó, tone màu và tỷ lệ khi lên hình."}, {category: "Hoa tươi", reason: "Phù hợp cho hoa cầm tay, hoa bàn hoặc lời chúc mừng cô dâu chú rể."}, {category: "Flower Box", reason: "Gọn đẹp khi gửi lời chúc mừng tới buổi tiệc."}]},
  {slug: "chuc-mung", occasion: "Chúc mừng", title: "Hoa chúc mừng cho một khởi đầu, thành tựu hay tin vui.", introduction: "Từ một bó nhỏ tươi sáng đến flower box đầy đặn, Tamas sẽ điều chỉnh theo mức độ trang trọng và ngân sách của bạn.", recommendations: [{category: "Hoa tươi", reason: "Linh hoạt cho khai trương, thăm hỏi và nhiều tin vui khác."}, {category: "Flower Box", reason: "Có điểm nhấn, phù hợp để đặt tại bàn hoặc gửi tận nơi."}, {category: "Hoa sáp", reason: "Một lời chúc có thể lưu lại lâu hơn."}]},
];

export const getOccasionGuide = (slug: string) => occasionGuides.find(guide => guide.slug === slug);
