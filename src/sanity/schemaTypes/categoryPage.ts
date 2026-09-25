import {defineField, defineType} from "sanity";

const categories = [
  {title: "Hoa tươi", value: "hoa-tuoi"},
  {title: "Hoa sáp", value: "hoa-sap"},
  {title: "Hoa lụa", value: "hoa-lua"},
  {title: "Hoa len & gấu bông", value: "hoa-len"},
  {title: "Hộp hoa", value: "flower-box"},
  {title: "Hoa cưới", value: "hoa-cuoi"},
];

export const categoryPageType = defineType({
  name: "categoryPage",
  title: "SEO trang danh mục",
  type: "document",
  groups: [
    {name: "content", title: "Nội dung trang", default: true},
    {name: "seo", title: "SEO — cần kiến thức SEO"},
  ],
  fields: [
    defineField({name: "category", title: "Danh mục", description: "Mỗi danh mục chỉ tạo một trang SEO.", type: "string", options: {list: categories, layout: "dropdown"}, validation: rule => rule.required(), group: "content"}),
    defineField({name: "pageTitle", title: "Tiêu đề hiển thị (H1)", description: "Tiêu đề lớn khách đọc trên trang danh mục. Viết tự nhiên và đúng nhóm sản phẩm.", type: "string", validation: rule => rule.required().max(110), group: "content"}),
    defineField({name: "introduction", title: "Giới thiệu danh mục", description: "Đoạn mở đầu ngắn, hữu ích cho khách đang chọn hoa. Có thể nêu dịp tặng, đặc điểm hoặc cách Tamas tư vấn.", type: "text", rows: 4, validation: rule => rule.required().max(600), group: "content"}),
    defineField({name: "seoTitle", title: "Tiêu đề SEO — cần kiến thức SEO", description: "Tiêu đề hiển thị trên Google. Viết riêng, rõ ràng và đúng trang danh mục; có thể nêu khu vực khi phù hợp.", type: "string", validation: rule => rule.max(60).warning("Nên giữ trong khoảng 45–60 ký tự để dễ hiển thị."), group: "seo"}),
    defineField({name: "seoDescription", title: "Mô tả SEO — cần kiến thức SEO", description: "Đoạn giới thiệu có thể xuất hiện trên Google. Viết độc nhất cho danh mục; không lặp từ khoá.", type: "text", rows: 3, validation: rule => rule.max(160).warning("Nên giữ khoảng 120–160 ký tự."), group: "seo"}),
  ],
  preview: {select: {title: "category", subtitle: "pageTitle"}, prepare: ({title, subtitle}) => ({title: categories.find(item => item.value === title)?.title ?? "Chưa chọn danh mục", subtitle: subtitle || "Chưa có nội dung"})},
});
