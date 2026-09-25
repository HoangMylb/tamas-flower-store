import {viVNLocale} from "@sanity/locale-vi-vn";
import {buildLegacyTheme, defineConfig, defineLocaleResourceBundle} from "sanity";
import {structureTool} from "sanity/structure";
import {sanityEnv} from "./env";
import {schemaTypes} from "./schemaTypes";
import {CmsWorkspace} from "./CmsWorkspace";

const productCategories = [
  {title: "Hoa tươi", value: "hoa-tuoi"},
  {title: "Hoa sáp", value: "hoa-sap"},
  {title: "Hoa lụa", value: "hoa-lua"},
  {title: "Hoa len & gấu bông", value: "hoa-len"},
  {title: "Hộp hoa", value: "flower-box"},
  {title: "Hoa cưới", value: "hoa-cuoi"},
];

const tamasStudioTheme = buildLegacyTheme({
  "--black": "#392f2b",
  "--white": "#fffdfc",
  "--brand-primary": "#8c3f50",
  "--component-bg": "#fffdfc",
  "--component-text-color": "#392f2b",
  "--default-button-color": "#392f2b",
  "--default-button-primary-color": "#8c3f50",
  "--focus-color": "#8c3f50",
  "--gray-base": "#5d514c",
  "--gray": "#8a7c75",
  "--main-navigation-color": "#fffaf6",
  "--main-navigation-color--inverted": "#392f2b",
  "--state-info-color": "#8c3f50",
  "--state-success-color": "#77806b",
  "--state-warning-color": "#b67a5e",
  "--state-danger-color": "#a65f6b",
});

const vietnameseStructureLabels = defineLocaleResourceBundle({
  locale: "vi-VN",
  namespace: "structure",
  resources: {
    "incoming-references-input.add-reference-item": "Thêm mục",
    "panes.document-list-pane.search-input.aria-label": "Tìm sản phẩm",
    "panes.document-list-pane.search-input.placeholder": "Tìm sản phẩm",
    "panes.document-list-pane.search-ordering.aria-label": "Đổi thứ tự sắp xếp",
  },
});

const vietnameseStudioLabels = defineLocaleResourceBundle({
  locale: "vi-VN",
  namespace: "studio",
  resources: {
    "inputs.array.action.add-after": "Thêm mục phía sau",
    "inputs.array.action.add-before": "Thêm mục phía trước",
    "inputs.array.action.add-item": "Thêm mục",
    "inputs.array.action.add-item-select-type": "Thêm mục...",
  },
});

export const sanityConfig = defineConfig({
  basePath: "/admin",
  projectId: sanityEnv.projectId ?? "missing-project-id",
  dataset: sanityEnv.dataset ?? "missing-dataset",
  theme: tamasStudioTheme,
  i18n: {
    // Chỉ hiển thị Tiếng Việt để người biên tập không vô tình chuyển CMS về tiếng Anh.
    locales: locales => locales.filter(locale => locale.id === "vi-VN"),
    bundles: [vietnameseStructureLabels, vietnameseStudioLabels],
  },
  schema: {types: schemaTypes},
  plugins: [viVNLocale(), structureTool({
    structure: S => S.list()
      .title("Nội dung Tamas")
      .items([
        S.listItem().title("Trang chủ").id("homePage").child(S.document().schemaType("homePage").documentId("homePage")),
        S.divider(),
        S.listItem().title("Sản phẩm").id("products").child(
          S.list().title("Sản phẩm theo danh mục").items([
            S.listItem().title("Tất cả sản phẩm").id("all-products").child(S.documentTypeList("product").title("Tất cả sản phẩm")),
            S.divider(),
            ...productCategories.map(category => S.listItem().title(category.title).id(`products-${category.value}`).child(
              S.documentList()
                .title(category.title)
                .schemaType("product")
                .filter('_type == "product" && category == $category')
                .params({category: category.value}),
            )),
          ]),
        ),
        S.divider(),
        S.listItem().title("SEO trang danh mục").id("category-pages").child(S.documentTypeList("categoryPage").title("SEO trang danh mục")),
        S.listItem().title("SEO trang dịp tặng").id("occasion-pages").child(S.documentTypeList("occasionPage").title("SEO trang dịp tặng")),
      ]),
  })],
  tools: previousTools => [...previousTools.filter(tool => tool.name !== "structure"), {name: "cms", title: "CMS", component: CmsWorkspace}],
});
