import "./Pagination.css";

type PaginationProps = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
};

export default function Pagination({ currentPage, setCurrentPage, totalPages }: PaginationProps) {
  const pages = getPages(currentPage, totalPages);

  return (
    <nav className="pagination">
      <button
        className="pagination__button pagination__button--arrow"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        ‹
      </button>

      {pages.map(page =>
        typeof page === "string" ? (
          <span key={page} className="pagination__ellipsis">…</span>
        ) : (
          <button
            key={page}
            className={getPageButtonClass(page, currentPage)}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination__button pagination__button--arrow"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        ›
      </button>
    </nav>
  );
}

type PageItem = number | "start-ellipsis" | "end-ellipsis";

function getPages(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "start-ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "start-ellipsis", currentPage - 1, currentPage, currentPage + 1, "end-ellipsis", totalPages];
}

function getPageButtonClass(page: number, currentPage: number): string {
  const base = "pagination__button";
  const modifier = "pagination__button--page";
  const selected = page === currentPage && "pagination__button--selected";

  return [base, modifier, selected].filter(Boolean).join(" ");
}
