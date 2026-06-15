import { API_BASE_URL } from "@/config/env";
import {ProductDetailResponse} from '@/types/product';
import ProductDetailPage from '@/components/ProductDetail/ProductDetailPage'
import { redirect } from "next/navigation";


async function FetchProductDetail(slug:string): Promise<ProductDetailResponse> {
  const res = await fetch(`${API_BASE_URL}/v1/product_detail?slug=${slug}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error('Failed to fetch product detail');
  return res.json();
}


export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const response = await FetchProductDetail(slug)
  const productData = response?.result?.data;

  const canonicalParent = productData?.category_path?.parent_slug;
  const canonicalSub = productData?.category_path?.sub_category_slug;
  const canonicalSlug = productData?.slug;

  if (canonicalParent && canonicalSub && canonicalSlug) {
    redirect(`/${canonicalParent}/${canonicalSub}/${canonicalSlug}`);
  }

  return <ProductDetailPage prd_details={productData} />;
}
