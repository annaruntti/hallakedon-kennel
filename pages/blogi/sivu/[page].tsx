import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import ArticleCard from "../../../components/ArticleCard";
import Layout from "../../../components/Layout";
import { MenuItem, pagesToMenuItems } from "../../../components/Navigation";
import {
  BlogPostCollection,
  getBlogPostCollection,
  getPage,
  getPages,
  getPaginatedBlogPostCollection,
  Page,
} from "../../../utils/api";
import { formatDate } from "../../../utils/date";
import { Config } from "../../../utils/config";

interface Props {
  page: number;
  preview: boolean;
  blogPage: Page;
  menuItems: MenuItem[];
  blogPostCollection: BlogPostCollection;
  paginatedBlogPostCollection: BlogPostCollection;
  totalPages: number;
}

export default function BlogPage({
  page,
  preview,
  blogPage,
  blogPostCollection,
  paginatedBlogPostCollection,
  menuItems,
  totalPages,
}: Props) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
          <h2 className="mb-6">Blogi - sivu {page}</h2>
          <ul>
            {paginatedBlogPostCollection.blogPosts.map((post, index) => (
              <li className="border-b-2 border-black mb-2" key={index}>
                {/* <Link href={`/blogi/${post.slug}`}>{post.title}</Link> */}
                <ArticleCard blogPost={post} />
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap items-center justify-center">
            {pageNumbers.map((pageNumber) => (
              <li className="m-2" key={pageNumber}>
                <Link href={`/blogi/sivu/${pageNumber}`}>{pageNumber}</Link>
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
  params,
  preview = false,
}) => {
  const page = typeof params?.page === "string" ? parseInt(params?.page) : 1;
  const blogPage = await getPage("blogi", preview);
  const blogPostCollection = await getBlogPostCollection(4, preview);
  const paginatedBlogPostCollection = await getPaginatedBlogPostCollection(
    page,
    preview
  );
  const pages = await getPages(preview);
  const menuItems = pagesToMenuItems(pages);
  const totalPages = Math.ceil(
    blogPostCollection.metaData.total / Config.pagination.pageSize
  );

  return {
    props: {
      page,
      preview,
      blogPage,
      blogPostCollection,
      paginatedBlogPostCollection,
      menuItems,
      totalPages,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const blogPostCollection = await getBlogPostCollection(1);
  const totalPages = Math.ceil(
    blogPostCollection.metaData.total / Config.pagination.pageSize
  );

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return {
    paths: pageNumbers?.map((pageNumber) => `/blogi/sivu/${pageNumber}`) ?? [],
    fallback: true,
  };
};
