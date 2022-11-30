import { getAllPostsForHome, Post } from "../utils/api";
import Head from "next/head";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";

interface Props {
  allPosts: Post[];
  preview: boolean;
}

export default function HomePage({ preview, allPosts }: Props) {
  const router = useRouter();

  const heroPost = allPosts.length > 0 ? allPosts[0] : undefined;
  const morePosts = allPosts.slice(1);

  return (
    <div>
      {router.isFallback ? (
        <p>Loading…</p>
      ) : (
        <>
          <section>
            <Head>
              <title>Hallakedon kennel</title>
              {heroPost && (
                <meta
                  property="og:image"
                  content={heroPost.articleHeroImage.url}
                />
              )}
            </Head>
            {preview && <p>PREVIEW</p>}
            <h1>Hallakedon kennel</h1>
            {heroPost && (
              <article>
                <h2>{heroPost.articleTitle}</h2>
              </article>
            )}
            More posts:
            {morePosts.length > 0 &&
              morePosts.map((post) => (
                <article>
                  <h2>{post.articleTitle}</h2>
                </article>
              ))}
          </section>
        </>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  preview = false,
}) => {
  const allPosts = (await getAllPostsForHome(preview)) ?? [];

  return {
    props: { preview, allPosts },
  };
};
