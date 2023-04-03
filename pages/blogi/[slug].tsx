import { GetStaticPaths, GetStaticProps } from "next";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { MenuItem, pagesToMenuItems } from "../../components/Navigation";
import { BlogPost, getBlogPost, getBlogPosts, getPages } from "../../utils/api";
import { renderRichText } from "../../utils/richText";

interface Props {
  preview: boolean;
  blogPost: BlogPost;
  menuItems: MenuItem[];
}

export default function BlogPostPage({ preview, blogPost, menuItems }: Props) {
  const router = useRouter();

  if (!router.isFallback && !blogPost) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout
      preview={preview}
      menuItems={menuItems}
      title={blogPost.title}
      heroImage={blogPost.heroImage}
      mainContent={
        <div>
          <h1>{blogPost.title}</h1>
          {blogPost.content && (
            <div>{renderRichText(blogPost.content.json)}</div>
          )}
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
  const menuItems = pagesToMenuItems(pages);

  return {
    props: {
      preview,
      blogPost,
      menuItems,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const blogPosts = await getBlogPosts();

  return {
    paths: blogPosts?.map(({ slug }) => `/blogi/${slug}`) ?? [],
    fallback: true,
  };
};
