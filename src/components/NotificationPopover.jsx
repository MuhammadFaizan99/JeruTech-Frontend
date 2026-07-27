import { useEffect, useRef, useState } from 'react';
import { FiBell, FiCheckCircle, FiClock, FiInbox, FiRefreshCw, FiTrash2, FiChevronRight } from 'react-icons/fi';

const iconMap = {
  success: <FiCheckCircle />,
  warning: <FiClock />,
  info: <FiBell />,
};

const relativeTime = (value) => {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationPopover = ({
  open,
  onClose,
  notifications = [],
  unreadCount = 0,
  onMarkOneRead,
  onMarkAllRead,
  onClearAll,
  onViewAll,
  onNavigate,
  loadingNotifications = false,
  anchorRef = null,
}) => {
  const panelRef = useRef(null);
  const [alignment, setAlignment] = useState('right');

  useEffect(() => {
    if (!open) return undefined;

    const updateAlignment = () => {
      const anchor = anchorRef && anchorRef.current;
      const viewportWidth = window.innerWidth;
      const panelWidth = Math.min(380, viewportWidth - 24);

      if (!anchor) {
        setAlignment('right');
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const fitsOnLeft = anchorRect.left + panelWidth <= viewportWidth - 12;
      const fitsOnRight = anchorRect.right - panelWidth >= 12;

      if (viewportWidth <= 520) {
        setAlignment('left');
      } else if (!fitsOnRight && fitsOnLeft) {
        setAlignment('left');
      } else {
        setAlignment('right');
      }
    };

    updateAlignment();
    window.addEventListener('resize', updateAlignment);
    window.addEventListener('scroll', updateAlignment, true);

    const handleOutsideClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && !(anchorRef && anchorRef.current && anchorRef.current.contains(event.target))) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('resize', updateAlignment);
      window.removeEventListener('scroll', updateAlignment, true);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open, anchorRef, onClose]);

  if (!open) return null;

  const pageSize = 5;
  const visibleItems = notifications.slice(0, pageSize);
  const hasMore = notifications.length > pageSize;

  return (
    <div ref={panelRef} className={`jerutech-notifications__panel jerutech-notifications__panel--${alignment}`}>
      <div className="jerutech-notifications__header">
        <div className="jerutech-notifications__header-title">
          <p className="jerutech-notifications__title">Notifications</p>
          <p className="jerutech-notifications__unread-count">{unreadCount} unread</p>
        </div>
        <button type="button" onClick={onMarkAllRead} className="jerutech-notifications__mark-all">
          Mark all read
        </button>
      </div>

      <div className="jerutech-notifications__list">
        {loadingNotifications ? (
          <div className="jerutech-notifications__empty">
            <FiInbox className="jerutech-notifications__empty-icon" />
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="jerutech-notifications__empty">
            <FiInbox className="jerutech-notifications__empty-icon" />
            No notifications yet.
          </div>
        ) : (
          visibleItems.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => {
                if (!item.isRead) onMarkOneRead([item._id]);
                if (item.link) onNavigate(item.link);
                onClose();
              }}
              className={`jerutech-notifications__item ${item.isRead ? 'jerutech-notifications__item--read' : 'jerutech-notifications__item--unread'}`}
            >
              <div className={`jerutech-notifications__item-card`}>
                <div className={`jerutech-notifications__icon ${item.type ? `jerutech-notifications__icon--${item.type}` : ''}`}>
                  {iconMap[item.type] || iconMap.info}
                </div>

                <div className="jerutech-notifications__content">
                  <div className="jerutech-notifications__meta">
                    <p className="jerutech-notifications__item-title">{item.title}</p>
                    <div className="jerutech-notifications__meta-right">
                      <p className="jerutech-notifications__unread-count-small">{!item.isRead ? 'New' : ''}</p>
                    </div>
                  </div>
                  <p className="jerutech-notifications__message line-clamp-2">{item.message}</p>
                  <div className="jerutech-notifications__item-footer">
                    <span className="jerutech-notifications__time">{relativeTime(item.createdAt)}</span>
                    <span className="jerutech-notifications__open">Open <FiChevronRight className="jerutech-notifications__open-icon" /></span>
                  </div>
                </div>

                {!item.isRead && <span className="jerutech-notifications__item-unread-dot" aria-hidden="true" />}
              </div>
            </button>
          ))
        )}
      </div>

      <div className="jerutech-notifications__footer">
        <button type="button" onClick={onClearAll} className="jerutech-notifications__btn jerutech-notifications__btn--ghost">
          <FiTrash2 className="jerutech-notifications__btn-icon" /> Clear all
        </button>
        <button type="button" onClick={onViewAll} className="jerutech-notifications__btn jerutech-notifications__btn--primary">
          <FiRefreshCw className="jerutech-notifications__btn-icon" /> View all notifications
        </button>
      </div>

      {hasMore && (
        <div className="jerutech-notifications__more-note">
          Showing latest {pageSize} of {notifications.length} notifications.
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
