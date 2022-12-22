import { useRouter } from "next/router";

interface Props {
  title: string;
  content?: string;
  articleImageUrl: string;
  articleImageName: string;
  articleUrl: string;
}

export default function ArticleCard({
  title,
  content,
  articleImageUrl,
  articleImageName,
  articleUrl,
}: Props) {
  const router = useRouter();

  return (
    <div>
      {router.isFallback ? (
        <p>Loading…</p>
      ) : (
        <>
          <div>
            <a aria-label={title} href={articleUrl}>
              <article className="p-4 mb-4 rounded-md shadow-lg">
                <img
                  src={articleImageUrl}
                  className="w-full mb-2"
                  alt={articleImageName}
                />
                <h2>{title}</h2>
                <div>{content}</div>
              </article>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
