"use client";

import {NextStudio} from "next-sanity/studio";
import {sanityConfig} from "@/sanity/config";
import {hasSanityConfig} from "@/sanity/env";

export default function AdminPage() {
  if (!hasSanityConfig) return <main style={{padding: "2rem", fontFamily: "sans-serif"}}><h1>Sanity chưa kết nối</h1><p>Thêm NEXT_PUBLIC_SANITY_PROJECT_ID và NEXT_PUBLIC_SANITY_DATASET vào .env.local, rồi khởi động lại server.</p></main>;
  return <NextStudio config={sanityConfig}/>;
}
