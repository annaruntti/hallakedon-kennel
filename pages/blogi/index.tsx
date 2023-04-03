import { GetStaticProps } from "next";
import Link from "next/link";
import ArticleCard from "../../components/ArticleCard";
import Layout from "../../components/Layout";
import { MenuItem, pagesToMenuItems } from "../../components/Navigation";
import {
  BlogPost,
  getBlogPosts,
  getPage,
  getPages,
  Page,
} from "../../utils/api";

interface Props {
  preview: boolean;
  blogPage: Page;
  blogPosts: BlogPost[];
  menuItems: MenuItem[];
}

export default function BlogPage({
  preview,
  blogPage,
  blogPosts,
  menuItems,
}: Props) {
  const heroPost = blogPosts.length > 0 ? blogPosts[0] : undefined;
  const morePosts = blogPosts.slice(1);

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
  const blogPage = await getPage("blogi", preview);
  const blogPosts = await getBlogPosts(4, preview);
  const pages = await getPages(preview);
  const menuItems = pagesToMenuItems(pages);

  return {
    props: { preview, blogPage, blogPosts, menuItems },
  };
};
