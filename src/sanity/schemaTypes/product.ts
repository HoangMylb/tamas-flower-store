import {defineField, defineType} from "sanity";

const categories = [
  {title: "Hoa tươi", value: "hoa-tuoi"},
  {title: "Hoa sáp", value: "hoa-sap"},
  {title: "Hoa lụa", value: "hoa-lua"},
  {title: "Hoa len & gấu bông", value: "hoa-len"},
  {title: "Flower Box", value: "flower-box"},
  {title: "Hoa cưới", value: "hoa-cuoi"},
];

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    defineField({name: "title", title: "Tên sản phẩm", type: "string", validation: rule => rule.required()}),
    defineField({name: "slug", title: "Đường dẫn", type: "slug", options: {source: "title", maxLength: 96}, validation: rule => rule.required()}),
    defineField({name: "category", title: "Danh mục", type: "string", options: {list: categories, layout: "dropdown"}, validation: rule => rule.required()}),
    defineField({name: "images", title: "Hình ảnh sản phẩm", description: "Tối đa 5 ảnh. Ảnh đầu tiên là ảnh đại diện.", type: "array", of: [{type: "image", options: {hotspot: true}}], validation: rule => rule.required().min(1).max(5)}),
    defineField({name: "priceType", title: "Loại giá", type: "string", options: {list: [{title: "Giá cố định", value: "fixed"}, {title: "Giá từ", value: "from"}, {title: "Liên hệ", value: "contact"}], layout: "radio"}, initialValue: "contact", validation: rule => rule.required()}),
    defineField({name: "price", title: "Giá", description: "Nhập số, không dùng dấu chấm. Ví dụ: 450000", type: "number", hidden: ({parent}) => (parent as {priceType?: string})?.priceType === "contact", validation: rule => rule.min(0).custom((value, context) => (context.parent as {priceType?: string})?.priceType === "contact" || typeof value === "number" ? true : "Cần nhập giá cho Giá cố định hoặc Giá từ")}),
    defineField({name: "shortDescription", title: "Mô tả ngắn", description: "Khoảng 1-3 câu.", type: "text", rows: 3, validation: rule => rule.max(360)}),
    defineField({name: "description", title: "Mô tả chi tiết", type: "text", rows: 6}),
    defineField({name: "featured", title: "Sản phẩm nổi bật", type: "boolean", initialValue: false}),
    defineField({name: "active", title: "Đang hiển thị trên website", type: "boolean", initialValue: true}),
    defineField({name: "occasions", title: "Dịp tặng", type: "array", of: [{type: "string"}], options: {list: ["Sinh nhật", "Tốt nghiệp", "Kỷ niệm", "Tình yêu", "Cưới", "Chúc mừng", "Cảm ơn"]}}),
    defineField({name: "colors", title: "Tone màu", type: "array", of: [{type: "string"}], options: {layout: "tags"}}),
  ],
  preview: {select: {title: "title", subtitle: "category", media: "images.0"}, prepare: ({title, subtitle, media}) => ({title, subtitle: categories.find(category => category.value === subtitle)?.title ?? subtitle, media})},
  orderings: [
    {title: "Mới cập nhật", name: "updatedAtDesc", by: [{field: "_updatedAt", direction: "desc"}]},
    {title: "Tên sản phẩm", name: "titleAsc", by: [{field: "title", direction: "asc"}]},
    {title: "Danh mục", name: "categoryAsc", by: [{field: "category", direction: "asc"}]},
  ],
});
