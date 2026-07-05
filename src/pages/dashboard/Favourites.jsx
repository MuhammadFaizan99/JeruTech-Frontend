import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiTrash2 } from "react-icons/fi";
import DashboardPanelSkeleton from "../../components/DashboardPanelSkeleton";
import Pagination from "../../components/Pagination";
import api from "../../api";
import { formatPrice } from "../../utils/productHelpers";
import { getFavourites } from "../../utils/favourites";
import { showErrorToast } from "../../utils/toast";

const mapFavouriteProduct = (product) => ({
  id: product._id || product.id,
  name: product.name,
  image: product.images?.[0] || product.image,
  company: product.company,
  category: product.category,
  price: product.price,
});

const Favourites = () => {
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const loadFavourites = async () => {
      setLoading(true);

      try {
        const legacyFavourites = getFavourites();

        if (legacyFavourites.length > 0) {
          await Promise.all(
            legacyFavourites.map((item) => api.post(`/favourites/${item.id}`)),
          );
        }

        const response = await api.get("/favourites", {
          params: { page, limit: itemsPerPage },
        });
        const payload = response.data.data || {};
        setFavourites((payload.data ?? []).map(mapFavouriteProduct));
        setPagination({
          currentPage: payload.pagination?.currentPage || payload.currentPage || 1,
          totalPages: payload.pagination?.totalPages || payload.totalPages || 1,
          totalItems: payload.pagination?.totalItems || payload.totalItems || 0,
          limit: payload.pagination?.limit || payload.limit || itemsPerPage,
          hasNextPage: payload.pagination?.hasNextPage ?? payload.hasNextPage ?? false,
          hasPrevPage: payload.pagination?.hasPrevPage ?? payload.hasPrevPage ?? false,
        });
      } catch (error) {
        showErrorToast(error.response?.data?.message || "Failed to load favourites");
      } finally {
        setLoading(false);
      }
    };

    loadFavourites();
  }, [page, itemsPerPage]);

  const handleRemove = async (productId) => {
    setRemovingId(productId);

    try {
      await api.delete(`/favourites/${productId}`);
      setPage(1);
      const response = await api.get("/favourites", {
        params: { page: 1, limit: itemsPerPage },
      });
      const payload = response.data.data || {};
      setFavourites((payload.data ?? []).map(mapFavouriteProduct));
      setPagination({
        currentPage: payload.pagination?.currentPage || payload.currentPage || 1,
        totalPages: payload.pagination?.totalPages || payload.totalPages || 1,
        totalItems: payload.pagination?.totalItems || payload.totalItems || 0,
        limit: payload.pagination?.limit || payload.limit || itemsPerPage,
        hasNextPage: payload.pagination?.hasNextPage ?? payload.hasNextPage ?? false,
        hasPrevPage: payload.pagination?.hasPrevPage ?? payload.hasPrevPage ?? false,
      });
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to remove favourite");
    } finally {
      setRemovingId(null);
    }
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
  };

  const handleItemsPerPageChange = (nextLimit) => {
    setItemsPerPage(nextLimit);
    setPage(1);
  };

  if (loading) {
    return <DashboardPanelSkeleton variant="list" />;
  }

  if (favourites.length === 0) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-panel__empty">
          <span className="dashboard-panel__empty-icon" aria-hidden="true">
            <FiHeart />
          </span>
          <h3>No favourites yet</h3>
          <p>
            Tap the heart icon on any product to save it to your favourites list.
          </p>
          <Link to="/products" className="dashboard-panel__cta">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel">
      <p className="dashboard-panel__intro">
        {pagination.totalItems} saved product{pagination.totalItems === 1 ? "" : "s"}.
      </p>

      <ul className="dashboard-panel__favourites">
        {favourites.map((product) => (
          <li key={product.id} className="dashboard-panel__favourite-item">
            <Link
              to={`/product/${product.id}`}
              className="dashboard-panel__favourite-link"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="dashboard-panel__favourite-img"
                />
              ) : (
                <span className="dashboard-panel__favourite-placeholder" />
              )}
              <div className="dashboard-panel__favourite-copy">
                <span className="dashboard-panel__favourite-name">
                  {product.name}
                </span>
                <span className="dashboard-panel__favourite-meta">
                  {product.company} · {product.category}
                </span>
                <span className="dashboard-panel__favourite-price">
                  {formatPrice(product.price)}
                </span>
              </div>
            </Link>

            <button
              type="button"
              className="dashboard-panel__favourite-remove"
              onClick={() => handleRemove(product.id)}
              disabled={removingId === product.id}
              aria-label={`Remove ${product.name} from favourites`}
            >
              <FiTrash2 />
            </button>
          </li>
        ))}
      </ul>

      {pagination.totalItems > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
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

export default Favourites;
