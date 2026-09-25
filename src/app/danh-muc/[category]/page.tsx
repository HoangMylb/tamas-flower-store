import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {CatalogBrowser} from "@/components/CatalogBrowser";
import {PageShell} from "@/components/PageShell";
import {categories} from "@/data/categories";
import {getActiveProducts} from "@/sanity/products";
import {getCategorySeoPage} from "@/sanity/seo-pages";

type Props = {params: Promise<{category: string}>};
export const revalidate = 3600;

export function generateStaticParams() { return categories.map(({slug}) => ({category: slug})); }

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {category} = await params;
  const page = await getCategorySeoPage(category);
  if (!page) return {};
  return {title: page.seoTitle || page.pageTitle, description: page.seoDescription || page.introduction, alternates: {canonical: `/danh-muc/${category}`}};
}

export default async function CategoryPage({params}: Props) {
  const {category} = await params;
  const page = await getCategorySeoPage(category);
  if (!page) notFound();
  const products = (await getActiveProducts()).filter(product => product.category === category);
  return <PageShell><section className="listing-head"><p className="location">Danh mục hoa</p><h1>{page.pageTitle}</h1><p>{page.introduction}</p></section><CatalogBrowser products={products} initialQuery={{category}}/></PageShell>;
}
