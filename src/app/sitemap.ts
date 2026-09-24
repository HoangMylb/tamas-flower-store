import type {MetadataRoute} from "next"; import {getActiveProducts} from "@/sanity/products";
export const revalidate = 3600;
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/,"");if(!base)return [];const products=await getActiveProducts();return ["","/san-pham","/ve-tamas","/lien-he",...products.map(p=>`/san-pham/${p.slug}`)].map(url=>({url:`${base}${url}`,lastModified:new Date()}))}
