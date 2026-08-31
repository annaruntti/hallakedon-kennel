import Link from "next/link";
import { useRouter } from "next/router";
import { Page } from "../utils/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

function SubmenuContainer({
  menuItemKey,
  isOpen,
  onClose,
  className,
  children,
}: {
  menuItemKey: string;
  isOpen: boolean;
  onClose: (menuItemKey: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose(menuItemKey);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, menuItemKey, onClose]);

  const handleBlur = () => {
    if (!isOpen) return;

    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (!active || active === document.body) return;
      if (ref.current && !ref.current.contains(active)) {
        onClose(menuItemKey);
      }
    });
  };

  return (
    <li ref={ref} className={className} onBlur={handleBlur}>
      {children}
    </li>
  );
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
  const router = useRouter();
  const [isMenunOpen, setIsMenuOpen] = useState(false);
  const [openMenuItems, setOpenMenuItems] = useState<string[]>([]);

  useEffect(() => {
    setOpenMenuItems([]);
  }, [router.asPath]);

  const toggleMenu = () => setIsMenuOpen(!isMenunOpen);
  const toggleMenuItem = (menuItem: string) =>
    setOpenMenuItems((openMenuItems) =>
      openMenuItems.includes(menuItem)
        ? openMenuItems.filter((item) => menuItem !== item)
        : [...openMenuItems, menuItem]
    );
  const closeMenuItem = useCallback((menuItem: string) => {
    setOpenMenuItems((openMenuItems) =>
      openMenuItems.filter(
        (item) => item !== menuItem && !item.startsWith(`${menuItem}-`)
      )
    );
  }, []);
  const isMenuItemOpen = (menuItem: string) => openMenuItems.includes(menuItem);

  const renderMenuListItems = () =>
    menuItems.length > 0 &&
    menuItems.map((itemLevel1, indexLevel1) => {
      const menuItemKey = `${indexLevel1}`;
      const isOpen = isMenuItemOpen(menuItemKey);

      if (itemLevel1.subItems.length === 0) {
        return (
          <li key={indexLevel1}>
            <Link href={`/${itemLevel1.slug}`} onClick={toggleMenu}>
              {itemLevel1.title}
            </Link>
          </li>
        );
      }

      return (
        <SubmenuContainer
          key={indexLevel1}
          menuItemKey={menuItemKey}
          isOpen={isOpen}
          onClose={closeMenuItem}
        >
          <button
            className="inline-flex"
            onClick={() => toggleMenuItem(menuItemKey)}
          >
            {itemLevel1.title}{" "}
            {isOpen ? (
              <ChevronUpIcon className="h-4 w-4 pt-1 ml-2" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 pt-1 ml-2" />
            )}
          </button>
          <ul className={isOpen ? "submenu-open-level1" : "submenu-close"}>
            {itemLevel1.subItems.map((itemLevel2, indexLevel2) => {
              const nestedMenuItemKey = `${indexLevel1}-${indexLevel2}`;
              const isNestedOpen = isMenuItemOpen(nestedMenuItemKey);

              if (itemLevel2.subItems.length === 0) {
                return (
                  <li className="mb-1 md:mb-2" key={indexLevel2}>
                    <Link href={`/${itemLevel2.slug}`} onClick={toggleMenu}>
                      {itemLevel2.title}
                    </Link>
                  </li>
                );
              }

              return (
                <SubmenuContainer
                  key={indexLevel2}
                  menuItemKey={nestedMenuItemKey}
                  isOpen={isNestedOpen}
                  onClose={closeMenuItem}
                  className="mb-1 md:mb-2"
                >
                  <button
                    className="inline-flex"
                    onClick={() => toggleMenuItem(nestedMenuItemKey)}
                  >
                    {itemLevel2.title}
                    {isNestedOpen ? (
                      <ChevronUpIcon className="h-4 w-4 pt-1 ml-2" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 pt-1 ml-2" />
                    )}
                  </button>
                  <ul
                    className={
                      isNestedOpen ? "submenu-open-level2" : "submenu-close"
                    }
                  >
                    {itemLevel2.subItems.map((itemLevel3, indexLevel3) => (
                      <li key={indexLevel3}>
                        <Link href={`/${itemLevel3.slug}`} onClick={toggleMenu}>
                          {itemLevel3.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </SubmenuContainer>
              );
            })}
          </ul>
        </SubmenuContainer>
      );
    });

  return (
    <nav className="fixed top-0 w-full">
      {/* Mobile menu starts */}
      <div className="block md:hidden container flex mx-auto pt-4 pb-4 px-6">
        <Link href="/">
          <img
            alt="Kennelin logo"
            className="inline w-10 mr-4"
            src="/logo.png"
          />
          <span>Hallakedon kennel</span>
        </Link>
        <button className="inline-flex ml-auto" onClick={toggleMenu}>
          <Bars3Icon className="pt-2 h-8 w-8 mr-2" />
          <span className="pt-2 font-bold">Valikko</span>
        </button>
      </div>
      <div className="block md:hidden">
        <div
          className={
            isMenunOpen ? "mobile-menu-open-level1" : "mobile-menu-close"
          }
        >
          <ul className="mobile-menu-list">
            <li>
              <Link href="/" onClick={toggleMenu}>
                Etusivu
              </Link>
            </li>
            {renderMenuListItems()}
          </ul>
        </div>
      </div>
      {/* Mobile menu ends */}
      {/* Desktop menu starts */}
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
          {renderMenuListItems()}
        </ul>
      </div>
      {/* Desktop menu ends */}
    </nav>
  );
}
