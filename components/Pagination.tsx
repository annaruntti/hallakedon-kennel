import Link from "next/link";

interface Props {
  totalPages: number;
}

export default function Pagination({ totalPages }: Props) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <ul className="flex flex-wrap items-center justify-center">
        {pageNumbers.map((pageNumber) => (
          <li className="m-2" key={pageNumber}>
            <Link href={`/blogi/sivu/${pageNumber}`}>{pageNumber}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
