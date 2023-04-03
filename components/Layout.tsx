import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { Asset } from "../utils/api";
import Navigation, { MenuItem } from "./Navigation";

interface Props {
  preview: boolean;
  menuItems: MenuItem[];
  title?: string;
  heroImage?: Asset | null;
  headerContent?: ReactNode;
  mainContent?: ReactNode;
  asideContent?: ReactNode;
  footerContent?: ReactNode;
}

export default function Layout({
  preview,
  menuItems,
  title,
  heroImage,
  headerContent,
  mainContent,
  asideContent,
  footerContent,
}: Props) {
  const router = useRouter();

  const headerStyle = {
    backgroundImage: heroImage ? `url(${heroImage.url})` : undefined,
  };

  const headTitle = title
    ? `${title} | Hallakedon kennel`
    : "Hallakedon kennel";

  if (router.isFallback) {
    return <p>Ladataan…</p>;
  }

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        {heroImage && <meta property="og:image" content={heroImage.url} />}
      </Head>
      <header className="relative" style={headerStyle}>
        <Navigation menuItems={menuItems} />
        {preview && <p>PREVIEW</p>}
        {headerContent && (
          <div className="header-content mx-auto pt-8 pb-6">
            {headerContent}
          </div>
        )}
      </header>
      <div className="container mx-auto pt-8 pb-6 px-6 grid grid-cols-1 md:grid-cols-10 gap-8">
        {mainContent && (
          <main className="col-span-10 md:col-span-7">{mainContent}</main>
        )}
        {asideContent && (
          <aside className="col-span-10 md:col-span-3">{asideContent}</aside>
        )}
      </div>
      {footerContent && <footer>{footerContent}</footer>}
    </>
  );
}
