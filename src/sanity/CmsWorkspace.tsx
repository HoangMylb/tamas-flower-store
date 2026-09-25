"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Select,
  Text,
  TextInput,
} from "@sanity/ui";
import { EyeOpenIcon } from "@sanity/icons/EyeOpen";
import { EditIcon } from "@sanity/icons/Edit";
import { TrashIcon } from "@sanity/icons/Trash";
import { useClient } from "sanity";

type ProductImage = {
  _key: string;
  alt?: string;
  asset?: { _id: string; url?: string };
};
type Product = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  category?: string;
  occasions?: string[];
  colors?: string[];
  images?: ProductImage[];
  priceType?: string;
  price?: number;
  onSale?: boolean;
  salePrice?: number;
  featured?: boolean;
  active?: boolean;
  availabilityNote?: string;
  shortDescription?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
};
const categories: Record<string, string> = {
  "hoa-tuoi": "Hoa tươi",
  "hoa-sap": "Hoa sáp",
  "hoa-lua": "Hoa lụa",
  "hoa-len": "Hoa len & gấu bông",
  "flower-box": "Hộp hoa",
  "hoa-cuoi": "Hoa cưới",
};
const occasions = [
  "Sinh nhật",
  "Tốt nghiệp",
  "Kỷ niệm",
  "Tình yêu",
  "Cưới",
  "Chúc mừng",
  "Cảm ơn",
];
const pageSize = 10;
const cellStyle = {
  borderBottom: "1px solid #ddd4cc",
  padding: "12px 16px",
  textAlign: "left" as const,
  verticalAlign: "middle",
};
const textareaStyle = {
  border: "1px solid #d8d2ca",
  borderRadius: 6,
  boxSizing: "border-box" as const,
  marginTop: 8,
  padding: 10,
  resize: "vertical" as const,
  width: "100%",
};

