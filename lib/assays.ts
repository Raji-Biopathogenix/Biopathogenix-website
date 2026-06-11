import { API_BASE_URL } from "@/config/env";

export type PathogenType = "viral" | "bacterial" | "fungal" | "parasitic" | "protozoal" | "other";

export type AssayApiType =
  | "respiratory"
  | "uti"
  | "sti"
  | "wound"
  | "gi"
  | "meningitis"
  | "sepsis"
  | "other";

export interface Pathogen {
  id: number;
  name: string;
  scientific_name: string;
  pathogen_type: PathogenType;
  pathogen_type_label: string;
}

export interface AssayDocument {
  id: number;
  section: string;
  certificate_type: string;
  title: string;
  file_url: string | null;
  file_extension: string;
  sku_id?: number | null;
  sku_code?: string | null;
  sort_order: number;
}

export interface AssayPanelTargetDocument {
  id: number;
  panel_type: AssayApiType | "all";
  panel_type_label: string;
  document_type: "all_targets" | "custom_targets" | "panel_targets";
  document_type_label: string;
  title: string;
  file_url: string | null;
  file_extension: string;
  target_count: number;
  sort_order: number;
}

export interface AssayDetail {
  assay_type: AssayApiType;
  assay_type_label: string;
  reaction_format: string;
  panel_name: string;
  catalog_number: string;
  target_count: number;
}

export interface AssayRelatedInformation {
  id: number;
  title: string;
  content: string;
  sort_order: number;
}

export interface AssayProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  price: string;
  compare_price: string | null;
  is_in_stock: boolean;
  primary_image: { image?: string; image_url?: string; alt_text?: string } | null;
  assay_detail: AssayDetail | null;
  documents: AssayDocument[];
  related_information: AssayRelatedInformation[];
}

export interface AssayListResponse {
  status: string;
  result: {
    data: AssayProduct[];
    panel_documents?: AssayPanelTargetDocument[];
    count: number;
    total_pages: number;
    current_page: number;
  };
}

export interface AssayPageData {
  products: AssayProduct[];
  panelDocuments: AssayPanelTargetDocument[];
}

export type TargetDocumentSource = "product" | "panel";

export interface TargetDocumentPreview {
  id: number;
  source: TargetDocumentSource;
  title: string;
  file_url: string | null;
  file_extension: string;
  preview_supported: boolean;
  target_count: number;
  columns: string[];
  rows: string[][];
  sheet_name: string;
  truncated: boolean;
  message?: string;
}

interface TargetPreviewResponse {
  status: string;
  message: string;
  result?: TargetDocumentPreview;
}

export interface AssayTypeConfig {
  routeSlug: string;
  apiAssayType: AssayApiType;
  label: string;
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaTitle: string;
  ctaBody: string;
  whyTitle: string;
  categorySlug?: string;
  fallbackCategorySlugs?: string[];
  heroImage: string;
  bandImage: string;
  highlights: string[];
  features: { title: string; description: string }[];
}

const ASSAY_IMAGE = "/images/assay landing page/dna-research-scientist-comparing-dna-results-on-a-2024-06-21-16-15-07-utc-1536x1152.jpg";
const LAB_IMAGE = "/images/assay landing page/lab-pics_13-scaled-e1758821531748-1000x667.jpg";

const respiratoryConfig: AssayTypeConfig = {
  routeSlug: "respiratory",
  apiAssayType: "respiratory",
  label: "Respiratory Assays",
  eyebrow: "BPX qPLEX Respiratory",
  heroTitle: "Respiratory assay panels for fast multiplex detection",
  heroSubtitle:
    "Run focused respiratory panels for viral and bacterial targets with product details, target lists, and downloadable support documents in one place.",
  ctaTitle: "Need a different respiratory target?",
  ctaBody:
    "Send our team the target list you need and we can help review available products or discuss a custom assay path.",
  whyTitle: "Why labs choose BPX qPLEX respiratory assays",
  categorySlug: "respiratory-assays",
  fallbackCategorySlugs: ["respiratory-tract-infections"],
  heroImage: ASSAY_IMAGE,
  bandImage: LAB_IMAGE,
  highlights: ["Multiplex qPCR", "Pathogen target lists", "Product-ready workflows"],
  features: [
    { title: "Focused panels", description: "Group related targets into practical panels for routine respiratory testing." },
    { title: "Clear documentation", description: "Attach target lists, IFUs, SDS files, and supporting PDFs or spreadsheets from admin." },
    { title: "Direct product path", description: "Open each assay product page for ordering, variants, pricing, and product documents." },
  ],
};

