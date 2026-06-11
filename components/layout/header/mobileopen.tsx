import { useState } from "react";
import Link from "next/link";
import {HeaderItem} from "@/types/header"



export default function MobileMenu({ menus, open }: { menus: HeaderItem[]; open: boolean }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`}>
      <div className="mobile-menu__inner">
        {menus.map((item) => (
          <div key={item.id} className="mobile-menu__section">
            <button
              className="mobile-menu__category"
              onClick={() =>
                setExpanded(expanded === item.id ? null : item.id)
              }
            >
              {item.category.name}
              {item.category.sub_categories.length > 0 && (
                <svg
                  className={`mobile-menu__chevron ${expanded === item.id ? 'mobile-menu__chevron--rotated' : ''}`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {expanded === item.id && item.category.sub_categories.length > 0 && (
              <div className="mobile-menu__subs">
                {item.category.sub_categories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/${item.category.slug}/${sub.slug}`}
                    className="mobile-menu__sub"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
