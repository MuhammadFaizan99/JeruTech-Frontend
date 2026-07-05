import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Drawer from "@mui/material/Drawer";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiShoppingCart, FiLayout } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProfile } from "../redux/slices/authSlice";
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

  const cartCount = useAppSelector((state) => state.cart.cartCount);
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

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

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mobile-drawer__actions">
                {isAuthenticated && (
                  <>
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

              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `mobile-drawer__link${isActive ? " active" : ""}`
                    }
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </Drawer>
    </header>
  );
};

export default Navbar;