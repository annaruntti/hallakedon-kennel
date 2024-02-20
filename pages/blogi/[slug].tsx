import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { MenuItem, pagesToMenuItems } from "../../components/Navigation";
import {
  BlogPost,
  getBlogPost,
  getBlogPostCollection,
  getBlogPostSlugs,
  getPages,
  BlogPostCollection,
} from "../../utils/api";
import { renderRichText } from "../../utils/richText";
import { formatDate } from "../../utils/date";

interface Props {
  preview: boolean;
  blogPost: BlogPost;
  blogPostCollection: BlogPostCollection;
  menuItems: MenuItem[];
}

export default function BlogPostPage({
  preview,
  blogPost,
  menuItems,
  blogPostCollection,
}: Props) {
  const router = useRouter();

  // TODO: Fix the problem and remove this workaround
  if (
    blogPost === undefined ||
    menuItems === undefined ||
    blogPostCollection === undefined
  ) {
    return null;
  }

  const heroPost =
    blogPostCollection.blogPosts.length > 0
      ? blogPostCollection.blogPosts[0]
      : undefined;
  const morePosts =
    blogPostCollection.blogPosts.length > 1
      ? blogPostCollection.blogPosts.slice(1)
      : undefined;

  if (!router.isFallback && !blogPost) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout
      preview={preview}
      menuItems={menuItems}
      title={blogPost.title}
      heroImage={blogPost.heroImage}
      headerContent={
        <div className="shadow-md header-title">
          <h1>{blogPost.title}</h1>
        </div>
      }
      mainContent={
        <div>
          <h2>{blogPost.title}</h2>
          {blogPost.excerpt && (
            <div className="ingress">{renderRichText(blogPost.excerpt)}</div>
          )}
          {blogPost.content && <div>{renderRichText(blogPost.content)}</div>}
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
            {morePosts &&
              morePosts.length > 0 &&
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
  params,
  preview = false,
}) => {
  if (typeof params?.slug !== "string") {
    throw new Error("params.slug needs to be a string");
  }

  const blogPost = await getBlogPost(params.slug, preview);
  const pages = await getPages(preview);
  const blogPostCollection = await getBlogPostCollection(4, preview);
  const menuItems = pagesToMenuItems(pages);

  return {
    props: {
      preview,
      blogPost,
      menuItems,
      blogPostCollection,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const blogPosts = await getBlogPostSlugs();

  return {
    paths: blogPosts?.map(({ slug }) => `/blogi/${slug}`) ?? [],
    fallback: true,
  };
};
