import { getAllPages, Page } from "../utils/api";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";

interface Props {
  allPages: Page[];
}

export default function Navigation({ allPages }: Props) {
  const router = useRouter();

  const pages = allPages;

  const frontPage = allPages.length > 0 ? allPages[1] : undefined;

  console.log(frontPage);

  return (
    <nav className="shadow-md fixed top-0 w-full">
      {router.isFallback ? (
        <p>Loading…</p>
      ) : (
        <div className="container flex mx-auto pt-4 pb-4 px-6">
          <img
            className="nav-logo pr-4"
            src="https://images.ctfassets.net/hef5a6s5axrs/2xHFmDBAHOHhEb09JF9oli/38c52caec01752cf1e6044c3b5cc4241/dog-logo-sircle.png"
          ></img>
          {pages.length > 0 &&
            pages.map((page) => (
              <a
                className="pr-4"
                aria-label={page.pageName}
                href={page?.pageName}
              >
                {page?.pageName}
              </a>
            ))}
        </div>
      )}
    </nav>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({}) => {
  const allPages = await getAllPages();

  return {
    props: { allPages },
  };
};
