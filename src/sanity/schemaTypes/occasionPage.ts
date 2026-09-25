import {defineField, defineType} from "sanity";

const occasions = ["Sinh nhật", "Tốt nghiệp", "Kỷ niệm", "Tình yêu", "Cưới", "Chúc mừng"];

export const occasionPageType = defineType({
  name: "occasionPage",
  title: "SEO trang dịp tặng",
  type: "document",
  groups: [
    {name: "content", title: "Nội dung trang", default: true},
    {name: "seo", title: "SEO — cần kiến thức SEO"},
  ],
  fields: [
    defineField({name: "occasion", title: "Dịp tặng", description: "Mỗi dịp tặng chỉ tạo một trang SEO.", type: "string", options: {list: occasions, layout: "dropdown"}, validation: rule => rule.required(), group: "content"}),
    defineField({name: "pageTitle", title: "Tiêu đề hiển thị (H1)", description: "Tiêu đề lớn khách đọc trên trang dịp tặng. Viết tự nhiên và đúng nhu cầu tìm kiếm.", type: "string", validation: rule => rule.required().max(110), group: "content"}),
    defineField({name: "introduction", title: "Giới thiệu dịp tặng", description: "Đoạn mở đầu ngắn, hữu ích cho khách đang chọn hoa. Có thể nêu kiểu hoa, tone màu hoặc cách chọn phù hợp.", type: "text", rows: 4, validation: rule => rule.required().max(600), group: "content"}),
    defineField({name: "seoTitle", title: "Tiêu đề SEO — cần kiến thức SEO", description: "Tiêu đề hiển thị trên Google. Viết riêng, rõ ràng và đúng trang dịp tặng; có thể nêu khu vực khi phù hợp.", type: "string", validation: rule => rule.max(60).warning("Nên giữ trong khoảng 45–60 ký tự để dễ hiển thị."), group: "seo"}),
    defineField({name: "seoDescription", title: "Mô tả SEO — cần kiến thức SEO", description: "Đoạn giới thiệu có thể xuất hiện trên Google. Viết độc nhất cho dịp tặng; không lặp từ khoá.", type: "text", rows: 3, validation: rule => rule.max(160).warning("Nên giữ khoảng 120–160 ký tự."), group: "seo"}),
  ],
  preview: {select: {title: "occasion", subtitle: "pageTitle"}, prepare: ({title, subtitle}) => ({title: title || "Chưa chọn dịp tặng", subtitle: subtitle || "Chưa có nội dung"})},
});
