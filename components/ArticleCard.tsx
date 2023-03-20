import { useRouter } from "next/router";

interface Props {
  title: string;
  content?: string;
  articleImageUrl: string;
  articleImageName: string;
  articleUrl: string;
  heroPostDateLocal: string;
}

export default function ArticleCard({
  title,
  content,
  articleImageUrl,
  articleImageName,
  articleUrl,
  heroPostDateLocal,
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
              <article className="pb-4 mb-4 border-b-2 border-black">
                <img
                  src={articleImageUrl}
                  className="w-full mb-2"
                  alt={articleImageName}
                />
                <span>{heroPostDateLocal}</span>
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
