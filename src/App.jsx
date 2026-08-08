import { lazy, Suspense, useEffect } from "react";
import { useAppDispatch } from "./redux/hooks";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import LoadingScreen from "./components/effects/LoadingScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { useAppSelector } from "./redux/hooks";
import { fetchCart, fetchCheckoutSettings, resetCart } from "./redux/slices/cartSlice";
import { fetchMyWallet, resetWalletState } from "./redux/slices/walletSlice";
import "./styles/main.scss";

const PageBackground = lazy(() => import("./components/effects/PageBackground"));
const PremiumShell = lazy(() => import("./components/effects/PremiumShell"));
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const NotificationProvider = lazy(() => import("./components/NotificationProvider"));

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Discount = lazy(() => import("./pages/Discount"));
const Learn = lazy(() => import("./pages/Learn"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const ContactSupportPage = lazy(() => import("./pages/ContactSupportPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsAndConditionsPage = lazy(() => import("./pages/TermsAndConditionsPage"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const AdminSignIn = lazy(() => import("./pages/AdminSignIn"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2563EB", light: "#3B82F6", dark: "#1E3A8A" },
    background: { default: "#0F172A", paper: "#1E293B" },
    text: { primary: "#F8FAFC", secondary: "#CBD5E1" },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  },
});

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/discount" element={<Discount />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contact-support" element={<ContactSupportPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
      <Route path="/cookie-policy" element={<CookiePolicyPage />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/admin/signin" element={<AdminSignIn />} />
      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCheckoutSettings());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "customer") {
      dispatch(fetchCart());
      dispatch(fetchMyWallet());
      return;
    }

    if (!isAuthenticated) {
      dispatch(resetCart());
      dispatch(resetWalletState());
    }
  }, [dispatch, isAuthenticated, user?._id, user?.role]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingScreen />
      <Suspense fallback={null}>
        <NotificationProvider />
      </Suspense>
      <Router>
        <Suspense fallback={null}>
          <PageBackground />
        </Suspense>
        <Suspense fallback={null}>
          <PremiumShell />
        </Suspense>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="app-content">
          <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
            <AnimatedRoutes />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
