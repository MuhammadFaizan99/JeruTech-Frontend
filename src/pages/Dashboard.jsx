import { useEffect } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  FiUser,
  FiPackage,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiCreditCard,
} from "react-icons/fi";
import ScrollReveal from "../components/effects/ScrollReveal";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProfile } from "../redux/slices/authSlice";
import PersonalInfo from "./dashboard/PersonalInfo";
import ProductsPurchased from "./dashboard/ProductsPurchased";
import Orders from "./dashboard/Orders";
import Wallet from "./dashboard/Wallet";
import Favourites from "./dashboard/Favourites";
import Settings from "./dashboard/Settings";
import "../styles/Dashboard.scss";

const menuItems = [
  { label: "Personal Info", path: "/dashboard", icon: FiUser, end: true },
  {
    label: "Products Purchased",
    path: "/dashboard/products-purchased",
    icon: FiPackage,
  },
  { label: "Orders", path: "/dashboard/orders", icon: FiShoppingBag },
  { label: "Wallet", path: "/dashboard/wallet", icon: FiCreditCard },
  { label: "Favourites", path: "/dashboard/favourites", icon: FiHeart },
  { label: "Settings", path: "/dashboard/settings", icon: FiSettings },
];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

  const activeItem =
    menuItems.find((item) =>
      item.end
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path),
    ) ?? menuItems[0];

  return (
    <div className="page-wrapper dashboard-page">
      <section className="dashboard-page__header">
        <ScrollReveal direction="up">
          <h1>My Dashboard</h1>
          <p>
            Welcome back{user?.customerName ? `, ${user.customerName}` : ""}.
            Manage your account and activity from here.
          </p>
        </ScrollReveal>
      </section>

      <section className="dashboard-page__body">
        <div className="dashboard-page__layout">
          <ScrollReveal direction="left" className="dashboard-page__sidebar-col">
            <aside className="dashboard-page__sidebar" aria-label="Dashboard navigation">
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
              </nav>
            </aside>
          </ScrollReveal>

          <ScrollReveal direction="right" className="dashboard-page__content-col">
            <div className="dashboard-page__content">
              <header className="dashboard-page__content-header">
                <h2>{activeItem.label}</h2>
              </header>

              <Routes>
                <Route index element={<PersonalInfo />} />
                <Route path="products-purchased" element={<ProductsPurchased />} />
                <Route path="orders" element={<Orders />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="favourites" element={<Favourites />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
