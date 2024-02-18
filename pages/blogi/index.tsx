import { GetStaticProps } from "next";
import Link from "next/link";
import ArticleCard from "../../components/ArticleCard";
import Layout from "../../components/Layout";
import { MenuItem, pagesToMenuItems } from "../../components/Navigation";
import {
  BlogPost,
  BlogPostCollection,
  getBlogPostCollection,
  getPage,
  getPages,
  Page,
} from "../../utils/api";
import { formatDate } from "../../utils/date";

interface Props {
  preview: boolean;
  blogPage: Page;
  menuItems: MenuItem[];
  blogPostCollection: BlogPostCollection;
}

export default function BlogPage({
  preview,
  blogPage,
  blogPostCollection,
  menuItems,
}: Props) {
  const heroPost = blogPostCollection.blogPosts.length > 0 ? blogPostCollection.blogPosts[0] : undefined;
  const morePosts = blogPostCollection.blogPosts.slice(1);

  const blogPostsMetaData = blogPostCollection.metaData;
  console.log("blogPostsMetaData", blogPostsMetaData);

  return (
    <Layout
      preview={preview}
      menuItems={menuItems}
      title={blogPage.title}
      heroImage={blogPage.heroImage}
      headerContent={
        <div className="shadow-md header-title">
          <h1>Hallakedon kennelin blogi</h1>
        </div>
      }
      mainContent={
        <div>
          <h2 className="mb-6">Blogi</h2>
          <ul>
            <li className="border-b-2 border-black mb-4">
              {heroPost && <ArticleCard blogPost={heroPost} />}
            </li>
            {morePosts.length > 0 &&
              morePosts.map((post, index) => (
                <li className="border-b-2 border-black mb-2" key={index}>
                  {/* <Link href={`/blogi/${post.slug}`}>{post.title}</Link> */}
                  <ArticleCard blogPost={post} />
                </li>
              ))}
          </ul>
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
  preview = false,
}) => {
  const blogPage = await getPage("blogi", preview);
  const blogPostCollection = await getBlogPostCollection(4, preview);
  const pages = await getPages(preview);
  const menuItems = pagesToMenuItems(pages);

  return {
    props: { preview, blogPage, blogPostCollection, menuItems },
  };
};
