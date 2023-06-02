import Link from "next/link";
import { Page } from "../utils/api";
import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { Bars3Icon } from "@heroicons/react/24/solid";

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
  const [isMobileMenuOpen, setOpenMobileMenu] = useState(false);
  const [isMobileMenuLevel2Open, setOpenMobileMenuLevel2] = useState(false);

  const openMobileMenu = () => setOpenMobileMenu(!isMobileMenuOpen);
  const openMobileMenuLevel2 = () =>
    setOpenMobileMenuLevel2(!isMobileMenuLevel2Open);

  const [isSubMenuOpen, setOpenSubMenu] = useState(false);
  const [isSubMenuLevel2Open, setOpenSubLevel2Menu] = useState(false);

  const openSubMenu = () => setOpenSubMenu(!isSubMenuOpen);
  const openSubMenuLevel2 = () => setOpenSubLevel2Menu(!isSubMenuLevel2Open);

  return (
    <nav className="fixed top-0 w-full">
      <div className="block md:hidden container flex mx-auto pt-4 pb-4 px-6">
        <Link href="/">
          <img
            alt="Kennelin logo"
            className="inline w-10 mr-4"
            src="/logo.png"
          />
        </Link>
        <button className="inline-flex ml-auto" onClick={openMobileMenu}>
          <Bars3Icon className="pt-2 h-8 w-8 mr-2" />
          <span className="pt-2 font-bold">Valikko</span>
        </button>
      </div>
      <div
        className={
          isMobileMenuOpen ? "mobile-menu-open-level1" : "mobile-menu-close"
        }
      >
        <ul className="mobile-menu-list">
          <li>
            <Link href="/">Etusivu</Link>
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
      <div className="hidden md:block container flex mx-auto pt-4 pb-4 px-6">
        <ul className="list-none flex flex-row gap-4 items-center">
          <li>
            <Link href="/">
              <span>
                <img
                  alt="Kennelin logo"
                  className="inline w-10 mr-4"
                  src="/logo.png"
                />
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
                      <li className="mb-1" key={indexLevel2}>
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
