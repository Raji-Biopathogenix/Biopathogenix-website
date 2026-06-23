"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import Logo from "./Logo";
import NavbarMenus from "./NavbarMenus";
import HeaderIcons from "./HeaderIcons";
import {useAuth} from "@/context/AuthContext";
// import SearchBar from "./SearchBar";
import {HeaderItem} from "@/types/header"

interface HeaderSectionProps{
  menus : HeaderItem[]
}

function HeaderSection({ menus }: HeaderSectionProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user,reducerState } = useAuth()


  

  return (
    <header className="relative z-50 bg-white shadow-sm">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Logo />
          {/* <NavbarMenus menus={menus} /> */}
          <HeaderIcons
            cartItemsCount={reducerState.cartItemsCount}
          />
        </div>
      </Container>


      {/* MOBILE OVERLAY (placeholder – expandable) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4">
          <button onClick={() => setMobileOpen(false)}>Close</button>
        </div>
      )}
    </header>
  );
};

export default HeaderSection;

