import {categories} from "@/data/categories";
import {getOccasionGuide} from "@/data/occasion-guides";
import {sanityClient} from "./client";

export type SeoLandingPage = {
  pageTitle: string;
  introduction: string;
  seoTitle?: string;
  seoDescription?: string;
};

type StoredSeoLandingPage = Partial<SeoLandingPage>;
const seoCache = {next: {revalidate: 3600, tags: ["sanity-seo-pages"]}};

function mergePage(fallback: SeoLandingPage, page: StoredSeoLandingPage | null): SeoLandingPage {
  return {
    pageTitle: page?.pageTitle?.trim() || fallback.pageTitle,
    introduction: page?.introduction?.trim() || fallback.introduction,
    seoTitle: page?.seoTitle?.trim() || undefined,
    seoDescription: page?.seoDescription?.trim() || undefined,
  };
}

export async function getCategorySeoPage(category: string): Promise<SeoLandingPage | null> {
  const categoryInfo = categories.find(item => item.slug === category);
  if (!categoryInfo) return null;
  const fallback = {pageTitle: categoryInfo.name, introduction: `Khám phá các mẫu ${categoryInfo.name.toLocaleLowerCase("vi-VN")} tại Tamas. Chị có thể chọn theo dịp tặng, tone màu và ngân sách rồi nhắn shop để được tư vấn.`};
  if (!sanityClient) return fallback;
  try {
    const page = await sanityClient.fetch<StoredSeoLandingPage | null>(`*[_type == "categoryPage" && category == $category][0]{pageTitle, introduction, seoTitle, seoDescription}`, {category}, seoCache);
    return mergePage(fallback, page);
  } catch {
    return fallback;
  }
}

export async function getOccasionSeoPage(slug: string): Promise<SeoLandingPage | null> {
  const guide = getOccasionGuide(slug);
  if (!guide) return null;
  const fallback = {pageTitle: guide.title, introduction: guide.introduction};
  if (!sanityClient) return fallback;
  try {
    const page = await sanityClient.fetch<StoredSeoLandingPage | null>(`*[_type == "occasionPage" && occasion == $occasion][0]{pageTitle, introduction, seoTitle, seoDescription}`, {occasion: guide.occasion}, seoCache);
    return mergePage(fallback, page);
  } catch {
    return fallback;
  }
}
