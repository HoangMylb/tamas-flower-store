import type {Product} from "@/data/products";
import {products as staticProducts} from "@/data/products";
import {categories as staticCategories} from "@/data/categories";
import {sanityClient} from "./client";
import {imageUrl} from "./image";

type SanityProduct = Omit<Product, "cover" | "gallery" | "imageAlts" | "name" | "priceLabel" | "salePriceLabel" | "available"> & {title: string; priceType: "fixed" | "from" | "contact"; price?: number; onSale?: boolean; salePrice?: number; images?: unknown[]; active?: boolean};
type SanityHomeProduct = {product?: SanityProduct; titleOverride?: string; imageOverride?: unknown};
type SanityHomeCategory = {category?: string; title?: string; image?: unknown};
type SanityHomeImage = {image?: unknown; alt?: string};
type HomePageContent = {categoryTiles: {slug: string; name: string; image: string; alt: string}[]; featuredProducts: Product[]; instagramImages: {src: string; alt: string}[]};
const projection = `{"slug": slug.current, title, category, priceType, price, onSale, salePrice, shortDescription, description, images[]{asset, alt}, colors, occasions, featured, active, availabilityNote, seoTitle, seoDescription}`;
const activeFilter = `_type == "product" && active == true && defined(slug.current)`;
const productCache = {next: {revalidate: 3600, tags: ["sanity-products"]}};

function formatPrice(priceType: SanityProduct["priceType"], price?: number) {
  if (priceType === "contact") return "Liên hệ";
  const label = price?.toLocaleString("vi-VN") ?? "";
  return priceType === "from" ? `Từ ${label}đ` : `${label}đ`;
}

function priceLabel(product: SanityProduct) {
  return formatPrice(product.priceType, product.price);
}

function toProduct(product: SanityProduct): Product | null {
  const galleryItems = (product.images ?? []).flatMap(image => {
    const src = imageUrl(image as never);
    return src ? [{src, alt: typeof (image as {alt?: unknown}).alt === "string" ? (image as {alt: string}).alt.trim() : ""}] : [];
  });
  if (!product.slug || !galleryItems[0]) return null;
  const gallery = galleryItems.map(item => item.src);
  const hasSalePrice = Boolean(product.onSale) && product.priceType !== "contact" && typeof product.price === "number" && typeof product.salePrice === "number" && product.salePrice > 0 && product.salePrice < product.price;
  return {slug: product.slug, name: product.title, category: product.category, priceLabel: priceLabel(product), salePriceLabel: hasSalePrice ? formatPrice(product.priceType, product.salePrice) : undefined, shortDescription: product.shortDescription ?? "", description: product.description ?? "", cover: gallery[0], gallery, imageAlts: galleryItems.map((item, index) => item.alt || (index === 0 ? product.title : `${product.title} — góc chụp ${index + 1}`)), colors: product.colors ?? [], occasions: product.occasions ?? [], featured: Boolean(product.featured), available: product.active !== false, availabilityNote: product.availabilityNote?.trim() || undefined, seoTitle: product.seoTitle?.trim() || undefined, seoDescription: product.seoDescription?.trim() || undefined};
}

async function query(query: string, params = {}) {
  if (!sanityClient) return null;
  try {
    const result = await sanityClient.fetch<SanityProduct[]>(query, params, productCache);
    return result.map(toProduct).filter((product): product is Product => product !== null);
  } catch {
    return null;
  }
}

export async function getAllProducts() { return await query(`*[${activeFilter}] | order(_updatedAt desc) ${projection}`) ?? staticProducts.filter(product => product.available); }
export async function getActiveProducts() { return getAllProducts(); }
export async function getFeaturedProducts() { return await query(`*[${activeFilter} && featured == true] | order(_updatedAt desc) ${projection}`) ?? staticProducts.filter(product => product.available && product.featured); }

function fallbackHomeContent(): HomePageContent {
  return {
    categoryTiles: staticCategories.map(category => ({slug: category.slug, name: category.name, image: category.image, alt: category.name})),
    featuredProducts: staticProducts.filter(product => product.available && product.featured),
    instagramImages: staticProducts.slice(1, 7).map(product => ({src: product.cover, alt: product.name})),
  };
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const fallback = fallbackHomeContent();
  if (!sanityClient) return fallback;
  try {
    const homePage = await sanityClient.fetch<{categoryTiles?: SanityHomeCategory[]; featuredProducts?: SanityHomeProduct[]; instagramImages?: SanityHomeImage[]} | null>(
      `*[_id == "homePage"][0]{categoryTiles[]{category, title, image{asset, alt}}, featuredProducts[]{product->${projection}, titleOverride, imageOverride{asset, alt}}, instagramImages[]{image{asset, alt}, alt}}`,
      {},
      {next: {revalidate: 3600, tags: ["sanity-home", "sanity-products"]}},
    );
    if (!homePage) return fallback;
    const categoryTiles = Array.isArray(homePage.categoryTiles) && homePage.categoryTiles.length
      ? homePage.categoryTiles.flatMap(item => {
          const image: string | undefined = item.image ? imageUrl(item.image as never) : undefined;
          if (!item.category || !item.title || !image) return [];
          return [{slug: item.category, name: item.title, image, alt: typeof (item.image as {alt?: unknown}).alt === "string" && (item.image as {alt: string}).alt.trim() ? (item.image as {alt: string}).alt.trim() : item.title}];
        })
      : fallback.categoryTiles;
    const featuredProducts = Array.isArray(homePage.featuredProducts)
      ? homePage.featuredProducts.flatMap(item => {
        const product = item.product && toProduct(item.product);
        if (!product) return [];
        const homeImage: string | undefined = item.imageOverride ? imageUrl(item.imageOverride as never) : undefined;
        const homeAlt = typeof (item.imageOverride as {alt?: unknown})?.alt === "string" ? (item.imageOverride as {alt: string}).alt.trim() : "";
        return [{...product, name: item.titleOverride?.trim() || product.name, ...(homeImage ? {cover: homeImage, imageAlts: [homeAlt || product.imageAlts[0], ...product.imageAlts.slice(1)]} : {})}];
      })
      : fallback.featuredProducts;
    const instagramImages = Array.isArray(homePage.instagramImages) && homePage.instagramImages.length
      ? homePage.instagramImages.flatMap(item => {
          const src: string | undefined = item.image ? imageUrl(item.image as never) : undefined;
          const imageAlt = typeof (item.image as {alt?: unknown})?.alt === "string" ? (item.image as {alt: string}).alt.trim() : "";
          return src ? [{src, alt: imageAlt || item.alt?.trim() || "Hình ảnh hoa tại Tamas"}] : [];
        })
      : fallback.instagramImages;
    return {categoryTiles, featuredProducts, instagramImages};
  } catch {
    return fallback;
  }
}
export async function getHomeFeaturedProducts() { return (await getHomePageContent()).featuredProducts; }
export async function getProductsByCategory(category: string) { return await query(`*[${activeFilter} && category == $category] | order(_updatedAt desc) ${projection}`, {category}) ?? staticProducts.filter(product => product.available && product.category === category); }
export async function getProductBySlug(slug: string) { const result = await query(`*[${activeFilter} && slug.current == $slug][0...1] ${projection}`, {slug}); return result ? result[0] : staticProducts.find(product => product.available && product.slug === slug); }
