import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchPurchasedItems } from "../../redux/slices/cartSlice";
import { formatPrice } from "../../utils/productHelpers";
import { showErrorToast } from "../../utils/toast";

const ProductsPurchased = () => {
  const dispatch = useAppDispatch();
  const purchasedItems = useAppSelector((state) => state.cart.purchasedItems);
  const purchasedItemsLoading = useAppSelector((state) => state.cart.purchasedItemsLoading);
  const purchasedItemsPagination = useAppSelector((state) => state.cart.purchasedItemsPagination);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const loadPurchasedItems = async () => {
      const result = await dispatch(fetchPurchasedItems({ page, limit: itemsPerPage }));
      if (fetchPurchasedItems.rejected.match(result)) {
        showErrorToast(result.payload || "Failed to load purchased products");
      }
    };

    loadPurchasedItems();
  }, [dispatch, page, itemsPerPage]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
  };

  const handleItemsPerPageChange = (nextLimit) => {
    setItemsPerPage(nextLimit);
    setPage(1);
  };

  if (purchasedItemsLoading) {
    return (
      <div className="dashboard-panel">
        <div className="content-loader">
          <Loader size="md" label="Loading purchased products..." centered />
        </div>
      </div>
    );
  }

  if (purchasedItems.length === 0) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-panel__empty">
          <span className="dashboard-panel__empty-icon" aria-hidden="true">
            <FiPackage />
          </span>
          <h3>No purchases yet</h3>
          <p>
            Products you buy will appear here once your orders are completed.
          </p>
          <Link to="/products" className="dashboard-panel__cta">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel">
      <p className="dashboard-panel__intro">
        {purchasedItemsPagination.totalItems} purchased product
        {purchasedItemsPagination.totalItems === 1 ? "" : "s"} across your orders.
      </p>

      <ul className="dashboard-panel__favourites">
        {purchasedItems.map((item) => (
          <li
            key={`${item.orderId}-${item.productId}-${item.name}`}
            className="dashboard-panel__favourite-item"
          >
            <Link
              to={`/product/${item.productId}`}
              className="dashboard-panel__favourite-link"
            >
              <div className="dashboard-panel__favourite-copy">
                <span className="dashboard-panel__favourite-name">{item.name}</span>
                <span className="dashboard-panel__favourite-meta">
                  {new Date(item.purchasedAt).toLocaleDateString()} · {item.orderStatus}
                </span>
                <span className="dashboard-panel__favourite-price">
                  {item.quantity} x {formatPrice(item.price)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {purchasedItemsPagination.totalItems > 0 && (
        <Pagination
          currentPage={purchasedItemsPagination.currentPage}
          totalPages={purchasedItemsPagination.totalPages}
          totalItems={purchasedItemsPagination.totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          pageSizeOptions={[6, 8, 12, 24]}
          scrollTarget=".dashboard-panel"
        />
      )}
    </div>
  );
};

export default ProductsPurchased;