function ProductEditor({ id, onSaved }: { id: string; onSaved: () => void }) {
  const baseClient = useClient({ apiVersion: "2025-02-19" });
  const client = useMemo(
    () => baseClient.withConfig({ perspective: "previewDrafts" }),
    [baseClient],
  );
  const [product, setProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [colors, setColors] = useState("");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [priceType, setPriceType] = useState("contact");
  const [price, setPrice] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [salePrice, setSalePrice] = useState("");
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [availabilityNote, setAvailabilityNote] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState("");
  useEffect(() => {
    client
      .fetch<Product>(
        `*[_id == $id][0]{_id,title,slug,category,occasions,colors,images[]{_key,alt,asset->{_id,url}},priceType,price,onSale,salePrice,featured,active,availabilityNote,shortDescription,description,seoTitle,seoDescription}`,
        { id: id.replace(/^drafts\./, "") },
      )
      .then((document) => {
        if (!document) return;
        setProduct(document);
        setTitle(document.title || "");
        setSlug(document.slug?.current || "");
        setCategory(document.category || "");
        setSelectedOccasions(document.occasions || []);
        setColors((document.colors || []).join(", "));
        setImages(document.images || []);
        setPriceType(document.priceType || "contact");
        setPrice(document.price?.toString() || "");
        setOnSale(Boolean(document.onSale));
        setSalePrice(document.salePrice?.toString() || "");
        setFeatured(Boolean(document.featured));
        setActive(document.active !== false);
        setAvailabilityNote(document.availabilityNote || "Nhận đặt theo tình trạng hoa");
        setShortDescription(document.shortDescription || "");
        setDescription(document.description || "");
        setSeoTitle(document.seoTitle || "");
        setSeoDescription(document.seoDescription || "");
      });
  }, [client, id]);
  const toggleOccasion = (occasion: string) =>
    setSelectedOccasions((values) =>
      values.includes(occasion)
        ? values.filter((value) => value !== occasion)
        : [...values, occasion],
    );
  const addImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files || []);
    event.currentTarget.value = "";
    if (!files.length) return;
    setUploading(true);
    try {
      const assets = await Promise.all(
        files.map((file) =>
          client.assets.upload("image", file, { filename: file.name }),
        ),
      );
      setImages((current) => [
        ...current,
        ...assets.map((asset, index) => ({
          _key: `${Date.now()}-${index}-${asset._id}`,
          asset: { _id: asset._id, url: asset.url },
        })),
      ]);
    } finally {
      setUploading(false);
    }
  };
  const save = async () => {
    const normalizedSlug = slug.trim().toLocaleLowerCase("vi-VN");
    if (!product || !title.trim() || !category || saving) return;
    if (!normalizedSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
      setSaveError("Đường dẫn chỉ dùng chữ thường không dấu, số và dấu gạch ngang.");
      return;
    }
    if (!images.some((image) => image.asset?._id)) {
      setSaveError("Cần giữ lại ít nhất một hình ảnh sản phẩm.");
      return;
    }
    if (priceType !== "contact" && onSale) {
      const originalPrice = Number(price);
      const discountedPrice = Number(salePrice);
      if (!discountedPrice || discountedPrice >= originalPrice) {
        setSaveError("Giá đã giảm phải lớn hơn 0 và thấp hơn giá gốc.");
        return;
      }
    }
    setSaving(true);
    setSaveError("");
    try {
      const documentId = id.replace(/^drafts\./, "");
      const draftId = `drafts.${documentId}`;
      const rawClient = baseClient.withConfig({ perspective: "raw" });
      const source = await rawClient.fetch<Record<string, unknown> | null>(
        `coalesce(*[_id == $draftId][0], *[_id == $documentId][0])`,
        { draftId, documentId },
      );
      if (!source) throw new Error("Không tìm thấy sản phẩm để xuất bản.");
      const productImages = images
        .filter((image) => image.asset?._id)
        .map((image) => ({
          _key: image._key,
          _type: "image",
          alt: image.alt?.trim() || undefined,
          asset: { _type: "reference", _ref: image.asset!._id },
        }));
      const {_createdAt, _id, _rev, _updatedAt, ...sourceFields} = source;
      const publishable: Record<string, unknown> = {
        ...sourceFields,
        _id: documentId,
        _type: "product",
        title: title.trim(),
        slug: { _type: "slug", current: normalizedSlug },
        category,
        occasions: selectedOccasions,
        colors: colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean),
        images: productImages,
        priceType,
        onSale: priceType !== "contact" && onSale,
        featured,
        active,
        availabilityNote: availabilityNote.trim() || undefined,
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim() || undefined,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
      };
      if (priceType === "contact") {
        delete publishable.price;
        delete publishable.salePrice;
      } else {
        publishable.price = Number(price) || 0;
        if (onSale) publishable.salePrice = Number(salePrice) || 0;
        else delete publishable.salePrice;
      }
      const transaction = rawClient.transaction().createOrReplace(publishable as never);
      if (source._id === draftId) transaction.delete(draftId);
      await transaction.commit();
      onSaved();
    } catch {
      setSaveError("Không thể lưu sản phẩm lúc này. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };
  if (!product)
    return (
      <Box padding={5}>
        <Text muted>Đang tải biểu mẫu…</Text>
      </Box>
    );
  return (
    <Box padding={5} style={{ maxWidth: 920, margin: "0 auto" }}>
      <Flex direction="column" gap={5}>
        <Box>
          <Text size={2} style={{ display: "block" }} weight="semibold">
            Thông tin sản phẩm
          </Text>
          <Text muted size={1} style={{ display: "block", marginTop: 4 }}>
            Bấm “Lưu & xuất bản” để cập nhật ngay trên website.
          </Text>
        </Box>
        <Card border padding={4} radius={2}>
          <Box
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            <Box>
              <Text size={1} weight="semibold">
                Tên sản phẩm
              </Text>
              <Box marginTop={2}>
                <TextInput
                  aria-label="Tên sản phẩm"
                  onChange={(event) => setTitle(event.currentTarget.value)}
                  value={title}
                />
              </Box>
            </Box>
            <Box>
              <Text size={1} weight="semibold">
                Đường dẫn sản phẩm
              </Text>
              <Box marginTop={2}>
                <TextInput
                  aria-label="Đường dẫn sản phẩm"
                  onChange={(event) => setSlug(event.currentTarget.value)}
                  placeholder="vi-du-ten-san-pham"
                  value={slug}
                />
              </Box>
              <Text muted size={1} style={{ display: "block", marginTop: 6 }}>
                Đổi đường dẫn sẽ làm liên kết cũ không còn sử dụng được.
              </Text>
            </Box>
            <Box>
              <Text size={1} weight="semibold">
                Danh mục
              </Text>
              <Box marginTop={2}>
                <Select
                  onChange={(event) => setCategory(event.currentTarget.value)}
                  value={category}
                >
                  <option value="">Chọn danh mục</option>
                  {Object.entries(categories).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Box>
            </Box>
            <Box>
              <Text size={1} weight="semibold">
                Loại giá
              </Text>
              <Box marginTop={2}>
                <Select
                  onChange={(event) => {
                    const nextPriceType = event.currentTarget.value;
                    setPriceType(nextPriceType);
                    if (nextPriceType === "contact") setOnSale(false);
                  }}
                  value={priceType}
                >
                  <option value="fixed">Giá cố định</option>
                  <option value="from">Giá từ</option>
                  <option value="contact">Liên hệ</option>
                </Select>
              </Box>
            </Box>
            {priceType !== "contact" && (
              <Box style={{ gridColumn: "1 / -1" }}>
                <label style={{ alignItems: "center", display: "flex", gap: 8 }}>
                  <input
                    checked={onSale}
                    onChange={(event) => setOnSale(event.currentTarget.checked)}
                    type="checkbox"
                  />
                  Giảm giá
                </label>
                <Box
                  marginTop={3}
                  style={{
                    display: "grid",
                    gap: 20,
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  }}
                >
                  <Box>
                    <Text size={1} weight="semibold">
                      Giá
                    </Text>
                    <Box marginTop={2}>
                      <TextInput
                        aria-label="Giá sản phẩm"
                        inputMode="numeric"
                        onChange={(event) => setPrice(event.currentTarget.value)}
                        type="number"
                        value={price}
                      />
                    </Box>
                  </Box>
                  {onSale && (
                    <Box>
                      <Text size={1} weight="semibold">
                        Giá đã giảm
                      </Text>
                      <Box marginTop={2}>
                        <TextInput
                          aria-label="Giá đã giảm"
                          inputMode="numeric"
                          onChange={(event) => setSalePrice(event.currentTarget.value)}
                          type="number"
                          value={salePrice}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
          <Box marginTop={4}>
            <Text size={1} weight="semibold">
              Dịp tặng
            </Text>
            <Flex gap={3} marginTop={2} wrap="wrap">
              {occasions.map((occasion) => (
                <label
                  key={occasion}
                  style={{ alignItems: "center", display: "flex", gap: 6 }}
                >
                  <input
                    checked={selectedOccasions.includes(occasion)}
                    onChange={() => toggleOccasion(occasion)}
                    type="checkbox"
                  />
                  {occasion}
                </label>
              ))}
            </Flex>
          </Box>
          <Box marginTop={4}>
            <Text size={1} weight="semibold">
              Tone màu
            </Text>
            <Box marginTop={2}>
              <TextInput
                aria-label="Tone màu"
                onChange={(event) => setColors(event.currentTarget.value)}
                placeholder="Ví dụ: Hồng, Kem, Pastel"
                value={colors}
              />
            </Box>
            <Text muted size={1} style={{ display: "block", marginTop: 6 }}>
              Nhập nhiều tone màu, cách nhau bằng dấu phẩy.
            </Text>
          </Box>
          <Box marginTop={4}>
            <label style={{ alignItems: "center", display: "flex", gap: 8 }}>
              <input
                checked={featured}
                onChange={(event) => setFeatured(event.currentTarget.checked)}
                type="checkbox"
              />
              Sản phẩm nổi bật
            </label>
          </Box>
          <Box marginTop={4}>
            <label style={{ alignItems: "center", display: "flex", gap: 8 }}>
              <input
                checked={active}
                onChange={(event) => setActive(event.currentTarget.checked)}
                type="checkbox"
              />
              Đang hiển thị trên website
            </label>
          </Box>
          <Box marginTop={4}>
            <Text size={1} weight="semibold">
              Tình trạng hiển thị ở trang sản phẩm
            </Text>
            <Box marginTop={2}>
              <TextInput
                aria-label="Tình trạng hiển thị ở trang sản phẩm"
                onChange={(event) => setAvailabilityNote(event.currentTarget.value)}
                placeholder="Ví dụ: Nhận đặt theo tình trạng hoa"
                value={availabilityNote}
              />
            </Box>
          </Box>
        </Card>
        <Card border padding={4} radius={2}>
          <Text size={1} weight="semibold">
            Hình ảnh sản phẩm
          </Text>
          <Text muted size={1} style={{ display: "block", marginTop: 4 }}>
            Ảnh đầu tiên là ảnh đại diện. Mỗi ảnh nên có mô tả alt rõ ràng,
            không nhồi từ khóa.
          </Text>
          <Box
            marginTop={4}
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            }}
          >
            {images.map((image, index) => (
              <Card border key={image._key} padding={2} radius={2}>
                <Box
                  style={{
                    aspectRatio: "1 / 1",
                    background: "#f4f1ed",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  {image.asset?.url ? (
                    <img
                      alt={image.alt || ""}
                      src={image.asset.url}
                      style={{
                        height: "100%",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  ) : (
                    <Flex align="center" height="fill" justify="center">
                      <Text muted size={1}>
                        Không thể xem ảnh
                      </Text>
                    </Flex>
                  )}
                </Box>
                <Text muted size={1} style={{ display: "block", marginTop: 8 }}>
                  Ảnh {index + 1}
                  {index === 0 ? " · ảnh đại diện" : ""}
                </Text>
                <Box marginTop={2}>
                  <TextInput
                    aria-label={`Mô tả alt cho ảnh ${index + 1}`}
                    onChange={(event) =>
                      setImages((current) =>
                        current.map((item) =>
                          item._key === image._key
                            ? { ...item, alt: event.currentTarget.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="Mô tả ảnh (alt text)"
                    value={image.alt || ""}
                  />
                </Box>
                <Box marginTop={2}>
                  <Button
                    fontSize={1}
                    onClick={() =>
                      setImages((current) =>
                        current.filter((item) => item._key !== image._key),
                      )
                    }
                    text="Bỏ ảnh"
                    tone="critical"
                    width="fill"
                  />
                </Box>
              </Card>
            ))}
            <label
              style={{
                alignItems: "center",
          border: "1px dashed #ddd4cc",
                borderRadius: 8,
                cursor: uploading ? "wait" : "pointer",
                display: "flex",
                justifyContent: "center",
                minHeight: 260,
                padding: 20,
                textAlign: "center",
              }}
            >
              <input
                accept="image/*"
                disabled={uploading}
                multiple
                onChange={addImages}
                style={{ display: "none" }}
                type="file"
              />
              <Box>
                <Text size={2} weight="semibold">
                  {uploading ? "Đang tải ảnh…" : "Tải thêm ảnh"}
                </Text>
                <Text muted size={1} style={{ display: "block", marginTop: 6 }}>
                  Chọn một hoặc nhiều ảnh
                </Text>
              </Box>
            </label>
          </Box>
        </Card>
        <Card border padding={4} radius={2}>
          <Text size={1} weight="semibold">
            Mô tả sản phẩm
          </Text>
          <Box marginTop={3}>
            <Text size={1} weight="semibold">
              Mô tả ngắn
            </Text>
            <textarea
              onChange={(event) =>
                setShortDescription(event.currentTarget.value)
              }
              rows={3}
              style={textareaStyle}
              value={shortDescription}
            />
          </Box>
          <Box marginTop={3}>
            <Text size={1} weight="semibold">
              Mô tả chi tiết
            </Text>
            <textarea
              onChange={(event) => setDescription(event.currentTarget.value)}
              rows={5}
              style={textareaStyle}
              value={description}
            />
          </Box>
        </Card>
        <Card border padding={4} radius={2}>
          <Text size={1} weight="semibold">
            SEO — cần kiến thức SEO
          </Text>
          <Text muted size={1} style={{ display: "block", marginTop: 4 }}>
            Chỉ thay đổi các trường này khi hiểu mục tiêu từ khóa của sản phẩm.
          </Text>
          <Box marginTop={3}>
            <Text size={1} weight="semibold">
              Tiêu đề SEO
            </Text>
            <Box marginTop={2}>
              <TextInput
                aria-label="Tiêu đề SEO"
                onChange={(event) => setSeoTitle(event.currentTarget.value)}
                value={seoTitle}
              />
            </Box>
          </Box>
          <Box marginTop={3}>
            <Text size={1} weight="semibold">
              Mô tả SEO
            </Text>
            <textarea
              aria-label="Mô tả SEO"
              onChange={(event) => setSeoDescription(event.currentTarget.value)}
              rows={3}
              style={textareaStyle}
              value={seoDescription}
            />
          </Box>
        </Card>
        {saveError && (
          <Card border padding={3} tone="critical">
            <Text size={1}>{saveError}</Text>
          </Card>
        )}
        <Flex gap={2} justify="flex-end">
          <Button
            disabled={!title.trim() || !slug.trim() || !category || !images.length || saving || uploading}
            onClick={save}
          text={saving ? "Đang xuất bản…" : "Lưu & xuất bản"}
            tone="primary"
          />
        </Flex>
      </Flex>
    </Box>
  );
}

function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [occasion, setOccasion] = useState("");
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi-VN");
    return products.filter(
      (product) =>
        (!keyword ||
          product.title?.toLocaleLowerCase("vi-VN").includes(keyword)) &&
        (!category || product.category === category) &&
        (!occasion || product.occasions?.includes(occasion)),
    );
  }, [category, occasion, products, search]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visible = useMemo(
    () => filteredProducts.slice((page - 1) * pageSize, page * pageSize),
    [filteredProducts, page],
  );
  const resultLabel =
    filteredProducts.length === products.length
      ? `${products.length} sản phẩm`
      : `${filteredProducts.length}/${products.length} sản phẩm`;
  return (
    <Box padding={6}>
      <Flex align="center" justify="space-between" marginBottom={5}>
        <Box>
          <Text
            size={3}
            style={{ display: "block", lineHeight: 1.25 }}
            weight="semibold"
          >
            Sản phẩm
          </Text>
          <Text muted size={1} style={{ display: "block", marginTop: 6 }}>
            {resultLabel} · tối đa 10 sản phẩm mỗi trang
          </Text>
        </Box>
      </Flex>
      <Box
        marginBottom={5}
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        <TextInput
          aria-label="Tìm sản phẩm theo tên"
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPage(1);
          }}
          placeholder="Tìm theo tên sản phẩm…"
          value={search}
        />
        <Select
          aria-label="Lọc theo danh mục"
          onChange={(event) => {
            setCategory(event.currentTarget.value);
            setPage(1);
          }}
          value={category}
        >
          <option value="">Tất cả danh mục</option>
          {Object.entries(categories).map(([value, title]) => (
            <option key={value} value={value}>
              {title}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Lọc theo dịp tặng"
          onChange={(event) => {
            setOccasion(event.currentTarget.value);
            setPage(1);
          }}
          value={occasion}
        >
          <option value="">Tất cả dịp tặng</option>
          {occasions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </Box>
      <Card border style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            minWidth: "720px",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th style={cellStyle}>Tên sản phẩm</th>
              <th style={cellStyle}>Danh mục</th>
              <th style={cellStyle}>Giá</th>
              <th style={cellStyle}>Hiển thị</th>
              <th style={{ ...cellStyle, textAlign: "right" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product._id}>
                <td style={cellStyle}>{product.title || "Chưa có tên"}</td>
                <td style={cellStyle}>
                  {categories[product.category || ""] || "Chưa chọn"}
                </td>
                <td style={cellStyle}>
                  {product.priceType === "contact"
                    ? "Liên hệ"
                    : product.price
                      ? `${product.price.toLocaleString("vi-VN")}đ`
                      : "—"}
                </td>
                <td style={cellStyle}>
                  {product.active === false ? "Đã ẩn" : "Đang hiển thị"}
                </td>
                <td
                  style={{
                    ...cellStyle,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Button
                    aria-label={`Xem ${product.title || "sản phẩm"}`}
                    icon={EyeOpenIcon}
                    mode="bleed"
                    onClick={() => onView(product)}
                    padding={2}
                    title="Xem chi tiết"
                  />
                  <Button
                    aria-label={`Sửa ${product.title || "sản phẩm"}`}
                    icon={EditIcon}
                    mode="bleed"
                    onClick={() => onEdit(product)}
                    padding={2}
                    title="Sửa"
                  />
                  <Button
                    aria-label={`Xóa ${product.title || "sản phẩm"}`}
                    icon={TrashIcon}
                    mode="bleed"
                    onClick={() => onDelete(product)}
                    padding={2}
                    title="Xóa"
                    tone="critical"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && (
          <Box padding={4}>
            <Text muted>
              Không tìm thấy sản phẩm phù hợp. Hãy thử đổi từ khóa hoặc bộ lọc.
            </Text>
          </Box>
        )}
      </Card>
      {totalPages > 1 && (
        <Flex gap={2} justify="flex-end" marginTop={4}>
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            text="Trước"
          />
          <Text size={1} style={{ alignSelf: "center" }}>
            Trang {page} / {totalPages}
          </Text>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            text="Sau"
          />
        </Flex>
      )}
    </Box>
  );
}

export function CmsWorkspace() {
  const baseClient = useClient({ apiVersion: "2025-02-19" });
  const client = useMemo(
    () => baseClient.withConfig({ perspective: "previewDrafts" }),
    [baseClient],
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [viewing, setViewing] = useState<Product | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const loadProducts = () =>
    client
      .fetch<Product[]>(
        `*[_type == "product"]|order(_updatedAt desc){_id,title,category,occasions,priceType,price,active}`,
      )
      .then((items) =>
        setProducts(
          items.map((item) => ({
            ...item,
            _id: item._id.replace(/^drafts\./, ""),
          })),
        ),
      );
  useEffect(() => {
    loadProducts().catch(() => setProducts([]));
  }, [client]);
  const remove = async () => {
    if (!deleting) return;
    await client.delete(deleting._id.replace(/^drafts\./, ""));
    setDeleting(null);
    await loadProducts();
  };
  return (
    <Flex height="fill">
      <Card borderRight height="fill" style={{ minWidth: 250, width: 250 }}>
        <Box padding={3}>
          <Text muted size={1} weight="semibold">
            NỘI DUNG TAMAS
          </Text>
        </Box>
        <Button
          fontSize={1}
          justify="flex-start"
          mode="bleed"
          padding={3}
          text="Trang chủ"
          width="fill"
        />
        <Button
          fontSize={1}
          justify="flex-start"
          mode="default"
          padding={3}
          text="Sản phẩm"
          tone="primary"
          width="fill"
        />
        <Button
          fontSize={1}
          justify="flex-start"
          mode="bleed"
          padding={3}
          text="SEO trang danh mục"
          width="fill"
        />
        <Button
          fontSize={1}
          justify="flex-start"
          mode="bleed"
          padding={3}
          text="SEO trang dịp tặng"
          width="fill"
        />
      </Card>
      <Box flex={1} height="fill">
        <ProductTable
          onDelete={setDeleting}
          onEdit={setEditing}
          onView={setViewing}
          products={products}
        />
      </Box>
      {viewing && (
        <Dialog
          header={viewing.title || "Chi tiết sản phẩm"}
          id="product-preview"
          onClose={() => setViewing(null)}
          width={1}
        >
          <Box padding={5}>
            <Text size={2} style={{ display: "block" }} weight="semibold">
              {viewing.title || "Chưa có tên"}
            </Text>
            <Text muted size={1} style={{ display: "block", marginTop: 12 }}>
              Danh mục: {categories[viewing.category || ""] || "Chưa chọn"}
            </Text>
            <Text muted size={1} style={{ display: "block", marginTop: 6 }}>
              Trạng thái: {viewing.active === false ? "Đã ẩn" : "Đang hiển thị"}
            </Text>
          </Box>
        </Dialog>
      )}
      {editing && (
        <Dialog
          header="Chỉnh sửa sản phẩm"
          id="product-editor-dialog"
          onClose={() => {
            setEditing(null);
            loadProducts();
          }}
          width={4}
        >
          <Box style={{ height: "75vh" }}>
            <ProductEditor
              id={editing._id}
              onSaved={() => {
                setEditing(null);
                loadProducts();
              }}
            />
          </Box>
        </Dialog>
      )}
      {deleting && (
        <Dialog
          footer={
            <Flex gap={2} justify="flex-end">
              <Button onClick={() => setDeleting(null)} text="Hủy" />
              <Button onClick={remove} text="Xóa sản phẩm" tone="critical" />
            </Flex>
          }
          header="Xác nhận xóa sản phẩm"
          id="confirm-delete"
          onClose={() => setDeleting(null)}
          width={1}
        >
          <Box padding={5}>
            <Text>
              Chị có chắc muốn xóa “{deleting.title || "sản phẩm này"}” không?
              Thao tác này không thể hoàn tác.
            </Text>
          </Box>
        </Dialog>
      )}
    </Flex>
  );
}