const urinaryConfig: AssayTypeConfig = {
  routeSlug: "urinary",
  apiAssayType: "uti",
  label: "Urinary Assays",
  eyebrow: "BPX qPLEX Urinary",
  heroTitle: "Urinary tract assay panels for targeted pathogen detection",
  heroSubtitle:
    "Browse urinary assay products with target coverage, downloadable target lists, and direct links to product detail pages.",
  ctaTitle: "Need a different urinary target?",
  ctaBody:
    "Share your target requirements and our team can help match an available panel or start a custom assay discussion.",
  whyTitle: "Why labs choose BPX qPLEX urinary assays",
  categorySlug: "uti-assays",
  fallbackCategorySlugs: ["urinary-tract-infections", "urogenital-infections"],
  heroImage: ASSAY_IMAGE,
  bandImage: LAB_IMAGE,
  highlights: ["UTI targets", "Spreadsheet support", "Product landing pages"],
  features: [
    { title: "Targeted coverage", description: "Keep urinary pathogen panels organized by assay type and product." },
    { title: "Reusable data", description: "Targets entered once in admin can be reused across landing pages and product views." },
    { title: "Simple review", description: "Open target documents directly as PDF, Word, or Excel files." },
  ],
};

const urogenitalConfig: AssayTypeConfig = {
  routeSlug: "urogenital",
  apiAssayType: "sti",
  label: "Urogenital Assays",
  eyebrow: "BPX qPLEX Urogenital",
  heroTitle: "Urogenital assay panels with clear product pathways",
  heroSubtitle:
    "Present urogenital assay products, pathogen targets, and downloadable documents in a dedicated landing page.",
  ctaTitle: "Need a different urogenital target?",
  ctaBody:
    "Send the target list or panel idea and our assay team can help review available and custom options.",
  whyTitle: "Why labs choose BPX qPLEX urogenital assays",
  categorySlug: "urogenital-assays",
  fallbackCategorySlugs: ["urogenital-infections"],
  heroImage: ASSAY_IMAGE,
  bandImage: LAB_IMAGE,
  highlights: ["Urogenital panels", "Target downloads", "Direct product view"],
  features: [
    { title: "Panel clarity", description: "Separate urogenital products from other assay categories for easier browsing." },
    { title: "Target visibility", description: "Show pathogens in-page and attach target list documents from the backend." },
    { title: "Fast navigation", description: "Move from the panel page to the product page with one action." },
  ],
};

const giConfig: AssayTypeConfig = {
  routeSlug: "gastrointestinal",
  apiAssayType: "gi",
  label: "Gastrointestinal Assays",
  eyebrow: "BPX qPLEX Gastrointestinal",
  heroTitle: "Gastrointestinal panels for organized pathogen review",
  heroSubtitle:
    "Give GI assay products their own page with product links, pathogen targets, and admin-managed target documents.",
  ctaTitle: "Need a different GI target?",
  ctaBody:
    "If your panel needs a different organism or target list, our team can help review the right next step.",
  whyTitle: "Why labs choose BPX qPLEX gastrointestinal assays",
  categorySlug: "gi-assays",
  fallbackCategorySlugs: ["gastrointestinal-infections"],
  heroImage: ASSAY_IMAGE,
  bandImage: LAB_IMAGE,
  highlights: ["GI panels", "Organized products", "Downloadable targets"],
  features: [
    { title: "Panel grouping", description: "Keep GI products grouped apart from respiratory, urinary, and wound panels." },
    { title: "Document support", description: "Upload target lists as PDF, Word, Excel, or product documentation files." },
    { title: "Product-first flow", description: "Every card leads directly to the product detail page." },
  ],
};

const woundConfig: AssayTypeConfig = {
  routeSlug: "wound",
  apiAssayType: "wound",
  label: "Wound and Nail Assays",
  eyebrow: "BPX qPLEX Wound and Nail",
  heroTitle: "Wound and nail assay panels with target visibility",
  heroSubtitle:
    "Organize wound and nail assay products with pathogen lists, document downloads, and product detail links.",
  ctaTitle: "Need a different wound or nail target?",
  ctaBody:
    "Share your panel requirements and we can help identify available products or discuss custom development.",
  whyTitle: "Why labs choose BPX qPLEX wound and nail assays",
  categorySlug: "wound-panel-assays",
  fallbackCategorySlugs: ["wound-and-nail-infections"],
  heroImage: ASSAY_IMAGE,
  bandImage: LAB_IMAGE,
  highlights: ["Wound panels", "Nail targets", "Admin-managed files"],
  features: [
    { title: "Clinical grouping", description: "Keep wound and nail products together for easier assay review." },
    { title: "Downloadable lists", description: "Attach target lists and supporting files directly to the product." },
    { title: "Reusable setup", description: "Products, targets, and documents feed multiple page sections from one backend source." },
  ],
};

const otherConfig: AssayTypeConfig = {
  routeSlug: "other",
  apiAssayType: "other",
  label: "Other Assays",
  eyebrow: "BPX qPLEX Assays",
  heroTitle: "Specialty assay panels for additional target needs",
  heroSubtitle:
    "Use this page for assay products that do not fit the main respiratory, urinary, GI, urogenital, or wound groups.",
  ctaTitle: "Need a specialty target?",
  ctaBody:
    "Send the product or target list you need and our team can help route it to available products or custom development.",
  whyTitle: "Why labs choose BPX qPLEX specialty assays",
  categorySlug: "other-assays",
  fallbackCategorySlugs: ["other-infection", "othert-infecion", "other-assays"],
  heroImage: ASSAY_IMAGE,
  bandImage: LAB_IMAGE,
  highlights: ["Specialty panels", "Flexible targets", "Product documents"],
  features: [
    { title: "Flexible grouping", description: "Keep specialty assays visible without mixing them into unrelated panels." },
    { title: "Admin-driven", description: "Add products, targets, and target documents from the backend panel." },
    { title: "Ready to extend", description: "Add another dedicated panel page by adding one config entry." },
  ],
};

