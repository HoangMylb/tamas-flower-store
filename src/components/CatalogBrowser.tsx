"use client";

import {FormEvent, useEffect, useMemo, useState} from "react";
import {ProductCard} from "@/components/ProductCard";
import {categories} from "@/data/categories";
import type {Product} from "@/data/products";
import styles from "@/app/san-pham/catalog.module.css";

const pageSize = 8;
const quickCategories = categories.slice(0, 3);
type Query = {category?: string; q?: string; page?: string};

function readQuery(): Query {
  const params = new URLSearchParams(window.location.search);
  return {category: params.get("category") ?? undefined, q: params.get("q") ?? undefined, page: params.get("page") ?? undefined};
}

function writeQuery(query: Query) {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.q) params.set("q", query.q);
  if (query.page && query.page !== "1") params.set("page", query.page);
  window.history.pushState(null, "", params.size ? `/san-pham?${params}` : "/san-pham");
}

export function CatalogBrowser({products, initialQuery}: {products: Product[]; initialQuery: Query}) {
  const [category, setCategory] = useState(initialQuery.category ?? "");
  const [search, setSearch] = useState(initialQuery.q ?? "");
  const [page, setPage] = useState(Math.max(1, Number(initialQuery.page ?? "1") || 1));

  useEffect(() => {
    const restoreFromUrl = () => {
      const query = readQuery();
      setCategory(query.category ?? ""); setSearch(query.q ?? ""); setPage(Math.max(1, Number(query.page ?? "1") || 1));
    };
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, []);

  const matches = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("vi-VN");
    return products.filter((product) => (!category || product.category === category) && (!needle || `${product.name} ${product.shortDescription} ${product.colors.join(" ")} ${product.occasions.join(" ")}`.toLocaleLowerCase("vi-VN").includes(needle)));
  }, [category, products, search]);
  const pages = Math.max(1, Math.ceil(matches.length / pageSize));
  const visiblePage = Math.min(page, pages);
  const items = matches.slice((visiblePage - 1) * pageSize, visiblePage * pageSize);
  const overflowCategory = quickCategories.some((item) => item.slug === category) ? "" : category;
  const apply = (next: Partial<Query> = {}) => {
    const query = {category, q: search, page: String(page), ...next};
    setCategory(query.category ?? ""); setSearch(query.q ?? ""); setPage(Math.max(1, Number(query.page ?? "1") || 1)); writeQuery(query);
  };
  const submitSearch = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); apply({page: "1"}); };

  return <section className="listing section"><div className={styles.toolbar}><form className={styles.search} onSubmit={submitSearch} role="search"><label className="sr-only" htmlFor="catalog-search">Tìm sản phẩm</label><input id="catalog-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm tên hoa, màu sắc hoặc dịp tặng"/><button type="submit">Tìm hoa</button></form><div className={styles.quickFilters} aria-label="Lọc danh mục"><button type="button" className={!category ? styles.active : ""} onClick={() => apply({category: "", page: "1"})}>Tất cả</button>{quickCategories.map((item) => <button type="button" className={category === item.slug ? styles.active : ""} onClick={() => apply({category: item.slug, page: "1"})} key={item.slug}>{item.name}</button>)}<label className={styles.categorySelect}><span className="sr-only">Danh mục khác</span><select value={overflowCategory} onChange={(event) => apply({category: event.target.value, page: "1"})}><option value="">Danh mục khác</option>{categories.slice(3).map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label></div></div><p className="catalog-count" aria-live="polite">{matches.length} mẫu phù hợp{search.trim() ? ` với “${search.trim()}”` : ""}</p><div className={`product-grid ${styles.grid}`}>{items.map((product) => <ProductCard product={product} key={product.slug}/>)}</div>{!items.length && <p className="empty">Chưa có mẫu khớp từ khoá này. Hãy thử tên hoa, màu sắc khác hoặc nhắn shop để được tư vấn nhanh.</p>}{pages > 1 && <nav className="pagination" aria-label="Phân trang catalog"><button type="button" disabled={visiblePage === 1} onClick={() => apply({page: String(visiblePage - 1)})}>Trước</button>{Array.from({length: pages}, (_, index) => index + 1).map((number) => <button type="button" className={number === visiblePage ? "active" : ""} onClick={() => apply({page: String(number)})} key={number}>{number}</button>)}<button type="button" disabled={visiblePage === pages} onClick={() => apply({page: String(visiblePage + 1)})}>Sau</button></nav>}</section>;
}
