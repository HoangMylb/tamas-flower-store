import type { Metadata } from "next";
import { Cormorant_Garamond, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import "./image-quality.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700"] });
const body = Be_Vietnam_Pro({ variable: "--font-body", subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = { metadataBase: siteUrl ? new URL(siteUrl) : undefined, title: { default: "Tamas Flower Store | Tiệm hoa tại Sài Gòn", template: "%s | Tamas Flower Store" }, description: "Hoa tươi, hoa sáp, hoa len, flower box và thiết kế theo yêu cầu tại TP. Hồ Chí Minh.", openGraph: { title: "Tamas Flower Store", description: "Hoa dành cho những điều khó nói thành lời.", type: "website", locale: "vi_VN" } };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${display.variable} ${body.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
