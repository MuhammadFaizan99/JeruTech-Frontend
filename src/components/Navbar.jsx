import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiShoppingCart, FiLayout, FiBell } from "react-icons/fi";
import NotificationPopover from "./NotificationPopover";
import api from "../api";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProfile } from "../redux/slices/authSlice";
import { decrementUnreadCount, incrementUnreadCount, setUnreadCount } from "../redux/slices/notificationSlice";
import UserMenu from "./UserMenu";
import "../styles/Navbar.scss";
import logo from "../assets/logo.jpeg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Discounts", path: "/discount" },
  { label: "Learn / Blogs", path: "/learn" },
  { label: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const dispatch = useAppDispatch();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const bellButtonRef = useRef(null);

  const navigate = useNavigate();
  const cartCount = useAppSelector((state) => state.cart.cartCount);
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

  // fetch notifications when the notifications panel opens
  useEffect(() => {
    let mounted = true;
    const fetchNotifications = async () => {
      if (!token) return;
      setLoadingNotifications(true);
      try {
        const res = await api.get("/notifications", {
          params: {
            page: 1,
            limit: 5,
          },
        });
        const data = res.data?.data || {};
        if (!mounted) return;
        setNotifications(data.notifications || []);
        dispatch(setUnreadCount(data.unreadCount || 0));
      } catch (_err) {
        // no-op
      } finally {
        if (mounted) setLoadingNotifications(false);
      }
    };

    if (notificationsOpen) fetchNotifications();

    return () => {
      mounted = false;
    };
  }, [notificationsOpen, token]);

  // Wire real-time notifications via Socket.IO
  useRealtimeNotifications({
    onNotification: (payload) => {
      setNotifications((prev) => [payload, ...(prev || [])]);
      dispatch(incrementUnreadCount(1));
    },
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);
  const cartBadge = cartCount > 99 ? "99+" : cartCount;

  const markNotificationsAsRead = async (notificationIds = []) => {
    if (!notificationIds.length) return;
    try {
      await api.put("/notifications/read", { notificationIds });
      setNotifications((current) => {
        const unreadToMark = current.filter((item) => !item.isRead && notificationIds.includes(item._id)).length;
        if (unreadToMark > 0) {
          dispatch(decrementUnreadCount(unreadToMark));
        }
        return current.map((item) => (notificationIds.includes(item._id) ? { ...item, isRead: true } : item));
      });
    } catch (_error) {
      // no-op
    }
  };

  const markAllNotificationsRead = async () => {
    const unreadIds = notifications.filter((item) => !item.isRead).map((item) => item._id);
    if (!unreadIds.length) return;
    await markNotificationsAsRead(unreadIds);
  };

  const clearNotifications = async () => {
    try {
      await api.delete("/notifications");
      setNotifications([]);
      dispatch(setUnreadCount(0));
    } catch (_error) {
      // no-op
    }
  };

  const handleNavigate = (path) => {
    if (!path) return;
    navigate(path);
  };

  return (
    <header
      className={`jerutech-nav ${scrolled ? "jerutech-nav--scrolled" : ""}`}
    >
      <div className="jerutech-nav__container">
        <div className="jerutech-nav__bar">
          <Link to="/" className="jerutech-nav__logo">
            <span className="jerutech-nav__logo-glow" aria-hidden="true" />
            <img
              src={logo}
              alt="JeruTech Logo"
              className="jerutech-nav__logo-img"
            />
            <span className="jerutech-nav__logo-text">JeruTech</span>
          </Link>

          <nav className="jerutech-nav__links" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `jerutech-nav__link${isActive ? " active" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="jerutech-nav__actions">
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="jerutech-nav__dashboard-btn"
                  aria-label="Dashboard"
                >
                  <FiLayout size={18} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/cart"
                  className="jerutech-nav__icon-btn jerutech-nav__cart"
                  aria-label="Cart"
                >
                  <FiShoppingCart size={20} />
                  <span className="jerutech-nav__cart-badge" aria-live="polite">
                    {cartBadge}
                  </span>
                </Link>
              </>
            )}

            {isAuthenticated && (
              <div className="jerutech-nav__bell-wrapper">
                <button
                  ref={bellButtonRef}
                  type="button"
                  className="jerutech-nav__icon-btn"
                  aria-label="Notifications"
                  onClick={() => setNotificationsOpen((v) => !v)}
                >
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="jerutech-nav__cart-badge" aria-live="polite">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <NotificationPopover
                    open={notificationsOpen}
                    onClose={() => setNotificationsOpen(false)}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkOneRead={markNotificationsAsRead}
                    onMarkAllRead={markAllNotificationsRead}
                    onClearAll={clearNotifications}
                    onViewAll={() => handleNavigate("/dashboard/notifications")}
                    onNavigate={handleNavigate}
                    loadingNotifications={loadingNotifications}
                    anchorRef={bellButtonRef}
                  />
                )}
              </div>
            )}
            <UserMenu />
          </div>

          <button
            type="button"
            className="jerutech-nav__menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HiMenuAlt3 size={22} />
          </button>
        </div>

        <div className="jerutech-nav__gradient-line" aria-hidden="true" />
      </div>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobileMenu}
        PaperProps={{ className: "mobile-drawer", sx: { width: 280 } }}
      >
        <div className="mobile-drawer__header">
          <Link
            to="/"
            className="jerutech-nav__logo"
            onClick={closeMobileMenu}
          >
            <img
              src={logo}
              alt="JeruTech Logo"
              className="jerutech-nav__logo-img"
            />
            <span className="jerutech-nav__logo-text">JeruTech</span>
          </Link>

          <button
            type="button"
            className="mobile-drawer__close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <HiX size={20} />
          </button>
        </div>

        {mobileOpen && (
          <div className="mobile-drawer__content">
            <div className="mobile-drawer__actions">
              {isAuthenticated && (
                <>
                    <button
                      type="button"
                      className="mobile-drawer__dashboard-link"
                      onClick={() => {
                        setNotificationsOpen((value) => !value);
                        closeMobileMenu();
                      }}
                    >
                      <FiBell size={18} />
                      Notifications
                      {unreadCount > 0 && <span className="jerutech-nav__cart-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
                    </button>

                    <Link
                      to="/dashboard"
                      className="mobile-drawer__dashboard-link"
                      onClick={closeMobileMenu}
                    >
                      <FiLayout size={18} />
                      Dashboard
                    </Link>

                    <Link
                      to="/cart"
                      className="mobile-drawer__cart-link"
                      onClick={closeMobileMenu}
                    >
                      <FiShoppingCart size={18} />
                      Cart
                      <span className="jerutech-nav__cart-badge">
                        {cartBadge}
                      </span>
                    </Link>
                  </>
                )}

                <UserMenu
                  className="mobile-drawer__user"
                  onNavigate={closeMobileMenu}
                />
              </div>

              {navLinks.map((link) => (
                <div key={link.path} className="mobile-drawer__link-wrap">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `mobile-drawer__link${isActive ? " active" : ""}`
                    }
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </NavLink>
                </div>
              ))}

              {!isAuthenticated && (
                <div className="mobile-drawer__auth">
                  <Link
                    to="/signin"
                    className="mobile-drawer__auth-link"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    className="mobile-drawer__auth-link mobile-drawer__auth-link--primary"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
      </Drawer>
    </header>
  );
};

export default Navbar;