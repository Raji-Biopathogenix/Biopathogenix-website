import { API_BASE_URL } from "@/config/env";
import { ProductDetailResponse } from "@/types/product";
import ProductDetailPage from "@/components/ProductDetail/ProductDetailPage";

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/product-slugs/`, { cache: 'no-store' });
    if (!res.ok) return [];
    const products: { slug: string; category: string | null; sub_category: string | null }[] = await res.json();
    return products
      .filter(p => p.category && p.sub_category)
      .map(p => ({ category: p.category!, sub_category: p.sub_category!, product: p.slug }));
  } catch {
    return [];
  }
}

export const revalidate = 0;

async function fetchProductDetail(slug: string): Promise<ProductDetailResponse> {
  const res = await fetch(`${API_BASE_URL}/v1/product_detail?slug=${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
}

export default async function NestedProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; sub_category: string; product: string }>;
}) {
  const { product } = await params;
  const response = await fetchProductDetail(product);
  const productData = response?.result?.data;

  return <ProductDetailPage prd_details={productData} />;
}
