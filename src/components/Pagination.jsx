import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/Pagination.scss";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  scrollTarget,
  itemsPerPage,
  onItemsPerPageChange,
  pageSizeOptions = [6, 8, 12, 24],
  totalItems,
}) => {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safeCurrentPage = Math.min(
    Math.max(1, Number(currentPage) || 1),
    safeTotalPages,
  );

  if (safeTotalPages <= 1 && !onItemsPerPageChange) return null;

  const handlePage = (page) => {
    const nextPage = Math.min(Math.max(1, page), safeTotalPages);
    onPageChange?.(nextPage);
    if (scrollTarget) {
      const el = document.querySelector(scrollTarget);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) pages.push(i);
      return pages;
    }

    let start = Math.max(1, safeCurrentPage - 2);
    let end = Math.min(safeTotalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <nav className="jerutech-pagination" aria-label="Pagination">
      <button
        type="button"
        className="jerutech-pagination__btn jerutech-pagination__btn--text"
        onClick={() => handlePage(safeCurrentPage - 1)}
        disabled={safeCurrentPage === 1}
        aria-label="Previous page"
      >
        <FiChevronLeft />
        <span className="label">Previous</span>
      </button>

      <div className="jerutech-pagination__pages">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            type="button"
            className={`jerutech-pagination__btn${
              safeCurrentPage === page ? " jerutech-pagination__btn--active" : ""
            }`}
            onClick={() => handlePage(page)}
            aria-label={`Page ${page}`}
            aria-current={safeCurrentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="jerutech-pagination__btn jerutech-pagination__btn--text"
        onClick={() => handlePage(safeCurrentPage + 1)}
        disabled={safeCurrentPage === safeTotalPages}
        aria-label="Next page"
      >
        <span className="label">Next</span>
        <FiChevronRight />
      </button>

      {typeof totalItems === "number" && (
        <p className="jerutech-pagination__info">
          Page {safeCurrentPage} of {safeTotalPages} · {totalItems} item{totalItems === 1 ? "" : "s"}
        </p>
      )}

      {onItemsPerPageChange && (
        <div className="jerutech-pagination__size">
          <label htmlFor="pagination-items-per-page">Show</label>
          <select
            id="pagination-items-per-page"
            value={pageSizeOptions.includes(itemsPerPage) ? itemsPerPage : pageSizeOptions[0]}
            onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
            aria-label="Items per page"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
};

export default Pagination;
