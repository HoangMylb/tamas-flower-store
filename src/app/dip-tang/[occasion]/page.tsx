import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {PageShell} from "@/components/PageShell";
import {ProductCard} from "@/components/ProductCard";
import {Arrow} from "@/components/Icons";
import {getOccasionGuide, occasionGuides} from "@/data/occasion-guides";
import {getActiveProducts} from "@/sanity/products";

export const revalidate = 3600;
const pageSize = 8;
type Props = {params: Promise<{occasion: string}>; searchParams: Promise<{page?: string}>};

export function generateStaticParams() { return occasionGuides.map(({slug}) => ({occasion: slug})); }
export async function generateMetadata({params}: Props): Promise<Metadata> { const guide = getOccasionGuide((await params).occasion); return guide ? {title: guide.occasion, description: guide.introduction, alternates: {canonical: `/dip-tang/${guide.slug}`}} : {}; }
export default async function OccasionPage({params, searchParams}: Props) {
  const guide = getOccasionGuide((await params).occasion); if (!guide) notFound();
  const requestedPage = Number((await searchParams).page ?? "1"); const products = (await getActiveProducts()).filter(product => product.occasions.includes(guide.occasion));
  const pages = Math.max(1, Math.ceil(products.length / pageSize)); const page = Number.isInteger(requestedPage) ? Math.min(Math.max(1, requestedPage), pages) : 1;
  const pageItems = products.slice((page - 1) * pageSize, page * pageSize); const href = (target: number) => target === 1 ? `/dip-tang/${guide.slug}` : `/dip-tang/${guide.slug}?page=${target}`;
  return <PageShell><section className="occasion-hero"><p className="location">Gợi ý theo dịp</p><h1>{guide.title}</h1><p>{guide.introduction}</p></section><section className="occasion-advice"><h2>Chọn loại hoa nào?</h2><div>{guide.recommendations.map(item => <article key={item.category}><h3>{item.category}</h3><p>{item.reason}</p><Link className="text-link" href={`/san-pham?category=${encodeURIComponent(item.category === "Hoa len & gấu bông" ? "hoa-len" : item.category === "Hoa tươi" ? "hoa-tuoi" : item.category === "Hoa sáp" ? "hoa-sap" : item.category === "Hoa cưới" ? "hoa-cuoi" : "flower-box")}`}>Xem mẫu <Arrow/></Link></article>)}</div></section><section className="price-guide"><h2>Chi phí và kích thước</h2><p>Hoa sáp có thể mix hồng, lan điệp, tulip, cẩm chướng, anh túc, mao lương, họa mi và nhiều loại hoa khác theo tone bạn chọn.</p><div><p><strong>Dưới 130.000đ</strong> — bó nhỏ, dài khoảng 30–35cm (khoảng 2 gang).</p><p><strong>150.000–300.000đ</strong> — bó vừa, dài khoảng 40–50cm (khoảng 3 gang).</p><p><strong>Trên 300.000đ</strong> — bó to, nhiều bông hơn; chiều dài và bề ngang lớn hơn bó vừa (từ khoảng 3,5 gang).</p></div><p>Khách có thể điều chỉnh số lượng hoa hoặc ngân sách theo yêu cầu. Nhắn Facebook Tamas Flower Store hoặc Zalo 0708 884 022; Facebook thường được phản hồi nhanh hơn.</p></section><section className="listing section occasion-products"><div className="section-heading"><div><h2>Mẫu phù hợp cho dịp này</h2><p>{products.length} mẫu đang hiển thị</p></div><Link className="text-link" href="/san-pham">Xem toàn bộ catalog <Arrow/></Link></div><div className="product-grid">{pageItems.map(product => <ProductCard product={product} key={product.slug}/>)}</div>{pages > 1 && <nav className="pagination" aria-label="Phân trang sản phẩm"><Link aria-disabled={page === 1} className={page === 1 ? "disabled" : ""} href={href(Math.max(1, page - 1))}>Trước</Link>{Array.from({length: pages}, (_, index) => index + 1).map(number => <Link key={number} className={number === page ? "active" : ""} href={href(number)}>{number}</Link>)}<Link aria-disabled={page === pages} className={page === pages ? "disabled" : ""} href={href(Math.min(pages, page + 1))}>Sau</Link></nav>}</section></PageShell>;
}
