import { useRouter } from "next/router";

interface Props {
  pageName: string;
  pageUrl: string;
}

export default function Navigation({ pageName, pageUrl }: Props) {
  const router = useRouter();

  return (
    <nav>
      {router.isFallback ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="container">
            <a aria-label={pageName} href={pageUrl}>
              {pageName}
            </a>
          </div>
        </>
      )}
    </nav>
  );
}
