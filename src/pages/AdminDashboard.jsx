import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { FiShoppingBag, FiCreditCard, FiLogOut } from "react-icons/fi";
import ScrollReveal from "../components/effects/ScrollReveal";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProfile, signOutUser } from "../redux/slices/authSlice";
import { resetAdminOrders } from "../redux/slices/orderSlice";
import { resetWalletState } from "../redux/slices/walletSlice";
import AdminOrders from "./admin/AdminOrders";
import AdminWallet from "./admin/AdminWallet";
import "../styles/Dashboard.scss";
import "../styles/Admin.scss";

const menuItems = [
  { label: "Orders", path: "/admin", icon: FiShoppingBag, end: true },
  { label: "Wallets", path: "/admin/wallets", icon: FiCreditCard },
];

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user, token } = useAppSelector((state) => state.auth);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

  const activeItem =
    menuItems.find((item) =>
      item.end
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path)
    ) ?? menuItems[0];

  const handleSignOut = () => {
    setSigningOut(true);
    dispatch(resetAdminOrders());
    dispatch(resetWalletState());
    dispatch(signOutUser());
  };

  return (
    <div className="page-wrapper dashboard-page admin-page">
      <section className="dashboard-page__header">
        <ScrollReveal direction="up">
          <h1>Admin Dashboard</h1>
          <p>
            Welcome{user?.customerName ? `, ${user.customerName}` : ""}. Review pending
            orders and manage wallets.
          </p>
        </ScrollReveal>
      </section>

      <section className="dashboard-page__body">
        <div className="dashboard-page__layout">
          <ScrollReveal direction="left" className="dashboard-page__sidebar-col">
            <aside className="dashboard-page__sidebar" aria-label="Admin navigation">
              <nav className="dashboard-page__nav">
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) =>
                        `dashboard-page__nav-link${isActive ? " active" : ""}`
                      }
                    >
                      <Icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}

                <button
                  type="button"
                  className="dashboard-page__nav-link admin-page__signout"
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  <FiLogOut aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </aside>
          </ScrollReveal>

          <ScrollReveal direction="right" className="dashboard-page__content-col">
            <div className="dashboard-page__content">
              <header className="dashboard-page__content-header">
                <h2>{activeItem.label}</h2>
              </header>

              <Routes>
                <Route index element={<AdminOrders />} />
                <Route path="wallets" element={<AdminWallet />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
