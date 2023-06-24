import Link from "next/link";
import { BlogPost } from "../utils/api";
import { formatDate } from "../utils/date";
import { renderRichText } from "../utils/richText";

interface Props {
  blogPost: BlogPost;
}

export default function ArticleCard({ blogPost }: Props) {
  const postUrl = `/blogi/${blogPost.slug}`;

  return (
    <div>
      <Link href={postUrl} aria-label={blogPost.title}>
        <article className="pb-4">
          <div className="flex-none lg:flex flex-row gap-4">
            <div className="basis-1/4">
              {blogPost.heroImage && (
                <img
                  src={blogPost.heroImage.url}
                  className="w-full mb-2 article-card-image"
                  alt={blogPost.heroImage.fileName}
                />
              )}
            </div>
            <div className="basis-3/4">
              <span>{formatDate(blogPost.date)}</span>
              <h2>{blogPost.title}</h2>
              {blogPost.excerpt && (
                <div className="mb-2">{renderRichText(blogPost.excerpt)}</div>
              )}
              <span>Lue koko artikkeli</span>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}
