import { GetStaticProps } from "next";
import Link from "next/link";
import ArticleCard from "../components/ArticleCard";
import Layout from "../components/Layout";
import { MenuItem, pagesToMenuItems } from "../components/Navigation";
import { BlogPost, getBlogPosts, getPage, getPages, Page } from "../utils/api";
import { formatDate } from "../utils/date";

interface Props {
  preview: boolean;
  homePage: Page;
  blogPosts: BlogPost[];
  menuItems: MenuItem[];
}

export default function HomePage({
  preview,
  homePage,
  blogPosts,
  menuItems,
}: Props) {
  const heroPost = blogPosts.length > 0 ? blogPosts[0] : undefined;
  const morePosts = blogPosts.slice(1);

  return (
    <Layout
      preview={preview}
      menuItems={menuItems}
      heroImage={homePage.heroImage}
      headerContent={
        <div className="shadow-md header-title">
          <h1>Hallakedon kennel</h1>
          <h2>Suomenlapinkoirien pienimuotoista kasvatusta Oulussa</h2>
          <p className="hidden md:block">
            Hallakedon kennel on pieni kotikenneli, johon pentuja syntyy
            harvakseltaan ja vain harkituista yhdistelmistä. Tavoitteenamme on
            kasvattaa terveitä, hyväluonteisia ja harrastuksiin sopivia
            aktiivisia suomenlapinkoiria.
          </p>
        </div>
      }
      mainContent={<div>{heroPost && <ArticleCard blogPost={heroPost} />}</div>}
      asideContent={
        <div>
          <h2 className="pb-4 mb-4 border-b-2 border-black">
            Viimeisimmät artikkelit
          </h2>
          <ul>
            {morePosts.length > 0 &&
              morePosts.map((post, index) => (
                <li key={index}>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </li>
              ))}
          </ul>
        </div>
      }
    />
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  preview = false,
}) => {
  const homePage = await getPage("etusivu", preview);
  const blogPosts = await getBlogPosts(4, preview);
  const pages = await getPages(preview);
  const menuItems = pagesToMenuItems(pages);

  return {
    props: { preview, homePage, blogPosts, menuItems },
  };
};
