import { useRouter } from "next/router";
import Head from "next/head";
import ErrorPage from "next/error";
import {
  getAllPostsWithSlug,
  getPostAndMorePosts,
  Post,
} from "../../utils/api";
import { GetStaticPaths, GetStaticProps } from "next";

interface Props {
  post: Post;
  preview: boolean;
}

export default function PostPage({ post, preview }: Props) {
  const router = useRouter();

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <div>
      {router.isFallback ? (
        <p>Loading…</p>
      ) : (
        <>
          <article>
            <Head>
              <title>{post.articleTitle} | Hallakedon kennel</title>
              <meta property="og:image" content={post.articleHeroImage.url} />
            </Head>
            <header className="blog-post-header mb-4">
              <img
                src={post.articleHeroImage.url}
                className="w-full"
                alt={post.articleHeroImage.fileName}
              />
            </header>
            <div className="container mx-auto article-content shadow-lg">
              <h1>{post.articleTitle}</h1>
              <div>{post.articleContent}</div>
            </div>
          </article>
        </>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
  preview = false,
}) => {
  if (typeof params?.slug !== "string") {
    throw new Error("params.slug needs to be a string");
  }

  const data = await getPostAndMorePosts(params.slug, preview);

  return {
    props: {
      preview,
      post: data?.post ?? undefined,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug();

  return {
    paths: allPosts?.map(({ slug }) => `/posts/${slug}`) ?? [],
    fallback: true,
  };
};
