import { GetStaticPaths, GetStaticProps } from "next";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { MenuItem, pagesToMenuItems } from "../components/Navigation";
import { getPage, getPages, Page } from "../utils/api";
import { renderRichText } from "../utils/richText";

interface Props {
  preview: boolean;
  page: Page;
  menuItems: MenuItem[];
}

export default function PagePage({ preview, page, menuItems }: Props) {
  const router = useRouter();

  if (!router.isFallback && !page) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout
      preview={preview}
      menuItems={menuItems}
      title={page.title}
      heroImage={page.heroImage}
      mainContent={
        <div>
          <h1>{page.title}</h1>
          {page.ingress && (
            <div className="ingress">{renderRichText(page.ingress.json)}</div>
          )}
          {page.content && <div>{renderRichText(page.content.json)}</div>}
        </div>
      }
    />
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
  preview = false,
}) => {
  if (typeof params?.slug !== "string") {
    throw new Error("params.slug needs to be a string");
  }

  const page = await getPage(params.slug, preview);
  const pages = await getPages(preview);
  const menuItems = pagesToMenuItems(pages);

  return {
    props: {
      preview,
      page,
      menuItems,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getPages();

  const filteredPages = pages.filter(
    (page) => !["etusivu", "blogi"].includes(page.slug)
  );

  return {
    paths: filteredPages?.map(({ slug }) => `/${slug}`) ?? [],
    fallback: true,
  };
};
