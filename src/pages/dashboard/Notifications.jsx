import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { FiBell, FiInbox, FiCheckCircle, FiTrash2, FiRefreshCw } from "react-icons/fi";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import api from "../../api";
import { setUnreadCount } from "../../redux/slices/notificationSlice";
import { showErrorToast } from "../../utils/toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 8,
  });
  const [unreadCount, setUnreadCountState] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const loadNotifications = async (page = 1, limit = pagination.limit) => {
    setLoading(true);

    try {
      const res = await api.get("/notifications", {
        params: {
          page,
          limit,
        },
      });

      const data = res.data?.data || {};
      setNotifications(data.notifications || []);
      setPagination({
        currentPage: data.pagination?.currentPage || page,
        totalPages: data.pagination?.totalPages || 1,
        totalItems: data.pagination?.totalItems || 0,
        limit: data.pagination?.limit || limit,
      });
      setUnreadCountState(data.unreadCount || 0);
      dispatch(setUnreadCount(data.unreadCount || 0));
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(pagination.currentPage, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (nextPage) => {
    loadNotifications(nextPage, pagination.limit);
  };

  const handleLimitChange = (nextLimit) => {
    loadNotifications(1, nextLimit);
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter((item) => !item.isRead).map((item) => item._id);
    if (!unreadIds.length) return;

    try {
      await api.put("/notifications/read", { notificationIds: unreadIds });
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCountState(0);
      dispatch(setUnreadCount(0));
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to mark notifications read");
    }
  };

  const clearAll = async () => {
    try {
      await api.delete("/notifications");
      setNotifications([]);
      setPagination((current) => ({ ...current, totalItems: 0, totalPages: 1, currentPage: 1 }));
      setUnreadCountState(0);
      dispatch(setUnreadCount(0));
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to clear notifications");
    }
  };

  return (
    <div className="dashboard-panel">
      <div className="dashboard-panel__toolbar dashboard-panel__toolbar--orders">
        <div>
          <p className="dashboard-panel__intro">
            You have {pagination.totalItems} notification{pagination.totalItems === 1 ? "" : "s"}, {unreadCount} unread.
          </p>
        </div>

        <div className="dashboard-panel__actions">
          <button
            type="button"
            className="dashboard-panel__btn dashboard-panel__btn--ghost"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <FiCheckCircle /> Mark all read
          </button>
          <button
            type="button"
            className="dashboard-panel__btn dashboard-panel__btn--ghost"
            onClick={clearAll}
            disabled={pagination.totalItems === 0}
          >
            <FiTrash2 /> Clear all
          </button>
          <button
            type="button"
            className="dashboard-panel__btn dashboard-panel__btn--primary"
            onClick={() => loadNotifications(pagination.currentPage, pagination.limit)}
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="content-loader">
          <Loader size="md" label="Loading notifications..." centered />
        </div>
      ) : notifications.length === 0 ? (
        <div className="dashboard-panel__empty">
          <span className="dashboard-panel__empty-icon" aria-hidden="true">
            <FiInbox />
          </span>
          <h3>No notifications yet</h3>
          <p>Your latest updates will appear here.</p>
        </div>
      ) : (
        <>
          <ul className="dashboard-panel__notifications">
            {notifications.map((item) => (
              <li
                key={item._id}
                className={`dashboard-panel__notification-item ${item.isRead ? "" : "dashboard-panel__notification-item--unread"}`}
              >
                <div className="dashboard-panel__notification-icon">
                  <FiBell />
                </div>
                <div className="dashboard-panel__notification-content">
                  <div className="dashboard-panel__notification-top">
                    <h3 className="dashboard-panel__notification-title">{item.title}</h3>
                    {!item.isRead && <span className="dashboard-panel__notification-badge">New</span>}
                  </div>
                  <p className="dashboard-panel__notification-message">{item.message}</p>
                  <div className="dashboard-panel__notification-footer">
                    <span className="dashboard-panel__notification-time">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                    <span className="dashboard-panel__notification-type">{item.type || "Info"}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            scrollTarget=".dashboard-panel"
            itemsPerPage={pagination.limit}
            onItemsPerPageChange={handleLimitChange}
            totalItems={pagination.totalItems}
          />
        </>
      )}
    </div>
  );
};

export default Notifications;
