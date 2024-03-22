import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

interface Props {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: Props) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const nextPage = currentPage + 1;
  const previousPage = currentPage - 1;

  return (
    <div className="flex flex-wrap items-center justify-center">
      {currentPage > 1 && (
        <Link href={`/blogi/sivu/${previousPage}`}>
          <ChevronLeftIcon className="h-4 w-4 m-2" aria-hidden="true" />
        </Link>
      )}
      <ul className="flex flex-wrap items-center justify-center">
        {pageNumbers.map((pageNumber) => (
          <li className="m-2" key={pageNumber}>
            <Link href={`/blogi/sivu/${pageNumber}`}>{pageNumber}</Link>
          </li>
        ))}
      </ul>
      {currentPage < totalPages && (
        <Link href={`/blogi/sivu/${nextPage}`}>
          <ChevronRightIcon className="h-4 w-4 m-2" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
