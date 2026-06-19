import HeaderSection from "./Header";
import { API_BASE_URL } from "@/config/env";

import {HeaderMenus} from '@/types/header';

const HEADER_FETCH_TIMEOUT_MS = 8000;

const EMPTY_HEADER_MENUS: HeaderMenus = {
  status: "error",
  message: "Menu service unavailable",
  result: {
    data: [],
    search_categories: [],
    top_searchs: [],
  },
};



async function getHeaderMenus(): Promise<HeaderMenus> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HEADER_FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_URL}/v1/headermenu`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });

    if (!res.ok) return EMPTY_HEADER_MENUS;

    return res.json();
  } catch {
    return EMPTY_HEADER_MENUS;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default async function HeaderWrapper() {
  const menuRes = await getHeaderMenus();
  
  return <HeaderSection menus={menuRes?.result?.data ?? []} search_categories={menuRes?.result?.search_categories ?? []} top_searchs={menuRes?.result?.top_searchs ?? []} />; // pass to client component
}
