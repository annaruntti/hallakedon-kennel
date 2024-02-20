import { GetStaticProps } from "next";
import Link from "next/link";
import ArticleCard from "../../components/ArticleCard";
import Layout from "../../components/Layout";
import { MenuItem, pagesToMenuItems } from "../../components/Navigation";
import {
  BlogPostCollection,
  getBlogPostCollection,
  getPage,
  getPages,
  getPaginatedBlogPostCollection,
  Page,
} from "../../utils/api";
import { formatDate } from "../../utils/date";
import { Config } from "../../utils/config";
import Pagination from "../../components/Pagination";

interface Props {
  preview: boolean;
  blogPage: Page;
  menuItems: MenuItem[];
  blogPostCollection: BlogPostCollection;
  paginatedBlogPostCollection: BlogPostCollection;
  totalPages: number;
  currentPage: number;
}

export default function BlogPage({
  preview,
  blogPage,
  blogPostCollection,
  paginatedBlogPostCollection,
  menuItems,
  totalPages,
  currentPage,
}: Props) {
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
            {paginatedBlogPostCollection.blogPosts.map((post, index) => (
              <li className="border-b-2 border-black mb-2" key={index}>
                <ArticleCard blogPost={post} />
              </li>
            ))}
          </ul>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      }
      asideContent={
        <div>
          <h3 className="pb-4 mb-4 border-b-2 border-black">
            Viimeisimmät artikkelit
          </h3>
          <ul>
            {blogPostCollection.blogPosts.map((post, index) => (
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
  const paginatedBlogPostCollection = await getPaginatedBlogPostCollection(
    1,
    preview
  );
  const pages = await getPages(preview);
  const menuItems = pagesToMenuItems(pages);
  const totalPages = Math.ceil(
    blogPostCollection.metaData.total / Config.pagination.pageSize
  );
  const currentPage = 1;

  return {
    props: {
      preview,
      blogPage,
      blogPostCollection,
      paginatedBlogPostCollection,
      menuItems,
      totalPages,
      currentPage,
    },
  };
};
