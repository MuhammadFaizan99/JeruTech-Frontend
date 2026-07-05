import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import Pagination from "../components/Pagination";
import ScrollReveal from "../components/effects/ScrollReveal";
import { usePagination } from "../hooks/usePagination";
import { productCategories } from "../data/products";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchDiscountedProducts } from "../redux/slices/productSlice";
import "../styles/Products.scss";

const Discount = () => {
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCompany, setActiveCompany] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const discountedProducts = useAppSelector(
    (state) => state.product.discountedProducts,
  );
  const categories = useAppSelector((state) => state.product.categories);
  const companies = useAppSelector((state) => state.product.companies);
  const loading = useAppSelector((state) => state.product.listLoading);
  const error = useAppSelector((state) => state.product.error);
  const pagination = useAppSelector((state) => state.product.discountedPagination);

  useEffect(() => {
    dispatch(
      fetchDiscountedProducts({
        category: activeCategory === "All" ? undefined : activeCategory,
        company: activeCompany === "All" ? undefined : activeCompany,
        search: searchTerm.trim() || undefined,
        page,
        limit,
      })
    );
  }, [dispatch, activeCategory, activeCompany, searchTerm, page, limit]);

  const effectiveCategories = categories.length
    ? [
        "All",
        ...categories.filter(
          (cat) => cat !== "All" && cat !== "Discount" && cat !== "No Discount",
        ),
      ]
    : ["All", ...productCategories.filter((cat) => cat !== "All")];

    const effectiveCompanies = companies.length
      ? ["All", ...companies]
      : [
          "All",
          ...[
            ...new Set(
              discountedProducts
                .map((product) => product.company || product.name?.split(" ")[0] || "JeruTech")
                .filter((company) => typeof company === "string" && company.trim())
                .map((company) => company.trim())
            ),
          ].sort((left, right) => left.localeCompare(right)),
        ];

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPage(1);
  };

  const handleCompanyChange = (company) => {
    setActiveCompany(company);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
  };

  const handleLimitChange = (nextLimit) => {
    setLimit(nextLimit);
    setPage(1);
  };

  return (
    <div className="page-wrapper products-page">
      <section className="products-page__header" id="discount-top">
        <ScrollReveal direction="up">
          <h1>Discounted Products</h1>
          <p>
            Explore our discounted mobiles, laptops, headphones, smart watches,
            chargers, and more.
          </p>
        </ScrollReveal>
      </section>

      <section className="products-page__body discount-page__body">
        <ScrollReveal direction="up">
          <div className={`products-page__toolbar${loading ? " products-page__toolbar--loading" : ""}`}>
            <div className="products-page__toolbar-row">
              <div className="products-page__search">
                <FiSearch className="products-page__search-icon" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search discounted products by name"
                  aria-label="Search discounted products by name"
                className="products-page__search-input"
                disabled={loading}
              />
                {searchTerm && (
                  <button
                    type="button"
                    className="products-page__search-clear"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              <div className="products-page__toolbar-filters">
                <div className="products-page__filter-field">
                  <label className="products-page__filter-label" htmlFor="discount-category-select">
                    Category
                  </label>
                  <select
                    id="discount-category-select"
                    className="products-page__filter-select"
                    value={activeCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    aria-label="Filter discounted products by category"
                    disabled={loading}
                  >
                    {effectiveCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="products-page__filter-field">
                  <label className="products-page__filter-label" htmlFor="discount-company-select">
                    Company
                  </label>
                  <select
                    id="discount-company-select"
                    className="products-page__filter-select"
                    value={activeCompany}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    aria-label="Filter discounted products by company"
                    disabled={loading}
                  >
                    {effectiveCompanies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <p className="products-page__search-hint">
              Showing {pagination.totalItems} product
              {pagination.totalItems === 1 ? "" : "s"}
              {searchTerm ? ` for "${searchTerm.trim()}"` : ""}
            </p>
          </div>
        </ScrollReveal>

        {error && !loading && (
          <div className="products-page__alert products-page__alert--error">
            {error}
          </div>
        )}

        <div
          className="products-page__grid products-page__grid--deals"
          id="discount-list"
        >
          {loading
            ? [...Array(limit)].map((_, index) => (
                <ProductCardSkeleton key={`discount-sk-${index}`} />
              ))
            : discountedProducts.map((product) => (
                <ProductCard key={product.id} product={product} discounted />
              ))}
        </div>

        {!loading && discountedProducts.length === 0 && (
          <p className="products-page__empty">
            {discountedProducts.length === 0
              ? "No discounted products available at the moment."
              : "No discounted products match your search or category filter."}
          </p>
        )}

        {!loading && discountedProducts.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage || 1}
            totalPages={pagination.totalPages || 1}
            onPageChange={handlePageChange}
            scrollTarget="#discount-list"
            itemsPerPage={limit}
            onItemsPerPageChange={handleLimitChange}
            totalItems={pagination.totalItems || 0}
          />
        )}
      </section>
    </div>
  );
};

export default Discount;
