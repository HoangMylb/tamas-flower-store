import {createClient} from "@sanity/client";
import {readFile} from "node:fs/promises";
import {resolve} from "node:path";
import {products} from "../src/data/products";
import {categories} from "../src/data/categories";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN are required.");

const client = createClient({projectId, dataset, apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-24", token, useCdn: false});
const uploaded = new Map<string, {_type: "image"; asset: {_type: "reference"; _ref: string}}>();
const homeFeaturedSlugs = ["pink-whisper", "pastel-garden", "soft-morning"];
const homeFeaturedProducts = products
  .filter(product => homeFeaturedSlugs.includes(product.slug))
  .sort((a, b) => homeFeaturedSlugs.indexOf(a.slug) - homeFeaturedSlugs.indexOf(b.slug))
  .map(product => ({_key: product.slug, _type: "homeProduct", product: {_type: "reference", _ref: `product-${product.slug}`}}));

async function uploadImage(path: string) {
  const cached = uploaded.get(path);
  if (cached) return cached;
  const asset = await client.assets.upload("image", await readFile(resolve(process.cwd(), "public", path.replace(/^\//, ""))), {filename: path.split("/").at(-1)});
  const image = {_type: "image" as const, asset: {_type: "reference" as const, _ref: asset._id}};
  uploaded.set(path, image);
  return image;
}

async function main() {
  console.log(`Starting migration of ${products.length} products.`);
  const existingIds = new Set(await client.fetch<string[]>(`*[_type == "product" && _id in $ids]._id`, {ids: products.map(product => `product-${product.slug}`)}));
  const productsToCreate = products.filter(product => !existingIds.has(`product-${product.slug}`));
  await Promise.all(productsToCreate.map(async (product, index) => {
    console.log(`Migrating ${index + 1}/${products.length}: ${product.slug}`);
    const images = (await Promise.all(product.gallery.slice(0, 5).map(uploadImage)))
      .map((image, imageIndex) => ({...image, _key: `image-${imageIndex + 1}`}));
    const price = Number(product.priceLabel.replace(/[^\d]/g, ""));
    await client.create({
      _id: `product-${product.slug}`,
      _type: "product",
      title: product.name,
      slug: {_type: "slug", current: product.slug},
      category: product.category,
      images,
      priceType: product.priceLabel === "Liên hệ" ? "contact" : product.priceLabel.startsWith("Từ") ? "from" : "fixed",
      ...(price ? {price} : {}),
      shortDescription: product.shortDescription,
      description: product.description,
      colors: product.colors,
      occasions: product.occasions,
      featured: Boolean(product.featured),
      active: product.available,
    });
  }));

  await client.createIfNotExists({
    _id: "homePage",
    _type: "homePage",
    featuredProducts: homeFeaturedProducts,
  });

  const categoryTiles = await Promise.all(categories.map(async category => ({
    _key: category.slug,
    _type: "homeCategoryTile",
    category: category.slug,
    title: category.name,
    image: await uploadImage(category.image),
  })));
  const instagramImages = await Promise.all(products.slice(1, 7).map(async product => ({
    _key: `instagram-${product.slug}`,
    _type: "homeInstagramImage",
    image: await uploadImage(product.cover),
    alt: product.name,
  })));
  await client.patch("homePage").setIfMissing({categoryTiles, instagramImages}).commit();

  const currentFeatured = await client.fetch<{featuredProducts?: Array<{_key?: string; [key: string]: unknown}>} | null>(`*[_id == "homePage"][0]{featuredProducts[]}`);
  const orderedFeatured = homeFeaturedProducts.map(product => currentFeatured?.featuredProducts?.find(existing => existing._key === product._key) ?? product);
  if (currentFeatured?.featuredProducts?.length !== orderedFeatured.length || orderedFeatured.some((product, index) => currentFeatured?.featuredProducts?.[index]?._key !== product._key)) await client.patch("homePage").set({featuredProducts: orderedFeatured}).commit();

  const count = await client.fetch<number>(`count(*[_type == "product"])`);
  console.log(`Migrated ${products.length} static products. Sanity product count: ${count}.`);
}

const keepAlive = setInterval(() => console.log("Migration is still running..."), 5_000);

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Migration failed.");
    process.exitCode = 1;
  })
  .finally(() => clearInterval(keepAlive));
