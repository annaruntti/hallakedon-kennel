import Link from "next/link";
import { Page } from "../utils/api";
import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export interface MenuItem {
  slug: string;
  title: string;
  weight: number;
  subItems: MenuItem[];
}

interface Props {
  menuItems: MenuItem[];
  openSubMenu?: Boolean;
}

export function pagesToMenuItems(pages: Page[]): MenuItem[] {
  const getMenuItemsForParent = (parentSlug?: string) =>
    pages
      .filter(
        (page) =>
          page.showInMenu &&
          (parentSlug
            ? page.parentPage?.slug === parentSlug
            : page.parentPage === null)
      )
      .map(pageToMenuItem)
      .sort((a, b) => a.weight - b.weight);

  const pageToMenuItem = (page: Page): MenuItem => ({
    slug: page.slug,
    title: page.menuTitle,
    weight: page.menuWeight,
    subItems: getMenuItemsForParent(page.slug),
  });

  return getMenuItemsForParent();
}

export default function Navigation({ menuItems }: Props) {
  const [isSubMenuOpen, setOpenSubMenu] = useState(false);
  const [isSubMenuLevel2Open, setOpenSubLevel2Menu] = useState(false);

  const openSubMenu = () => setOpenSubMenu(!isSubMenuOpen);
  const openSubMenuLevel2 = () => setOpenSubLevel2Menu(!isSubMenuLevel2Open);

  console.log("openSubMenu", isSubMenuOpen);
  console.log("openSubMenu2", isSubMenuLevel2Open);

  console.log("menuItems", menuItems);

  return (
    <nav className="shadow-md fixed top-0 w-full">
      <div className="container flex mx-auto pt-4 pb-4 px-6">
        <ul className="list-none flex flex-row gap-4 items-center">
          <li>
            <Link href="/">
              <span>
                <img className="inline w-10 mr-4" src="/logo.png" />
                Etusivu
              </span>
            </Link>
          </li>

          {menuItems.length > 0 &&
            menuItems.map((itemLevel1, indexLevel1) => (
              <li key={indexLevel1}>
                {itemLevel1.subItems.length > 0 ? (
                  <button className="inline-flex" onClick={openSubMenu}>
                    {itemLevel1.title}{" "}
                    {isSubMenuOpen ? (
                      <ChevronUpIcon className="h-4 w-4 pt-1 ml-2" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 pt-1 ml-2" />
                    )}
                  </button>
                ) : (
                  <Link href={`/${itemLevel1.slug}`}>{itemLevel1.title}</Link>
                )}

                {itemLevel1.subItems.length > 0 && (
                  <ul
                    className={
                      isSubMenuOpen ? "submenu-open-level1" : "submenu-close"
                    }
                  >
                    {itemLevel1.subItems.map((itemLevel2, indexLevel2) => (
                      <li key={indexLevel2}>
                        {itemLevel2.subItems.length > 0 ? (
                          <button
                            className="inline-flex"
                            onClick={openSubMenuLevel2}
                          >
                            {itemLevel2.title}
                            {isSubMenuLevel2Open ? (
                              <ChevronUpIcon className="h-4 w-4 pt-1 ml-2" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4 pt-1 ml-2" />
                            )}
                          </button>
                        ) : (
                          <Link href={`/${itemLevel2.slug}`}>
                            {itemLevel2.title}
                          </Link>
                        )}
                        {itemLevel2.subItems.length > 0 && (
                          <ul
                            className={
                              isSubMenuLevel2Open
                                ? "submenu-open-level2"
                                : "submenu-close"
                            }
                          >
                            {itemLevel2.subItems.map(
                              (itemLevel3, indexLevel3) => (
                                <li key={indexLevel3}>
                                  <Link href={`/${itemLevel3.slug}`}>
                                    {itemLevel3.title}
                                  </Link>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
}
