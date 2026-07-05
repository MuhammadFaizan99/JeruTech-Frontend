import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiUserCheck,
  FiLayout,
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { signOutUser } from "../redux/slices/authSlice";
import { resetCart } from "../redux/slices/cartSlice";
import { showSignOutConfirm } from "../utils/alerts";
import { showSuccessToast } from "../utils/toast";

const UserMenu = ({ className = "", onNavigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  const handleSignOut = async () => {
    const confirmed = await showSignOutConfirm();
    if (!confirmed) return;
    dispatch(signOutUser());
    dispatch(resetCart());
    close();
    showSuccessToast("You have been signed out");
    navigate("/");
  };

  const initials = user?.customerName
    ? user.customerName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <div
      className={`jerutech-nav__user-menu${isAuthenticated ? " jerutech-nav__user-menu--signed-in" : ""} ${className}`.trim()}
      ref={ref}
    >
      <button
        type="button"
        className={`jerutech-nav__icon-btn${isAuthenticated ? " jerutech-nav__icon-btn--active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={
          isAuthenticated
            ? `Signed in as ${user?.customerName}`
            : "Account menu"
        }
        aria-expanded={open}
      >
        {isAuthenticated ? (
          <>
            <FiUserCheck size={20} />
            <span className="jerutech-nav__user-initials">{initials}</span>
          </>
        ) : (
          <FiUser size={20} />
        )}
      </button>

      {open && (
        <div className="jerutech-nav__dropdown" role="menu">
          {isAuthenticated ? (
            <>
              <div className="jerutech-nav__dropdown-user">
                <span className="jerutech-nav__dropdown-name">
                  {user?.customerName}
                </span>
                <span className="jerutech-nav__dropdown-email">
                  {user?.email}
                </span>
              </div>
              <Link
                to="/dashboard"
                className="jerutech-nav__dropdown-item"
                role="menuitem"
                onClick={close}
              >
                <FiLayout />
                Dashboard
              </Link>
              <button
                type="button"
                className="jerutech-nav__dropdown-item jerutech-nav__dropdown-item--signout"
                role="menuitem"
                onClick={handleSignOut}
              >
                <FiLogOut />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="jerutech-nav__dropdown-item"
                role="menuitem"
                onClick={close}
              >
                <FiLogIn />
                Sign In
              </Link>
              <Link
                to="/signup"
                className="jerutech-nav__dropdown-item jerutech-nav__dropdown-item--primary"
                role="menuitem"
                onClick={close}
              >
                <FiUserPlus />
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
