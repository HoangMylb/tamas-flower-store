import {defineField, defineType} from "sanity";

const categoryOptions = [
  {title: "Hoa tươi", value: "hoa-tuoi"},
  {title: "Hoa sáp", value: "hoa-sap"},
  {title: "Hoa lụa", value: "hoa-lua"},
  {title: "Hoa len & gấu bông", value: "hoa-len"},
  {title: "Flower Box", value: "flower-box"},
  {title: "Hoa cưới", value: "hoa-cuoi"},
];

export const homePageType = defineType({
  name: "homePage",
  title: "Trang chủ",
  type: "document",
  fields: [
    defineField({
      name: "categoryTiles",
      title: "Ảnh danh mục — Chọn hoa theo cách của bạn",
      description: "6 ô ảnh lớn ở section đầu tiên của trang chủ.",
      type: "array",
      of: [{
        type: "object",
        name: "homeCategoryTile",
        title: "Danh mục trang chủ",
        fields: [
          defineField({name: "category", title: "Danh mục", type: "string", options: {list: categoryOptions, layout: "dropdown"}, validation: rule => rule.required()}),
          defineField({name: "title", title: "Tên hiển thị", type: "string", validation: rule => rule.required()}),
          defineField({name: "image", title: "Ảnh", type: "image", options: {hotspot: true}, validation: rule => rule.required()}),
        ],
        preview: {select: {title: "title", subtitle: "category", media: "image"}},
      }],
      validation: rule => rule.max(6),
    }),
    defineField({
      name: "featuredProducts",
      title: "Sản phẩm hiển thị trên trang chủ",
      description: "Chọn tối đa 3 sản phẩm. Bạn có thể đặt tên hoặc ảnh riêng cho trang chủ mà không làm thay đổi trang chi tiết sản phẩm.",
      type: "array",
      of: [{
        type: "object",
        name: "homeProduct",
        title: "Sản phẩm trang chủ",
        fields: [
          defineField({
            name: "product",
            title: "Sản phẩm gốc",
            type: "reference",
            to: [{type: "product"}],
            options: {filter: "active == true", disableNew: true},
            validation: rule => rule.required(),
          }),
          defineField({
            name: "titleOverride",
            title: "Tên chỉ dùng ở trang chủ",
            description: "Để trống để dùng tên của sản phẩm gốc.",
            type: "string",
          }),
          defineField({
            name: "imageOverride",
            title: "Ảnh chỉ dùng ở trang chủ",
            description: "Để trống để dùng ảnh đầu tiên của sản phẩm gốc.",
            type: "image",
            options: {hotspot: true},
          }),
        ],
        preview: {
          select: {title: "titleOverride", fallbackTitle: "product.title", media: "imageOverride", fallbackMedia: "product.images.0"},
          prepare: ({title, fallbackTitle, media, fallbackMedia}) => ({title: title || fallbackTitle || "Chưa chọn sản phẩm", media: media || fallbackMedia}),
        },
      }],
      validation: rule => rule.max(3),
    }),
    defineField({
      name: "instagramImages",
      title: "Ảnh — Một chút Tamas mỗi ngày",
      description: "6 ảnh ở section Instagram gần cuối trang chủ.",
      type: "array",
      of: [{
        type: "object",
        name: "homeInstagramImage",
        title: "Ảnh Instagram",
        fields: [
          defineField({name: "image", title: "Ảnh", type: "image", options: {hotspot: true}, validation: rule => rule.required()}),
          defineField({name: "alt", title: "Mô tả ảnh", type: "string", description: "Dùng cho người đọc màn hình.", validation: rule => rule.required()}),
        ],
        preview: {select: {title: "alt", media: "image"}},
      }],
      validation: rule => rule.max(6),
    }),
  ],
  preview: {prepare: () => ({title: "Nội dung trang chủ"})},
});
