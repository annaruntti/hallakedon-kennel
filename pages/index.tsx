import { getAllPostsForHome, Post } from "../utils/api";
import Head from "next/head";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import ArticleCard from "../components/ArticleCard";

interface Props {
  allPosts: Post[];
  preview: boolean;
}

export default function HomePage({ preview, allPosts }: Props) {
  const router = useRouter();

  const heroPost = allPosts.length > 0 ? allPosts[0] : undefined;
  const morePosts = allPosts.slice(1);

  const articleUrl = `/posts/${heroPost?.slug}`;

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
            <header>
              <div className="container mx-auto pt-6 pb-6 px-6">
                {preview && <p>PREVIEW</p>}
                <h1>Hallakedon kennelin blogi</h1>
              </div>
            </header>
            {heroPost && (
              <ArticleCard
                title={heroPost.articleTitle}
                articleImageUrl={heroPost.articleHeroImage.url}
                articleImageName={heroPost.articleHeroImage.fileName}
                content={heroPost.articleContent}
                articleUrl={articleUrl}
              />
            )}
            <div className="container mx-auto pt-6 pb-6 px-6">
              More posts:
              {morePosts.length > 0 &&
                morePosts.map((post) => (
                  <a aria-label={heroPost?.articleTitle} href={articleUrl}>
                    <article>
                      <h2>{post.articleTitle}</h2>
                    </article>
                  </a>
                ))}
            </div>
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
