import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiClock, FiPackage, FiShoppingBag, FiTruck, FiXCircle, FiSearch, FiX } from "react-icons/fi";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchOrders } from "../../redux/slices/cartSlice";
import { formatPrice } from "../../utils/productHelpers";
import { showErrorToast } from "../../utils/toast";

const TRACKING_STAGES = [
  { key: "pending", label: "Pending", icon: FiClock },
  { key: "processing", label: "Processing", icon: FiPackage },
  { key: "shipped", label: "Shipped", icon: FiTruck },
  { key: "delivered", label: "Delivered", icon: FiCheckCircle },
];

const getTimelineState = (orderStatus) => {
  const normalizedStatus = typeof orderStatus === "string" ? orderStatus.toLowerCase() : "";

  if (normalizedStatus === "cancelled") {
    return { cancelled: true };
  }

  const currentIndex = TRACKING_STAGES.findIndex((stage) => stage.key === normalizedStatus);

  if (currentIndex === -1) {
    return { activeIndex: 0 };
  }

  return { activeIndex: currentIndex };
};

const Orders = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const orders = useAppSelector((state) => state.cart.orders);
  const ordersLoading = useAppSelector((state) => state.cart.ordersLoading);
  const pagination = useAppSelector((state) => state.cart.ordersPagination);

  useEffect(() => {
    const loadOrders = async () => {
      const result = await dispatch(
        fetchOrders({
          page,
          limit,
          search: searchTerm.trim() || undefined,
          sort: "-createdAt",
          status: statusFilter === "All" ? undefined : statusFilter,
        })
      );
      if (fetchOrders.rejected.match(result)) {
        showErrorToast(result.payload || "Failed to load orders");
      }
    };

    loadOrders();
  }, [dispatch, page, limit, searchTerm, statusFilter]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
  };

  const handleLimitChange = (nextLimit) => {
    setLimit(nextLimit);
    setPage(1);
  };

  if (ordersLoading) {
    return (
      <div className="dashboard-panel">
        <div className="content-loader">
          <Loader size="md" label="Loading your orders..." centered />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-panel__empty">
          <span className="dashboard-panel__empty-icon" aria-hidden="true">
            <FiShoppingBag />
          </span>
          <h3>No orders yet</h3>
          <p>
            Your order history will show up here after you place your first order.
          </p>
          <Link to="/cart" className="dashboard-panel__cta">
            Go to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel">
      <div className="dashboard-panel__toolbar dashboard-panel__toolbar--orders">
        <div className="dashboard-panel__search">
          <FiSearch className="dashboard-panel__search-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search orders"
            aria-label="Search orders"
          />
          {searchTerm && (
            <button type="button" className="dashboard-panel__search-clear" onClick={clearSearch} aria-label="Clear search">
              <FiX />
            </button>
          )}
        </div>

        <div className="dashboard-panel__filter-field">
          <label className="dashboard-panel__filter-label" htmlFor="customer-order-status-filter">Status</label>
          <select
            id="customer-order-status-filter"
            value={statusFilter}
            onChange={(event) => handleStatusChange(event.target.value)}
          >
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <p className="dashboard-panel__intro">
        {pagination.totalItems} order{pagination.totalItems === 1 ? "" : "s"} in your history.
        Pending orders await admin approval before processing begins.
      </p>

      <ul className="dashboard-panel__orders">
        {orders.map((order) => {
          const timelineState = getTimelineState(order.orderStatus);

          return (
            <li key={order._id} className="dashboard-panel__order-item">
              <div className="dashboard-panel__order-header">
                <div>
                  <span className="dashboard-panel__order-id">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className="dashboard-panel__order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className={`dashboard-panel__order-status dashboard-panel__order-status--${order.orderStatus}`}>
                  {order.orderStatus}
                </span>
              </div>

              {timelineState.cancelled ? (
                <div className="dashboard-panel__timeline dashboard-panel__timeline--cancelled">
                  <div className="dashboard-panel__timeline-pill">
                    <FiXCircle />
                    <span>Cancelled</span>
                  </div>
                  <p>This order was cancelled and tracking has stopped.</p>
                </div>
              ) : (
                <div className="dashboard-panel__timeline" aria-label={`Order tracking for ${order.orderStatus}`}>
                  {TRACKING_STAGES.map((stage, index) => {
                    const state = index < timelineState.activeIndex
                      ? "completed"
                      : index === timelineState.activeIndex
                        ? "current"
                        : "upcoming";
                    const Icon = stage.icon;

                    return (
                      <div key={stage.key} className={`dashboard-panel__timeline-step dashboard-panel__timeline-step--${state}`}>
                        <div className="dashboard-panel__timeline-badge">
                          {state === "completed" ? <FiCheckCircle /> : <Icon />}
                        </div>
                        <div className="dashboard-panel__timeline-copy">
                          <span className="dashboard-panel__timeline-label">{stage.label}</span>
                          <small>
                            {state === "completed"
                              ? "Completed"
                              : state === "current"
                                ? "Current"
                                : "Upcoming"}
                          </small>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <ul className="dashboard-panel__order-items">
                {order.orderItems.map((item) => (
                  <li key={`${order._id}-${item.productId}-${item.name}`}>
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} × {formatPrice(item.price)}
                      <span className="dashboard-panel__item-line-total">
                        {" "}={" "}{formatPrice(item.lineTotal ?? item.price * item.quantity)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="dashboard-panel__price-breakdown" aria-label="Price breakdown">
                <div className="dashboard-panel__price-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal ?? 0)}</span>
                </div>
                <div className="dashboard-panel__price-row">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax ?? 0)}</span>
                </div>
                <div className="dashboard-panel__price-row">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(order.deliveryFee ?? 0)}</span>
                </div>
                <div className="dashboard-panel__price-row dashboard-panel__price-row--total">
                  <span>Total</span>
                  <strong>{formatPrice(order.total ?? 0)}</strong>
                </div>
              </div>

              <div className="dashboard-panel__order-footer">
                <span>{order.paymentMethod}</span>
                <strong>{formatPrice(order.total)}</strong>
              </div>
            </li>
          );
        })}
      </ul>

      {!ordersLoading && orders.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage || 1}
          totalPages={pagination.totalPages || 1}
          onPageChange={handlePageChange}
          scrollTarget=".dashboard-panel"
          itemsPerPage={limit}
          onItemsPerPageChange={handleLimitChange}
          totalItems={pagination.totalItems || 0}
        />
      )}
    </div>
  );
};

export default Orders;
