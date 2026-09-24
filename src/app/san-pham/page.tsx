import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {CatalogBrowser} from "@/components/CatalogBrowser";
import {PageShell} from "@/components/PageShell";
import {occasionGuides} from "@/data/occasion-guides";
import {getActiveProducts} from "@/sanity/products";

export const metadata: Metadata = {title: "Hoa", description: "Khám phá các mẫu hoa tươi, hoa sáp, hoa len, flower box và hoa cưới của Tamas.", alternates: {canonical: "/san-pham"}};
export const revalidate = 3600;
type Query = {category?: string; occasion?: string; q?: string; page?: string};

export default async function ProductListing({searchParams}: {searchParams: Promise<Query>}) {
  const query = await searchParams;
  if (query.occasion) {
    const guide = occasionGuides.find((item) => item.occasion === query.occasion);
    if (guide) redirect(`/dip-tang/${guide.slug}`);
  }
  const products = await getActiveProducts();
  return <PageShell><section className="listing-head"><p className="location">Danh mục hoa</p><h1><span className="catalog-heading-line">Chọn một mẫu, rồi để</span><br/><span className="catalog-heading-line">Tamas chuẩn bị phần còn lại.</span></h1><p>Mỗi mẫu có thể được điều chỉnh theo sắc hoa, dịp tặng và ngân sách của bạn.</p></section><CatalogBrowser products={products} initialQuery={query}/></PageShell>;
}
