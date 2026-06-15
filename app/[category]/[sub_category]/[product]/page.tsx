import { API_BASE_URL } from "@/config/env";
import { ProductDetailResponse } from "@/types/product";
import ProductDetailPage from "@/components/ProductDetail/ProductDetailPage";

async function fetchProductDetail(slug: string): Promise<ProductDetailResponse> {
  const res = await fetch(`${API_BASE_URL}/v1/product_detail?slug=${slug}`, {
    next: { revalidate: 30 },
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
