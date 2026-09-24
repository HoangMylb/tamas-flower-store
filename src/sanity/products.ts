import type {Product} from "@/data/products";
import {products as staticProducts} from "@/data/products";
import {categories as staticCategories} from "@/data/categories";
import {sanityClient} from "./client";
import {imageUrl} from "./image";

type SanityProduct = Omit<Product, "cover" | "gallery" | "name" | "priceLabel" | "available"> & {title: string; priceType: "fixed" | "from" | "contact"; price?: number; images?: unknown[]; active?: boolean};
type SanityHomeProduct = {product?: SanityProduct; titleOverride?: string; imageOverride?: unknown};
type SanityHomeCategory = {category?: string; title?: string; image?: unknown};
type SanityHomeImage = {image?: unknown; alt?: string};
type HomePageContent = {categoryTiles: {slug: string; name: string; image: string}[]; featuredProducts: Product[]; instagramImages: {src: string; alt: string}[]};
const projection = `{"slug": slug.current, title, category, priceType, price, shortDescription, description, images, colors, occasions, featured, active}`;
const activeFilter = `_type == "product" && active == true && defined(slug.current)`;
const productCache = {next: {revalidate: 3600, tags: ["sanity-products"]}};

function priceLabel(product: SanityProduct) {
  if (product.priceType === "contact") return "Liên hệ";
  const price = product.price?.toLocaleString("vi-VN") ?? "";
  return product.priceType === "from" ? `Từ ${price}đ` : `${price}đ`;
}

function toProduct(product: SanityProduct): Product | null {
  const gallery = (product.images ?? []).map(image => imageUrl(image as never)).filter((url): url is string => Boolean(url));
  if (!product.slug || !gallery[0]) return null;
  return {slug: product.slug, name: product.title, category: product.category, priceLabel: priceLabel(product), shortDescription: product.shortDescription ?? "", description: product.description ?? "", cover: gallery[0], gallery, colors: product.colors ?? [], occasions: product.occasions ?? [], featured: Boolean(product.featured), available: product.active !== false};
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
    categoryTiles: staticCategories.map(category => ({slug: category.slug, name: category.name, image: category.image})),
    featuredProducts: staticProducts.filter(product => product.available && product.featured),
    instagramImages: staticProducts.slice(1, 7).map(product => ({src: product.cover, alt: product.name})),
  };
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const fallback = fallbackHomeContent();
  if (!sanityClient) return fallback;
  try {
    const homePage = await sanityClient.fetch<{categoryTiles?: SanityHomeCategory[]; featuredProducts?: SanityHomeProduct[]; instagramImages?: SanityHomeImage[]} | null>(
      `*[_id == "homePage"][0]{categoryTiles[]{category, title, image}, featuredProducts[]{product->${projection}, titleOverride, imageOverride}, instagramImages[]{image, alt}}`,
      {},
      {next: {revalidate: 3600, tags: ["sanity-home", "sanity-products"]}},
    );
    if (!homePage) return fallback;
    const categoryTiles = Array.isArray(homePage.categoryTiles) && homePage.categoryTiles.length
      ? homePage.categoryTiles.flatMap(item => {
          const image: string | undefined = item.image ? imageUrl(item.image as never) : undefined;
          if (!item.category || !item.title || !image) return [];
          return [{slug: item.category, name: item.title, image}];
        })
      : fallback.categoryTiles;
    const featuredProducts = Array.isArray(homePage.featuredProducts)
      ? homePage.featuredProducts.flatMap(item => {
        const product = item.product && toProduct(item.product);
        if (!product) return [];
        const homeImage: string | undefined = item.imageOverride ? imageUrl(item.imageOverride as never) : undefined;
        return [{...product, name: item.titleOverride?.trim() || product.name, ...(homeImage ? {cover: homeImage} : {})}];
      })
      : fallback.featuredProducts;
    const instagramImages = Array.isArray(homePage.instagramImages) && homePage.instagramImages.length
      ? homePage.instagramImages.flatMap(item => {
          const src: string | undefined = item.image ? imageUrl(item.image as never) : undefined;
          return src ? [{src, alt: item.alt?.trim() || "Hình ảnh hoa tại Tamas"}] : [];
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
