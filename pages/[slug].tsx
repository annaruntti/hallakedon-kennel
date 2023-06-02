import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { MenuItem, pagesToMenuItems } from "../components/Navigation";
import { getPage, getPages, Page, BlogPost, getBlogPosts } from "../utils/api";
import { renderRichText } from "../utils/richText";
import { formatDate } from "../utils/date";

interface Props {
  preview: boolean;
  page: Page;
  blogPosts: BlogPost[];
  menuItems: MenuItem[];
}

export default function PagePage({
  preview,
  page,
  menuItems,
  blogPosts,
}: Props) {
  const router = useRouter();

  const heroPost = blogPosts.length > 0 ? blogPosts[0] : undefined;
  const morePosts = blogPosts.slice(1);

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
      asideContent={
        <div>
          <h3 className="pb-4 mb-4 border-b-2 border-black">
            Viimeisimmät artikkelit
          </h3>
          <ul>
            {heroPost && (
              <li className="article-link-list">
                <Link href={`/blogi/${heroPost.slug}`}>
                  <span>{heroPost.title}</span>
                  <br />
                  <span>{formatDate(heroPost.date)}</span>
                </Link>
              </li>
            )}
            {morePosts.length > 0 &&
              morePosts.map((post, index) => (
                <li key={index} className="article-link-list">
                  <Link href={`/blogi/${post.slug}`}>
                    <span>{post.title}</span>
                    <br />
                    <span>{formatDate(post.date)}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      }
      footerContent={
        <div>
          <b>
            <span className="mb-4">Hallakedon kennel</span>
          </b>
          <br />
          <span>Anna Tiala</span>
          <br />
          <span>Aarnonkuja 25, 90940 Jääli</span>
          <br />
          <span>anruntti@gmail.com</span>
          <br />
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
  const blogPosts = await getBlogPosts(4, preview);

  return {
    props: {
      preview,
      page,
      menuItems,
      blogPosts,
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