export const ASSAY_TYPE_CONFIG: Record<string, AssayTypeConfig> = {
  respiratory: respiratoryConfig,
  urinary: urinaryConfig,
  uti: urinaryConfig,
  urogenital: urogenitalConfig,
  sti: urogenitalConfig,
  gastrointestinal: giConfig,
  gi: giConfig,
  wound: woundConfig,
  "wound-and-nail": woundConfig,
  other: otherConfig,
};

export const ASSAY_PANEL_LINKS = [
  respiratoryConfig,
  urinaryConfig,
  urogenitalConfig,
  giConfig,
  woundConfig,
  otherConfig,
];

export function getProductDetailHref(product: Pick<AssayProduct, "slug">) {
  return `/product-detail/${product.slug}`;
}

export function getProductImageSrc(product: AssayProduct) {
  const image = product.primary_image?.image_url || product.primary_image?.image;
  if (!image) return null;
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `${API_BASE_URL.replace(/\/api\/?$/, "")}/media/${image}`;
}

export function getTargetDocuments(product: AssayProduct) {
  return (product.documents || []).filter((document) => {
    const value = `${document.title} ${document.section} ${document.certificate_type}`.toLowerCase();
    return value.includes("target") || value.includes("pathogen") || value.includes("panel");
  });
}

export function getDownloadableDocuments(product: AssayProduct) {
  return (product.documents || []).filter((document) => Boolean(document.file_url));
}

export function getTargetDocumentHref(
  document: Pick<AssayDocument, "id" | "file_url" | "file_extension">,
  source: TargetDocumentSource,
) {
  if (!document.file_url) return "#";
  if (document.file_extension?.toLowerCase() === "xlsx") {
    return `/assays/target-list?source=${source}&id=${document.id}`;
  }
  return document.file_url;
}

export function getAssayHrefForCategory(value?: string | null) {
  if (!value) return null;
  const normalized = value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-");

  if (normalized.includes("respiratory")) return "/assays/respiratory";
  if (normalized.includes("urinary") || normalized.includes("uti")) return "/assays/urinary";
  if (normalized.includes("urogenital") || normalized.includes("leukorrhea") || normalized.includes("sti")) return "/assays/urogenital";
  if (normalized.includes("gastro") || normalized.includes("gi")) return "/assays/gastrointestinal";
  if (normalized.includes("wound") || normalized.includes("nail")) return "/assays/wound";
  if (normalized.includes("other")) return "/assays/other";

  return null;
}

export async function fetchAssayPageData(config: AssayTypeConfig, categorySlug?: string): Promise<AssayPageData> {
  const baseParams = new URLSearchParams({
    assay_type: config.apiAssayType,
    page_size: "50",
  });
  const categorySlugs = new Set<string>();
  if (categorySlug) {
    categorySlugs.add(categorySlug);
  }
  for (const slug of config.fallbackCategorySlugs ?? []) {
    if (slug) categorySlugs.add(slug);
  }
  if (categorySlugs.size) {
    baseParams.set("category_slugs", Array.from(categorySlugs).join(","));
  }

  async function fetchAssayData(params: URLSearchParams) {
    const res = await fetch(`${API_BASE_URL}/v1/products/get-assay-products/?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json: AssayListResponse = await res.json();
    return {
      products: json?.result?.data ?? [],
      panelDocuments: json?.result?.panel_documents ?? [],
    };
  }

  try {
    const primary = await fetchAssayData(baseParams);
    if (primary && (primary.products.length || !categorySlug)) {
      return primary;
    }

    const fallbackParams = new URLSearchParams({
      assay_type: config.apiAssayType,
      page_size: "50",
    });
    return (await fetchAssayData(fallbackParams)) ?? { products: [], panelDocuments: [] };
  } catch {
    return { products: [], panelDocuments: [] };
  }
}

export async function fetchAssayProducts(config: AssayTypeConfig, categorySlug?: string): Promise<AssayProduct[]> {
  const data = await fetchAssayPageData(config, categorySlug);
  return data.products;
}

export async function fetchTargetDocumentPreview(source: TargetDocumentSource, id: string): Promise<TargetDocumentPreview | null> {
  if (!id) return null;

  try {
    const params = new URLSearchParams({ source, id });
    const res = await fetch(`${API_BASE_URL}/v1/products/preview-target-document/?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json: TargetPreviewResponse = await res.json();
    return json.result ?? null;
  } catch {
    return null;
  }
}
