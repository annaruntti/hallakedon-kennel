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
        <article className="pb-4 mb-4 border-b-2 border-black">
          {blogPost.heroImage && (
            <img
              src={blogPost.heroImage.url}
              className="w-full mb-2"
              alt={blogPost.heroImage.fileName}
            />
          )}
          <span>{formatDate(blogPost.date)}</span>
          <h2>{blogPost.title}</h2>
          {blogPost.excerpt && (
            <div>{renderRichText(blogPost.excerpt.json)}</div>
          )}
        </article>
      </Link>
    </div>
  );
}
