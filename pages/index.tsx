import { GetStaticProps } from "next";
import Link from "next/link";
import ArticleCard from "../components/ArticleCard";
import Layout from "../components/Layout";
import { MenuItem, pagesToMenuItems } from "../components/Navigation";
import {
  getBlogPostCollection,
  BlogPostCollection,
  getPage,
  getPages,
  Page,
} from "../utils/api";
import { renderRichText } from "../utils/richText";
import { formatDate } from "../utils/date";
import Footer from "../components/Footer";

interface Props {
  preview: boolean;
  homePage: Page;
  blogPostCollection: BlogPostCollection;
  menuItems: MenuItem[];
}

export default function HomePage({
  preview,
  homePage,
  blogPostCollection,
  menuItems,
}: Props) {
  const heroPost =
    blogPostCollection.blogPosts.length > 0
      ? blogPostCollection.blogPosts[0]
      : undefined;
  const morePosts = blogPostCollection.blogPosts.slice(1);

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
      mainContent={
        <div>
          <span className="mb-6">
            <b>Etusivu</b>
          </span>
          <h3 className="pt-4 mb-4">{homePage.title}</h3>
          {homePage.ingress && (
            <div className="ingress">{renderRichText(homePage.ingress)}</div>
          )}
          {homePage.content && (
            <div className="pb-4 mb-4 border-b-2 border-black">
              {renderRichText(homePage.content)}
            </div>
          )}
          <h3 className="mb-6">Käy lukemassa uusin blogipostaus:</h3>
          {heroPost && <ArticleCard blogPost={heroPost} />}
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
                  <span className="post-date">{formatDate(heroPost.date)}</span>
                </Link>
              </li>
            )}
            {morePosts.length > 0 &&
              morePosts.map((post, index) => (
                <li key={index} className="article-link-list">
                  <Link href={`/blogi/${post.slug}`}>
                    <span>{post.title}</span>
                    <br />
                    <span className="post-date">{formatDate(post.date)}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      }
      footerContent={<Footer />}
    />
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  preview = false,
}) => {
  const homePage = await getPage("etusivu", preview);
  const blogPostCollection = await getBlogPostCollection(4, preview);
  const pages = await getPages(preview);
  const menuItems = pagesToMenuItems(pages);

  return {
    props: { preview, homePage, blogPostCollection, menuItems },
  };
};
