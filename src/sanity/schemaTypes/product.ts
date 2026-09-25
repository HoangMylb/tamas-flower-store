import {defineField, defineType} from "sanity";

const categories = [
  {title: "Hoa tươi", value: "hoa-tuoi"},
  {title: "Hoa sáp", value: "hoa-sap"},
  {title: "Hoa lụa", value: "hoa-lua"},
  {title: "Hoa len & gấu bông", value: "hoa-len"},
  {title: "Hộp hoa", value: "flower-box"},
  {title: "Hoa cưới", value: "hoa-cuoi"},
];

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  groups: [
    {name: "content", title: "Nội dung sản phẩm", default: true},
    {name: "seo", title: "SEO — cần kiến thức SEO"},
  ],
  fields: [
    defineField({name: "title", title: "Tên sản phẩm", type: "string", validation: rule => rule.required(), group: "content"}),
    defineField({name: "slug", title: "Đường dẫn", type: "slug", options: {source: "title", maxLength: 96}, validation: rule => rule.required(), group: "content"}),
    defineField({name: "category", title: "Danh mục", type: "string", options: {list: categories, layout: "dropdown"}, validation: rule => rule.required(), group: "content"}),
    defineField({name: "images", title: "Hình ảnh sản phẩm", description: "Tối đa 5 ảnh. Ảnh đầu tiên là ảnh đại diện. Mở từng ảnh để nhập mô tả ảnh (alt text).", type: "array", of: [{type: "image", options: {hotspot: true}, fields: [defineField({name: "alt", title: "Mô tả ảnh (alt text) — cần kiến thức SEO", description: "Mô tả đúng ảnh bằng một câu tự nhiên; có thể nêu loại hoa, màu sắc hoặc dịp tặng nếu thực sự có trong ảnh. Không lặp từ khoá.", type: "string", validation: rule => rule.max(150).warning("Nên giữ ngắn gọn, tối đa 150 ký tự.")})]}], validation: rule => rule.required().min(1).max(5), group: "content"}),
    defineField({name: "priceType", title: "Loại giá", type: "string", options: {list: [{title: "Giá cố định", value: "fixed"}, {title: "Giá từ", value: "from"}, {title: "Liên hệ", value: "contact"}], layout: "radio"}, initialValue: "contact", validation: rule => rule.required(), group: "content"}),
    defineField({name: "price", title: "Giá", description: "Nhập số, không dùng dấu chấm. Ví dụ: 450000", type: "number", hidden: ({parent}) => (parent as {priceType?: string})?.priceType === "contact", validation: rule => rule.min(0).custom((value, context) => (context.parent as {priceType?: string})?.priceType === "contact" || typeof value === "number" ? true : "Cần nhập giá cho Giá cố định hoặc Giá từ"), group: "content"}),
    defineField({name: "onSale", title: "Giảm giá", type: "boolean", initialValue: false, hidden: ({parent}) => (parent as {priceType?: string})?.priceType === "contact", group: "content"}),
    defineField({name: "salePrice", title: "Giá đã giảm", description: "Nhập số, không dùng dấu chấm. Giá này phải thấp hơn giá gốc.", type: "number", hidden: ({parent}) => !(parent as {onSale?: boolean})?.onSale || (parent as {priceType?: string})?.priceType === "contact", validation: rule => rule.min(0).custom((value, context) => { const parent = context.parent as {onSale?: boolean; price?: number}; return !parent?.onSale || (typeof value === "number" && typeof parent.price === "number" && value < parent.price) ? true : "Cần nhập giá đã giảm thấp hơn giá gốc"; }), group: "content"}),
    defineField({name: "shortDescription", title: "Mô tả ngắn", description: "Khoảng 1-3 câu. Nếu chưa thiết lập SEO riêng, nội dung này sẽ được dùng cho Google.", type: "text", rows: 3, validation: rule => rule.max(360), group: "content"}),
    defineField({name: "description", title: "Mô tả chi tiết", type: "text", rows: 6, group: "content"}),
    defineField({name: "featured", title: "Sản phẩm nổi bật", type: "boolean", initialValue: false, group: "content"}),
    defineField({name: "active", title: "Đang hiển thị trên website", type: "boolean", initialValue: true, group: "content"}),
    defineField({name: "availabilityNote", title: "Tình trạng hiển thị ở trang sản phẩm", description: "Ví dụ: Nhận đặt theo tình trạng hoa. Để trống sẽ dùng câu mặc định.", type: "string", initialValue: "Nhận đặt theo tình trạng hoa", validation: rule => rule.max(120), group: "content"}),
    defineField({name: "occasions", title: "Dịp tặng", type: "array", of: [{type: "string"}], options: {list: ["Sinh nhật", "Tốt nghiệp", "Kỷ niệm", "Tình yêu", "Cưới", "Chúc mừng", "Cảm ơn"]}, group: "content"}),
    defineField({name: "colors", title: "Tông màu", type: "array", of: [{type: "string"}], options: {layout: "tags"}, group: "content"}),
    defineField({name: "seoTitle", title: "Tiêu đề SEO — cần kiến thức SEO", description: "Tiêu đề hiển thị trên Google. Viết riêng, rõ ràng, đúng nội dung sản phẩm; có thể nêu loại hoa/dịp tặng/khu vực khi phù hợp. Để trống để dùng Tên sản phẩm.", type: "string", validation: rule => rule.max(60).warning("Nên giữ trong khoảng 45–60 ký tự để dễ hiển thị."), group: "seo"}),
    defineField({name: "seoDescription", title: "Mô tả SEO — cần kiến thức SEO", description: "Đoạn giới thiệu có thể xuất hiện bên dưới tiêu đề trên Google. Viết độc nhất cho mẫu này, có thông tin hữu ích và lời mời phù hợp. Để trống để dùng Mô tả ngắn.", type: "text", rows: 3, validation: rule => rule.max(160).warning("Nên giữ khoảng 120–160 ký tự."), group: "seo"}),
  ],
  preview: {select: {title: "title", category: "category", media: "images.0"}, prepare: ({title, category, media}) => ({title: `${title} - ${categories.find(item => item.value === category)?.title ?? category}`, media})},
  orderings: [
    {title: "Mới cập nhật", name: "updatedAtDesc", by: [{field: "_updatedAt", direction: "desc"}]},
    {title: "Tên sản phẩm", name: "titleAsc", by: [{field: "title", direction: "asc"}]},
    {title: "Danh mục", name: "categoryAsc", by: [{field: "category", direction: "asc"}]},
  ],
});
