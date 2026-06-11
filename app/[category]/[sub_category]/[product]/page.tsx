import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/config/env";
import { ProductDetailResponse } from "@/types/product";
import ProductDetailPage from "@/components/ProductDetail/ProductDetailPage";
import { cookies } from "next/headers";

async function fetchProductDetail(slug: string): Promise<ProductDetailResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }), // only added if token exists
  };

  const res = await fetch(`${API_BASE_URL}/v1/product_detail?slug=${slug}`,{
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
}

export default async function NestedProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; sub_category: string; product: string }>;
}) {
  const { category, sub_category, product } = await params;
  const response = await fetchProductDetail(product);
  const productData = response?.result?.data;


  return <ProductDetailPage prd_details={productData} />;
}
