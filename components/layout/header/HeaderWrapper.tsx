import HeaderSection from "./Header";
import { API_BASE_URL } from "@/config/env";

import {HeaderMenus} from '@/types/header';

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
  try {
    const res = await fetch(`${API_BASE_URL}/v1/headermenu`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return EMPTY_HEADER_MENUS;

    return res.json();
  } catch {
    return EMPTY_HEADER_MENUS;
  }
}

export default async function HeaderWrapper() {
  const menuRes = await getHeaderMenus();
  
  return <HeaderSection menus={menuRes?.result?.data ?? []} search_categories={menuRes?.result?.search_categories ?? []} top_searchs={menuRes?.result?.top_searchs ?? []} />; // pass to client component
}
