import { getAllPages, Page } from "../utils/api";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";

interface Props {
  allPages: Page[];
}

export default function Navigation({ allPages }: Props) {
  const router = useRouter();

  const pages = allPages;

  return (
    <nav className="shadow-md fixed top-0 w-full">
      {router.isFallback ? (
        <p>Loading…</p>
      ) : (
        <div className="container mx-auto pt-4 pb-4 px-6">
          {pages.length > 0 &&
            pages.map((page) => (
              <a className="pr-4" aria-label={page.pageName} href={""}>
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
