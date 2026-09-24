import {revalidatePath, revalidateTag} from "next/cache";
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) return NextResponse.json({message: "Unauthorized"}, {status: 401});
  revalidateTag("sanity-products", "max");
  revalidateTag("sanity-home", "max");
  revalidatePath("/");
  revalidatePath("/san-pham");
  revalidatePath("/san-pham/[slug]", "page");
  revalidatePath("/dip-tang/[occasion]", "page");
  return NextResponse.json({revalidated: true});
}
