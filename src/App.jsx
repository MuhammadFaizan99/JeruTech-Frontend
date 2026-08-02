import { useEffect } from "react";
import { useAppDispatch } from "./redux/hooks";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageBackground from "./components/effects/PageBackground";
import PageTransition from "./components/effects/PageTransition";
import LoadingScreen from "./components/effects/LoadingScreen";
import PremiumShell from "./components/effects/PremiumShell";
import NotificationProvider from "./components/NotificationProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Discount from "./pages/Discount";
import Learn from "./pages/Learn";
import BlogDetails from "./pages/BlogDetails";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import ContactSupportPage from "./pages/ContactSupportPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import ProductDetails from "./pages/ProductDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminSignIn from "./pages/AdminSignIn";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { useAppSelector } from "./redux/hooks";
import { fetchCart, fetchCheckoutSettings, resetCart } from "./redux/slices/cartSlice";
import { fetchMyWallet, resetWalletState } from "./redux/slices/walletSlice";
import "./styles/main.scss";

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
  const routeKey = location.pathname.startsWith("/dashboard")
    ? "/dashboard"
    : location.pathname;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [routeKey]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={routeKey}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/products"
          element={
            <PageTransition>
              <Products />
            </PageTransition>
          }
        />
        <Route
          path="/discount"
          element={
            <PageTransition>
              <Discount />
            </PageTransition>
          }
        />
        <Route
          path="/learn"
          element={
            <PageTransition>
              <Learn />
            </PageTransition>
          }
        />
        <Route
          path="/blogs/:slug"
          element={
            <PageTransition>
              <BlogDetails />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          }
        />
        <Route
          path="/contact-support"
          element={
            <PageTransition>
              <ContactSupportPage />
            </PageTransition>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PageTransition>
              <PrivacyPolicyPage />
            </PageTransition>
          }
        />
        <Route
          path="/terms-and-conditions"
          element={
            <PageTransition>
              <TermsAndConditionsPage />
            </PageTransition>
          }
        />
        <Route
          path="/cookie-policy"
          element={
            <PageTransition>
              <CookiePolicyPage />
            </PageTransition>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Cart />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PageTransition>
              <ProductDetails />
            </PageTransition>
          }
        />
        <Route
          path="/admin/signin"
          element={
            <PageTransition>
              <AdminSignIn />
            </PageTransition>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <PageTransition>
                <AdminDashboard />
              </PageTransition>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PageTransition>
              <SignIn />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <SignUp />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }, []);

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
      <NotificationProvider />
      <Router>
        <PageBackground />
        <PremiumShell />
        <Navbar />
        <main className="app-content">
          <AnimatedRoutes />
        </main>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
