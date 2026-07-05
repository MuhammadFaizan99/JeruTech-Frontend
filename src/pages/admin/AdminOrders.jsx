import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import Loader from "../../components/Loader";
import LoadingButton from "../../components/LoadingButton";
import Pagination from "../../components/Pagination";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchAdminOrders,
  approveOrder,
  updateOrderStatus,
} from "../../redux/slices/orderSlice";
import { formatPrice } from "../../utils/productHelpers";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../utils/toast";

const STATUS_OPTIONS = ["processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.adminOrders);
  const loading = useAppSelector((state) => state.orders.loading);
  const updating = useAppSelector((state) => state.orders.updating);
  const pagination = useAppSelector((state) => state.orders.pagination);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(
      fetchAdminOrders({
        page,
        limit,
        search: searchTerm.trim() || undefined,
        sort: "-createdAt",
        status: statusFilter === "All" ? undefined : statusFilter,
      })
    );
  }, [dispatch, page, limit, searchTerm, statusFilter]);

  const handleApprove = async (orderId) => {
    const result = await dispatch(approveOrder(orderId));

    if (approveOrder.fulfilled.match(result)) {
      showSuccessToast("Order approved and moved to processing");
      return;
    }

    showErrorToast(result.payload || "Failed to approve order");
  };

  const handleStatusChange = async (orderId, orderStatus) => {
    if (!orderStatus) {
      showWarningToast("Select a status to update");
      return;
    }

    const result = await dispatch(updateOrderStatus({ orderId, orderStatus }));

    if (updateOrderStatus.fulfilled.match(result)) {
      showSuccessToast("Order status updated");
      return;
    }

    showErrorToast(result.payload || "Failed to update order status");
  };

  if (loading) {
    return (
      <div className="dashboard-panel">
        <div className="content-loader">
          <Loader size="md" label="Loading orders..." centered />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-panel__empty">
          <h3>No orders yet</h3>
          <p>Customer orders will appear here once placed.</p>
        </div>
      </div>
    );
  }

  const pendingCount = orders.filter((order) => order.orderStatus === "pending").length;

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleStatusFilterChange = (value) => {
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

  return (
    <div className="dashboard-panel admin-orders">
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
          <label className="dashboard-panel__filter-label" htmlFor="admin-order-status-filter">Status</label>
          <select
            id="admin-order-status-filter"
            value={statusFilter}
            onChange={(event) => handleStatusFilterChange(event.target.value)}
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
        {pagination.totalItems} total order{pagination.totalItems === 1 ? "" : "s"}
        {pendingCount > 0 ? ` · ${pendingCount} awaiting approval` : ""}
      </p>

      <ul className="dashboard-panel__orders">
        {orders.map((order) => (
          <li key={order._id} className="dashboard-panel__order-item admin-orders__item">
            <div className="dashboard-panel__order-header">
              <div>
                <span className="dashboard-panel__order-id">
                  Order #{order._id.slice(-6).toUpperCase()}
                </span>
                <span className="dashboard-panel__order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
                <span className="admin-orders__customer">
                  {order.customerDetails?.customerName} · {order.customerDetails?.email}
                </span>
              </div>
              <span
                className={`dashboard-panel__order-status dashboard-panel__order-status--${order.orderStatus}`}
              >
                {order.orderStatus}
              </span>
            </div>

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

            <div className="admin-orders__actions">
              {order.orderStatus === "pending" && (
                <LoadingButton
                  type="button"
                  className="admin-orders__approve-btn"
                  loading={updating}
                  onClick={() => handleApprove(order._id)}
                >
                  Approve Order
                </LoadingButton>
              )}

              {order.orderStatus !== "pending" && order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && (
                <div className="admin-orders__status-control">
                  <select
                    defaultValue=""
                    onChange={(event) => {
                      const nextStatus = event.target.value;
                      if (nextStatus) {
                        handleStatusChange(order._id, nextStatus);
                        event.target.value = "";
                      }
                    }}
                    disabled={updating}
                    aria-label={`Update status for order ${order._id}`}
                  >
                    <option value="">Update status...</option>
                    {STATUS_OPTIONS.filter((status) => status !== order.orderStatus).map(
                      (status) => (
                        <option key={status} value={status}>
                          Mark as {status}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {order.orderStatus === "pending" && (
                <button
                  type="button"
                  className="admin-orders__cancel-btn"
                  disabled={updating}
                  onClick={() => handleStatusChange(order._id, "cancelled")}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {!loading && orders.length > 0 && (
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

export default AdminOrders;
