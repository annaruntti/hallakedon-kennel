import { useRouter } from "next/router";

interface Props {
  title: string;
  content?: string;
  articleImageUrl: string;
  articleImageName: string;
}

export default function ArticleCard({
  title,
  content,
  articleImageUrl,
  articleImageName,
}: Props) {
  const router = useRouter();

  return (
    <div>
      {router.isFallback ? (
        <p>Loading…</p>
      ) : (
        <>
          <section className="container mx-auto">
            <article className="p-4 m-4 rounded-md shadow-lg">
              <img
                src={articleImageUrl}
                className="w-full mb-2"
                alt={articleImageName}
              />
              <h2>{title}</h2>
              <div>{content}</div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
