import { getAllPostsForHome, Post, getAllPages, Page } from "../utils/api";
import Head from "next/head";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import ArticleCard from "../components/ArticleCard";
import Navigation from "../components/Navigation";

interface Props {
  allPosts: Post[];
  preview: boolean;
  allPages: Page[];
}

export default function HomePage({ preview, allPosts, allPages }: Props) {
  const router = useRouter();

  const heroPost = allPosts.length > 0 ? allPosts[0] : undefined;
  const morePosts = allPosts.slice(1);

  const pages = allPages;

  const articleUrl = `/posts/${heroPost?.slug}`;

  const headerStyle = {
    backgroundImage: "url(" + pages[0].heroImage.url + ")",
  };

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
            <header className="relative" style={headerStyle}>
              <Navigation allPages={pages} />
              <div className="header-content container mx-auto pt-8 pb-6 px-6">
                {preview && <p>PREVIEW</p>}
                <div className="shadow-md header-title">
                  <h1>Hallakedon kennel</h1>
                  <h2>Suomenlapinkoirien pienimuotoista kasvatusta Oulussa</h2>
                </div>
              </div>
            </header>
            <div className="container mx-auto pt-8 pb-6 px-6 grid grid-cols-1 md:grid-cols-10 gap-8">
              <main className="col-span-10 md:col-span-7">
                {heroPost && (
                  <ArticleCard
                    title={heroPost.articleTitle}
                    articleImageUrl={heroPost.articleHeroImage.url}
                    articleImageName={heroPost.articleHeroImage.fileName}
                    content={heroPost.articleContent}
                    articleUrl={articleUrl}
                  />
                )}
                More posts:
                {morePosts.length > 0 &&
                  morePosts.map((post) => (
                    <a
                      aria-label={post.articleTitle}
                      href={`/posts/${post.slug}`}
                    >
                      <article>
                        <h2>{post.articleTitle}</h2>
                      </article>
                    </a>
                  ))}
              </main>
              <div className="col-span-10 md:col-span-3">
                <h2>Viimeisimmät artikkelit</h2>
                {morePosts.length > 0 &&
                  morePosts.map((post) => (
                    <a
                      aria-label={post.articleTitle}
                      href={`/posts/${post.slug}`}
                    >
                      <h3>{post.articleTitle}</h3>
                    </a>
                  ))}
              </div>
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
  const allPages = await getAllPages();

  return {
    props: { preview, allPosts, allPages },
  };
};
