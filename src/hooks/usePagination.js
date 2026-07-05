import { useState, useEffect, useMemo } from "react";

const ITEMS_PER_PAGE = 8;

export function usePagination(items, itemsPerPage = ITEMS_PER_PAGE) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [items.length, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    itemsPerPage,
    totalItems: items.length,
  };
}

export { ITEMS_PER_PAGE };
